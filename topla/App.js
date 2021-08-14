import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { LogBox, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen'
import { getUniqueId, getDeviceId, getBundleId, getBuildNumber, getModel, getLastUpdateTime, getVersion } from 'react-native-device-info';
import NetInfo from "@react-native-community/netinfo"; // #TODO: -> switch to react-native-offline 
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Config from 'react-native-config';
import * as RNIap from 'react-native-iap';

// Firebase
//import crashlytics from "@react-native-firebase/crashlytics";
import analytics from '@react-native-firebase/analytics';

// Components 
import Main from './src/modules/Main';
import QuestionSettings from './src/modules/screens/questionsettings';
import PremiumScreen from './src/modules/screens/premium';
//import ContactScreen from './src/modules/screens/contact';
import QuestionScreen from './src/modules/screens/question';
import ResultScreen from './src/modules/screens/result';
//import CreditsScreen from './src/modules/screens/credits';

import store from './src/store';

const persistor = persistStore(store);
const Stack = createStackNavigator();

const App = () => {

  const _checkAppVersion = async () => {
    if (store.getState().API.DATA.API_TOKEN) {
      // Theres a api token present
      const { buildNumber } = store.getState().mainReducer.deviceInfo;
      const { softUpdateVer, hardUpdateVer } = store.getState().API.APP;
      if (buildNumber < hardUpdateVer) {
        await store.dispatch({ type: "SET_MODAL", payload: { hardUpdate: true } })
      } else if (buildNumber >= hardUpdateVer) {
        if (store.getState().API.DATA.banned) {
          await store.dispatch({ type: "SET_MODAL", payload: { banned: true } });
        } else {
          if (store.getState().API.DATA.APP_MAINTENANCE) {
            await store.dispatch({ type: "SET_MODAL", payload: { maintenance: true } });
          } else {
            SplashScreen.hide();
          }
          await store.getState().API.DATA.hasPremium || store.dispatch({ type: 'LOAD_ADS' });

          await store.dispatch({ type: "SET_MODAL", payload: { initialize: false } })
          if (buildNumber < softUpdateVer) {
            await store.dispatch({ type: "SET_MODAL", payload: { softUpdate: true, initialize: false } })
          } /*else {
            console.log("app is up to date!! got: ", buildNumber, " needSoft: ", softUpdateVer, " needHard: ", hardUpdateVer);
          }*/
        }
      }
    } else {
      console.log("no api token, cannot check latest version");
    }
  }

  const _setDeviceInfo = {
    deviceInfo: () => {
      return {
        uuid: getUniqueId(),
        id: getDeviceId(),
        buildNumber: getBuildNumber(),
        model: getModel(),
        bundleId: getBundleId(),
        version: getVersion(),
      }
    },
    set: async () => {
      await getLastUpdateTime().then((lastUpdateTime) => {
        const deviceInfo = { ..._setDeviceInfo.deviceInfo(), lastUpdated: lastUpdateTime };
        store.dispatch({ type: 'SET_DEVICE_INFO', payload: deviceInfo });
      });
    },
  }

  const _checkAnnouncements = () => {
    console.log("Checking announcements...");
    setTimeout(() => {
      if (store.getState().API.DATA.API_TOKEN) {
        if (store.getState().API.DATA.APP_ANNOUNCEMENTS) {
          if (store.getState().API.DATA.APP_ANNOUNCEMENTS.length > 0) {
            store.dispatch({ type: "SET_MODAL", payload: { announcements: true } });
            console.log("Theres announcements");
          } else {
            console.log("No announcements");
          }
        }
      }
    }, 3000)
  }

  const _INITIALIZE = {
    connTimer: null,
    init: async () => {
      console.log("API Dev Mode: ", Config.DEV_MODE);
      console.log("API URL: ", Config.DEV_MODE == 'true' ? Config.API_DEV_URL : Config.API_URL);
      LogBox.ignoreAllLogs(); // Ignore all logs
      await _setDeviceInfo.set();
      await store.dispatch({
        type: 'API_REGISTER',
        payload: {
          uuid: store.getState().mainReducer.deviceInfo.uuid,
          bundleId: store.getState().mainReducer.deviceInfo.bundleId,
          model: store.getState().mainReducer.deviceInfo.model,
        }
      });
      //setTimeout(async () => {
      await _INITIALIZE.connection();
      //}, 2000)
      const appInstanceId = await analytics().getAppInstanceId();
      console.log("APP_INSTANCE_ID: ", appInstanceId);
    },
    connection: async () => {
      if (store.getState().API.DATA.API_TOKEN) {
        console.log("GOT API_TOKEN, NO RETRIES: ", store.getState().API.DATA.API_TOKEN);
        _checkAnnouncements();
        _IAP.init();
      } else {
        console.log("NO API TOKEN | API MAX RETRIES ENABLED: ", Config.API_MAX_RETRIES_ENABLED);
        if (Config.API_REGISTER_RETRIES) {
          store.dispatch({ type: "API_RESET_RETRIES" });
          connTimer = setInterval(async () => {
            if (store.getState().API.DATA.API_TOKEN) {
              clearInterval(connTimer);
              _checkAnnouncements();
              _IAP.init();
            } else {
              console.log("API_STATE: ", store.getState().API);
              await store.dispatch({
                type: 'API_REGISTER',
                payload: {
                  uuid: store.getState().mainReducer.deviceInfo.uuid,
                  bundleId: store.getState().mainReducer.deviceInfo.bundleId,
                  model: store.getState().mainReducer.deviceInfo.model,
                }
              });
            }
            await store.dispatch({ type: "API_RETRY" });
            if (Config.API_MAX_RETRIES_ENABLED == 'true') {
              if (store.getState().API.retries >= Number(Config.API_MAX_RETRIES)) {
                console.log(`API TIMEOUT AFTER ${Config.API_MAX_RETRIES} RETRIES`);
                clearInterval(connTimer);
              }
            }
          }, Number(Config.API_RETRY_INTERVAL))
        } else {
          console.log("config retries closed")
        }
      }
    }
  }

  let _IAP = {
    purchaseUpdateSubscription: undefined,
    purchaseErrorSubscription: undefined,
    init: async () => {
      console.log("IAP INIT");
      RNIap.initConnection()
        .catch(() => {
          console.log("store error on IAP");

          RNIap.endConnection();
        })
        .then(async () => {

          const availablePurchases = await RNIap.getAvailablePurchases();
          console.log("Available Purchases: ", availablePurchases);
          await store.dispatch({
            type: 'API_IAP_INIT',
            payload: {
              data: availablePurchases,
              platform: Platform.OS,
              uuid: store.getState().mainReducer.deviceInfo.uuid,
              API_TOKEN: store.getState().API.DATA.API_TOKEN,
            }
          });

          RNIap.getSubscriptions(store.getState().API.DATA.APP_PRODUCTS).then((products) => {
            store.dispatch({
              type: 'API_SET_PRODUCTS',
              payload: products
            });
            _checkAppVersion();
          }).catch((error) => {
            console.log("error IAP: ", error.message);
          })

          setTimeout(async () => {
            console.log("iapInitData.hasPremium: ", store.getState().API.iapInitData.hasPremium, " data.hasPremium: ", store.getState().API.DATA.hasPremium)

            if (!(store.getState().API.iapInitData.hasPremium == store.getState().API.DATA.hasPremium)) {
              console.log("Api state and database doesn't match, refreshing register");
              await store.dispatch({
                type: 'API_REGISTER',
                payload: {
                  uuid: store.getState().mainReducer.deviceInfo.uuid,
                  bundleId: store.getState().mainReducer.deviceInfo.bundleId,
                  model: store.getState().mainReducer.deviceInfo.model,
                }
              });
            } else {
              console.log("API and iapInit hasPremium matches");
            }
          }, 4000)

          /*
          if (store.getState().API.iapInitData.success) {
            alert("user has premium dude");
            if (store.getState().API.DATA.hasPremium == false) {
              // Doesn't match with api and iap init
              await store.dispatch({
                type: 'API_REGISTER',
                payload: {
                  uuid: store.getState().mainReducer.deviceInfo.uuid,
                  bundleId: store.getState().mainReducer.deviceInfo.bundleId,
                  model: store.getState().mainReducer.deviceInfo.model,
                }
              });
            }
          }
          */

          purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
            console.log('purchaseUpdatedListener', purchase);
            const receipt = purchase.transactionReceipt;
            if (receipt) {
              await store.dispatch({
                type: 'API_CHECK_RECEIPT',
                payload: {
                  data: purchase,
                  platform: Platform.OS,
                  uuid: store.getState().mainReducer.deviceInfo.uuid,
                  API_TOKEN: store.getState().API.DATA.API_TOKEN,
                }
              });
              RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken).then(() => {
                console.log("finishing transaction")
                RNIap.finishTransaction(purchase, false).catch(err => {
                  console.log(err.code, err.message);
                }).then(async () => {
                  console.log("finished transaction");
                  alert("You have been subscribed successfully!");

                  setTimeout(async () => {
                    // Reload
                    await store.dispatch({
                      type: 'API_REGISTER',
                      payload: {
                        uuid: store.getState().mainReducer.deviceInfo.uuid,
                        bundleId: store.getState().mainReducer.deviceInfo.bundleId,
                        model: store.getState().mainReducer.deviceInfo.model,
                      }
                    });
                  }, 2000);
                });
              });
            } else {
              // Retry 
            }
          });

          purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
            console.log('purchaseErrorListener', error);
            if (error.code != "E_ALREADY_OWNED") {
              alert(error.message);
            }
          });

        });
    }
  }

  useEffect(async () => {
    _INITIALIZE.init();

    if (!store.getState().settings.lastSelectedByHand) {
      store.dispatch({ type: 'DARK_MODE', payload: Appearance.getColorScheme() });
      store.dispatch({ type: "LAST_DARKMODE_SELECTED_BYHAND", payload: false });
    }

    Appearance.addChangeListener(({ colorScheme }) => {
      store.dispatch({ type: 'DARK_MODE', payload: colorScheme });
      store.dispatch({ type: "LAST_DARKMODE_SELECTED_BYHAND", payload: false });
    });

    NetInfo.addEventListener((state) => {
      store.dispatch({ type: 'SET_DEVICE_CONNECTION', payload: { connectionType: state.type, isConnected: state.isConnected } });
    });

    return () => {
      Appearance.removeChangeListener(); // Fixed memory leak
      NetInfo.removeEventListener();

      try {
        _IAP.purchaseUpdateSubscription.remove();
      } catch (error) {
        console.log("Error with purchaseUpdateSubscription.remove()", error);
      }

      try {
        _IAP.purchaseErrorSubscription.remove();
      } catch (error) {
        console.log("Error with purchaseErrorSubscription.remove()", error);
      }

      try {
        RNIap.endConnection();
      } catch (error) {
        console.log("Error with RNIap.endConnection()", error);
      }
    };
  }, []);


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppearanceProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
              }}>
              <Stack.Screen
                name="Home"
                component={Main}
              />
              <Stack.Screen
                name="QuestionSettings"
                component={QuestionSettings}
              />
              <Stack.Screen
                name="PremiumScreen"
                component={PremiumScreen}
              />
              {/*
              
              <Stack.Screen
                name="ContactScreen"
                component={ContactScreen}
              /> 
              */}
              {/*
              <Stack.Screen
                name="CreditsScreen"
                component={CreditsScreen}
              /> 

              */}
              <Stack.Screen
                name="QuestionScreen"
                component={QuestionScreen}
                options={{
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="ResultScreen"
                component={ResultScreen}
                options={{
                  gestureEnabled: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AppearanceProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
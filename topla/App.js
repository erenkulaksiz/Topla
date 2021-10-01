import React, { useEffect } from 'react';
import { LogBox, Platform, Text } from 'react-native';
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
import Api from './src/utils/classes/api.js';
import I18n from './src/utils/i18n';

// Components 
import Home from './src/screens/root';
import QuestionSettings from './src/screens/questionsettings';
import PremiumScreen from './src/screens/premium';
import QuestionScreen from './src/screens/question';
import QuestionSlotScreen from './src/screens/questionslot';
import ResultScreen from './src/screens/result';

import store from './src/store';

const persistor = persistStore(store);
const Stack = createStackNavigator();

const App = () => {

  const _checkAppVersion = () => {
    console.log("Checking app version...");
    if (store.getState().API.DATA.API_TOKEN) {
      // Theres a api token present
      const { buildNumber } = store.getState().mainReducer.deviceInfo;
      const { softUpdateVer, hardUpdateVer } = store.getState().API.APP;
      if (buildNumber < hardUpdateVer) {
        store.dispatch({ type: "SET_MODAL", payload: { hardUpdate: true } })
      } else if (buildNumber >= hardUpdateVer) {
        if (store.getState().API.DATA.banned) {
          store.dispatch({ type: "SET_MODAL", payload: { banned: true } });
        } else {
          if (store.getState().API.DATA.APP_MAINTENANCE) {
            store.dispatch({ type: "SET_MODAL", payload: { maintenance: true } });
          } else {
            SplashScreen.hide();
          }

          if (buildNumber < softUpdateVer) {
            store.dispatch({ type: "SET_MODAL", payload: { softUpdate: true, initialize: false } })
          } else {
            console.log("app is up to date!! got: ", buildNumber, " needSoft: ", softUpdateVer, " needHard: ", hardUpdateVer);
            store.dispatch({ type: "SET_MODAL", payload: { initialize: false } })
          }
        }
      }
    } else {
      console.log("no api token, cannot check latest version");
    }
  }

  const _setDeviceInfo = new Promise((resolve, reject) => {
    const data = {
      uuid: getUniqueId(),
      id: getDeviceId(),
      buildNumber: getBuildNumber(),
      model: getModel(),
      bundleId: getBundleId(),
      version: getVersion(),
    }
    getLastUpdateTime().then((lastUpdateTime) => {
      let deviceInfo = { ...data, lastUpdated: lastUpdateTime };
      store.dispatch({ type: 'SET_DEVICE_INFO', payload: data });
      resolve(deviceInfo);
    });
  })

  const _checkAnnouncements = () => {
    console.log("Checking announcements...");
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
  }

  const _INITIALIZE = {
    connTimer: null,
    init() {
      console.log("API Dev Mode: ", Config.DEV_MODE);
      console.log("API URL: ", Config.DEV_MODE == 'true' ? Config.API_DEV_URL : Config.API_URL);
      LogBox.ignoreAllLogs();
      _setDeviceInfo.then((data) => {
        Api.registerDevice({
          uuid: data.uuid,
          bundleId: data.bundleId,
          model: data.model,
        })
          .then(response => response.json())
          .then(json => {
            if (json.success) {
              console.log("API HANDLER response INIT -> ", json);
              store.dispatch({ type: 'API_REGISTER', payload: { data: json } });
              _checkAnnouncements();
              _checkAppVersion();
              _IAP.init();
            }
          })
          .catch(error => {
            console.error(error);
            console.log("ERROR api");
            // Now, redirect to retry system
            _INITIALIZE.connection();
          });
      });
    },
    connection() {
      const launch = () => {
        clearInterval(connTimer);
        _checkAnnouncements();
        _checkAppVersion();
        _IAP.init();
      }
      console.log("NO API TOKEN | API MAX RETRIES ENABLED: ", Config.API_MAX_RETRIES_ENABLED);
      if (Config.API_REGISTER_RETRIES) {
        store.dispatch({ type: "API_RESET_RETRIES" });
        connTimer = setInterval(async () => {
          if (store.getState().API.DATA.API_TOKEN) {
            launch();
          } else {
            Api.registerDevice({
              uuid: store.getState().mainReducer.deviceInfo.uuid,
              bundleId: store.getState().mainReducer.deviceInfo.bundleId,
              model: store.getState().mainReducer.deviceInfo.model,
            })
              .then(response => response.json())
              .then(json => {
                if (json.success) {
                  console.log("API HANDLER response -> ", json);
                  store.dispatch({ type: 'API_REGISTER', payload: { data: json } });
                  launch();
                }
              })
              .catch(error => {
                console.error(error);
              });
          }
          store.dispatch({ type: "API_RETRY" });
          if (Config.API_MAX_RETRIES_ENABLED == 'true') {
            if (store.getState().API.retries >= Number(Config.API_MAX_RETRIES)) {
              console.log(`API TIMEOUT AFTER ${Config.API_MAX_RETRIES} RETRIES`);
              await clearInterval(connTimer);
            }
          }
          if (store.getState().API.retries == Number(Config.API_RETRY_WARNING_RETRIES)) {
            alert(I18n.t("API_connection_retry"));
          }
        }, Number(Config.API_RETRY_INTERVAL))
      } else {
        console.log("config retries closed")
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
          alert("Couldn't connect to RNIAP");
          RNIap.endConnection();
        })
        .then(async () => {
          RNIap.getAvailablePurchases().then(availablePurchases => {
            console.log("Available Purchases: ", availablePurchases);
            Api.IAPinit({ data: availablePurchases, platform: Platform.OS, uuid: store.getState().mainReducer.deviceInfo.uuid, API_TOKEN: store.getState().API.DATA.API_TOKEN })
              .then(response => { return response.json() })
              .then(data => {
                store.dispatch({ type: 'API_IAP_INIT', payload: { data: data } });
                if (data.success) {
                  console.log("User has subscription, API_IAP_INIT");
                } else if (data.success == false) {
                  console.log("Error with subscription, reason: ", data.reason);
                }
                if (!(data.hasPremium == store.getState().API.DATA.hasPremium)) {
                  console.log("Api state and database doesn't match, refreshing register");
                  Api.registerDevice({
                    uuid: store.getState().mainReducer.deviceInfo.uuid,
                    bundleId: store.getState().mainReducer.deviceInfo.bundleId,
                    model: store.getState().mainReducer.deviceInfo.model,
                  })
                    .then(response => response.json())
                    .then(json => {
                      if (json.success) {
                        console.log("API HANDLER response -> ", json);
                        store.dispatch({ type: 'API_REGISTER', payload: { data: json } });
                      }
                    })
                    .catch(error => {
                      console.error(error);
                    });
                } else {
                  console.log("API and iapInit hasPremium matches");
                }
              })
          });

          RNIap.getSubscriptions(store.getState().API.DATA.APP_PRODUCTS).then((products) => {
            store.dispatch({ type: 'API_SET_PRODUCTS', payload: products });
          }).catch((error) => {
            console.log("error IAP: ", error.message);
          })

          purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
            console.log('purchaseUpdatedListener', purchase);
            const receipt = purchase.transactionReceipt;
            if (receipt) {
              Api.checkReceipt({ data: purchase, platform: Platform.OS, uuid: store.getState().mainReducer.deviceInfo.uuid, API_TOKEN: store.getState().API.DATA.API_TOKEN })
                .then(response => { return response.json() })
                .then(data => {
                  console.log("@api check receipt response: ", data);

                  if (data.purchaseStatus == "success" && data.success == true) {
                    console.log(data.reason);

                    RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken).then(() => {
                      console.log("finishing transaction")
                      RNIap.finishTransaction(purchase, false).catch(err => {
                        console.log(err.code, err.message);
                      }).then(() => {
                        console.log("finished transaction");
                        alert("You have been subscribed successfully!");

                        Api.registerDevice({
                          uuid: store.getState().mainReducer.deviceInfo.uuid,
                          bundleId: store.getState().mainReducer.deviceInfo.bundleId,
                          model: store.getState().mainReducer.deviceInfo.model,
                        })
                          .then(response => response.json())
                          .then(json => {
                            if (json.success) {
                              console.log("API HANDLER response -> ", json);
                              store.dispatch({ type: 'API_REGISTER', payload: { data: json } });
                            }
                          })
                          .catch(error => {
                            console.error(error);
                          });
                      });
                    });
                  }
                })

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

    console.log("Checking SUB refreshes, Remaining: ", store.getState().settings.cooldown.refreshStatus);
    console.log("Sub refresh time: ", (Date.now() - store.getState().settings.cooldown.lastRefreshed));
    if (store.getState().settings.cooldown.refreshStatus < 1) {
      if ((Date.now() - store.getState().settings.cooldown.lastRefreshed) >= 86400000) {
        store.dispatch({ type: "RESET_REFRESH_STATUS" });
      } else {
        console.log("Cannot reset SUB refresh, remaining millis: ", (86400000 - (Date.now() - store.getState().settings.cooldown.lastRefreshed)));
      }
    } else {
      if (store.getState().settings.cooldown.refreshStatus < 5) {
        if ((Date.now() - store.getState().settings.cooldown.lastRefreshed) >= 86400000) {
          console.log("Had ", store.getState().settings.cooldown.refreshStatus, " subs and resetted it");
          store.dispatch({ type: "RESET_REFRESH_STATUS" });
        }
      }
      console.log("Remaining SUB refreshes: ", store.getState().settings.cooldown.refreshStatus, " Last used: ", store.getState().settings.cooldown.lastRefreshed)
    }

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
      <PersistGate loading={<Text>Loading PersistGate</Text>} persistor={persistor}>
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
                component={Home}
              />
              <Stack.Screen
                name="QuestionSettings"
                component={QuestionSettings}
              />
              <Stack.Screen
                name="PremiumScreen"
                component={PremiumScreen}
              />
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
              <Stack.Screen
                name="QuestionSlotScreen"
                component={QuestionSlotScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AppearanceProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen'
import { getUniqueId, getDeviceId, getBundleId, getBuildNumber, getModel, getLastUpdateTime } from 'react-native-device-info';
import NetInfo from "@react-native-community/netinfo"; // #TODO: -> switch to react-native-offline 
import Config from 'react-native-config';
import {
  AdMobInterstitial,
} from 'react-native-admob'

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

const Stack = createStackNavigator();

const App = () => {

  const _checkAppVersion = async () => {
    if (store.getState().API.DATA.API_TOKEN) {
      // Theres a api token present
      const currVer = store.getState().mainReducer.deviceInfo.buildNumber;
      const { softUpdateVer, hardUpdateVer } = store.getState().API.APP;

      if (currVer < hardUpdateVer) {
        console.log("UPDATE NEEDED FOR HARDUPDATE | VERSION HAVE: ", currVer, " neededHard: ", hardUpdateVer);
        store.dispatch({ type: "SET_MODAL", payload: { hardUpdate: true } })
      } else if (currVer >= hardUpdateVer) {
        if (store.getState().API.DATA.banned) {
          store.dispatch({ type: "SET_MODAL", payload: { banned: true } });
        } else {
          SplashScreen.hide();
          if (currVer < softUpdateVer) {
            console.log("UPDATE NEEDED FOR SOFTUPDATE | VERSION HAVE: ", currVer, " neededSoft: ", softUpdateVer);
            store.dispatch({ type: "SET_MODAL", payload: { softUpdate: true } })
          } else {
            console.log("app is up to date!! got: ", currVer, " needSoft: ", softUpdateVer, " needHard: ", hardUpdateVer);
          }
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
      }
    },
    set: async () => {
      await getLastUpdateTime().then((lastUpdateTime) => {
        const deviceInfo = { ..._setDeviceInfo.deviceInfo(), lastUpdated: lastUpdateTime };
        store.dispatch({ type: 'SET_DEVICE_INFO', payload: deviceInfo });
      });
    },
  }

  const _INITIALIZE = {
    connTimer: null,
    init: async () => {
      await _setDeviceInfo.set();
      await store.dispatch({
        type: 'API_REGISTER',
        payload: {
          uuid: store.getState().mainReducer.deviceInfo.uuid,
          bundleId: store.getState().mainReducer.deviceInfo.bundleId,
          model: store.getState().mainReducer.deviceInfo.model,
        }
      });
      setTimeout(async () => {
        await _INITIALIZE.connection();

      }, 2000)
      const appInstanceId = await analytics().getAppInstanceId();
      console.log("APP_INSTANCE_ID: ", appInstanceId);
    },
    connection: async () => {
      if (store.getState().mainReducer.connection.isConnected) {
        if (store.getState().API.DATA.API_TOKEN) {
          console.log("GOT API_TOKEN, NO RETRIES: ", store.getState().API.DATA.API_TOKEN);
          _checkAppVersion();
        } else {
          console.log("NO API TOKEN")
          let retries = 0;
          connTimer = setInterval(() => {
            if (store.getState().API.DATA.API_TOKEN) {
              console.log("@API_TOKEN: ", store.getState().API.API_TOKEN);
              clearInterval(connTimer);
              _checkAppVersion();
            } else {
              store.dispatch({
                type: 'API_REGISTER',
                payload: {
                  uuid: store.getState().mainReducer.deviceInfo.uuid,
                  bundleId: store.getState().mainReducer.deviceInfo.bundleId,
                  model: store.getState().mainReducer.deviceInfo.model,
                }
              });
            }
            retries++;
            const maxRetries = 5;
            if (retries >= maxRetries) {
              console.log(`API TIMEOUT AFTER ${maxRetries} RETRIES`);
              clearInterval(connTimer);
            }
            console.log(`${retries} RETRIES`)
          }, 3000)
        }
      } else {
        console.log("NO CONNECTION & NO API TOKEN");
      }
    }
  }

  useEffect(async () => {
    _INITIALIZE.init();

    store.dispatch({ type: 'DARK_MODE', payload: Appearance.getColorScheme() });

    Appearance.addChangeListener(({ colorScheme }) => {
      store.dispatch({ type: 'DARK_MODE', payload: colorScheme });
    });

    NetInfo.addEventListener((state) => {
      store.dispatch({ type: 'SET_DEVICE_CONNECTION', payload: { connectionType: state.type, isConnected: state.isConnected } });
    });

    return () => {
      Appearance.removeChangeListener(); // Fixed memory leak
      NetInfo.removeEventListener();
    };
  }, []);

  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;

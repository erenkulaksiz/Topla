import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen'
import { getUniqueId, getDeviceId, getBundleId, getBuildNumber, getModel, getLastUpdateTime } from 'react-native-device-info';
import NetInfo from "@react-native-community/netinfo"; // #TODO: -> switch to react-native-offline 
// Firebase
import crashlytics from "@react-native-firebase/crashlytics";
import analytics from '@react-native-firebase/analytics';

// Components 
import Main from './src/modules/Main';
import QuestionSettings from './src/modules/screens/questionsettings';
import PremiumScreen from './src/modules/screens/premium';
import ContactScreen from './src/modules/screens/contact';
import QuestionScreen from './src/modules/screens/question';
import ResultScreen from './src/modules/screens/result';
//import CreditsScreen from './src/modules/screens/credits';

import store from './store';

const Stack = createStackNavigator();

const App = () => {

  const _checkConnection = async () => {
    NetInfo.addEventListener((state) => {
      store.dispatch({ type: 'SET_DEVICE_CONNECTION', payload: { connectionType: state.type, isConnected: state.isConnected } });
      if (store.getState().mainReducer.connection.isConnected) {
        console.log("UUID: ", store.getState().mainReducer.deviceInfo.uuid);
        store.dispatch({
          type: 'API_REGISTER',
          payload: {
            uuid: store.getState().mainReducer.deviceInfo.uuid,
            bundleId: store.getState().mainReducer.deviceInfo.bundleId,
            model: store.getState().mainReducer.deviceInfo.model,
          }
        });
        SplashScreen.hide();
      } else {
        console.log("[!!!] cihazda bağlantı yok")
        SplashScreen.hide();
      }
    });
  }

  const _setDeviceInfo = {
    deviceInfo: () => {
      return {
        uuid: 'topla_' + getUniqueId(),
        id: getDeviceId(),
        buildNumber: getBuildNumber(),
        model: getModel(),
        bundleId: getBundleId(),
      }
    },
    set: async () => {
      await getLastUpdateTime().then((lastUpdateTime) => {
        //deviceInfo.lastUpdated = lastUpdateTime;
        const deviceInfo = { ..._setDeviceInfo.deviceInfo(), lastUpdated: lastUpdateTime };
        store.dispatch({ type: 'SET_DEVICE_INFO', payload: deviceInfo });
      });
    },
  }

  const _INITIALIZE = {
    connTimer: null,
    init: async () => {
      await _setDeviceInfo.set();
      await _checkConnection();
      setTimeout(() => {
        _INITIALIZE.connection();
      }, 2000)

      const appInstanceId = await analytics().getAppInstanceId();
      console.log("APP_INSTANCE_ID: ", appInstanceId);
    },
    connection: async () => {
      if (store.getState().mainReducer.connection.isConnected) {
        console.log("CONNECTED TO WIFI!");
        if (store.getState().API.DATA.API_TOKEN) {
          console.log("GOT API_TOKEN: ", store.getState().API.DATA.API_TOKEN);
        } else {
          console.log("NO API TOKEN")
          let retries = 0;
          connTimer = setInterval(() => {
            if (store.getState().API.DATA.API_TOKEN) {
              console.log("@API_TOKEN: ", store.getState().API.API_TOKEN);
              clearInterval(connTimer);
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
            const maxRetries = 2;
            if (retries >= maxRetries) {
              console.log(`API TIMEOUT AFTER ${maxRetries} RETRIES`);
              clearInterval(connTimer);
            }
          }, 3000)
        }
      } else {
        console.log("NO CONNECTION & NO API TOKEN");
      }
    }
  }

  useEffect(() => {
    _INITIALIZE.init();
    store.dispatch({ type: 'DARK_MODE', payload: Appearance.getColorScheme() });
    Appearance.addChangeListener(({ colorScheme }) => {
      store.dispatch({ type: 'DARK_MODE', payload: colorScheme });
      //console.log("DARK MODE CHANGED TO: ", colorScheme);
    });
    return () => {
      Appearance.removeChangeListener();
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
            <Stack.Screen
              name="ContactScreen"
              component={ContactScreen}
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
          </Stack.Navigator>
        </NavigationContainer>
      </AppearanceProvider>
    </Provider>
  );
}

export default App;

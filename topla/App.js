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
      //await _checkConnection();
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
        SplashScreen.hide();
      }, 2000)

      const appInstanceId = await analytics().getAppInstanceId();
      console.log("APP_INSTANCE_ID: ", appInstanceId);
    },
    connection: async () => {
      //console.log("currStore: ", currStore);
      if (store.getState().mainReducer.connection.isConnected) {
        console.log("CONNECTED TO WIFI!");
        if (store.getState().API.DATA.API_TOKEN) {
          console.log("GOT API_TOKEN: ", store.getState().API.DATA.API_TOKEN);
          console.log("GOT API TOKEN, NO RETRIES");
        } else {
          console.log("NO API TOKEN")
          let retries = 0;
          connTimer = setInterval(() => {
            console.log("--- TİMER --- : ", connTimer)
            if (store.getState().API.DATA.API_TOKEN) {
              console.log("@API_TOKEN: ", store.getState().API.API_TOKEN);
              clearInterval(connTimer);
            } else {
              const aStore = store.getState();
              store.dispatch({
                type: 'API_REGISTER',
                payload: {
                  uuid: aStore.mainReducer.deviceInfo.uuid,
                  bundleId: aStore.mainReducer.deviceInfo.bundleId,
                  model: aStore.mainReducer.deviceInfo.model,
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
      Appearance.removeChangeListener();
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

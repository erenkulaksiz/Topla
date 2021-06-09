import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen'
import { getUniqueId, getDeviceId, getBundleId, getBuildNumber, getModel, getLastUpdateTime } from 'react-native-device-info';
import NetInfo from "@react-native-community/netinfo"; // #TODO: -> switch to react-native-offline 

// Components 
import Main from './src/modules/Main';
import QuestionSettings from './src/modules/screens/questionsettings';
import PremiumScreen from './src/modules/screens/premium';
import ContactScreen from './src/modules/screens/contact';
import QuestionScreen from './src/modules/screens/question';
import ResultScreen from './src/modules/screens/result';

import reducer from './reducers';

const store = createStore(reducer);

const Stack = createStackNavigator();

const App = () => {

  const _checkConnection = async () => {
    NetInfo.addEventListener((state) => {
      store.dispatch({ type: 'SET_DEVICE_CONNECTION', payload: { connectionType: state.type, isConnected: state.isConnected } });
      if (store.getState().reducer.connection.isConnected) {
        store.dispatch({ type: 'API_REGISTER' });
        SplashScreen.hide();
      } else {
        console.log("[!!!] cihazda bağlantı yok")
        SplashScreen.hide();
      }
    });
  }

  const _setDeviceInfo = async () => {
    let deviceInfo = {
      uuid: 'topla_' + getUniqueId(),
      id: getDeviceId(),
      buildNumber: getBuildNumber(),
      model: getModel(),
      bundleId: getBundleId(),
    }
    await getLastUpdateTime().then((lastUpdateTime) => {
      deviceInfo.lastUpdated = lastUpdateTime;
      store.dispatch({ type: 'SET_DEVICE_INFO', payload: deviceInfo });
    });
  }

  const _INITIALIZE = {
    connTimer: null,
    init: async () => {
      await _setDeviceInfo();
      await _checkConnection();
      setTimeout(() => {
        _INITIALIZE.connection();
      }, 2000)
    },
    connection: async () => {
      if (store.getState().reducer.connection.isConnected) {
        console.log("CONNECTED TO WIFI!");
        if (store.getState().reducer.API.API_TOKEN) {
          console.log("GOT API_TOKEN: ", store.getState().reducer.API.API_TOKEN);
        } else {
          console.log("NO API TOKEN")
          // Eğer internete bağlıysa & API token yoksa sunucuya bağlanmayı dene

          connTimer = setInterval(() => {
            if (!store.getState().reducer.API.API_TOKEN) {
              store.dispatch({ type: 'API_REGISTER' });
            }
            console.log("@API_TOKEN: ", store.getState().reducer.API.API_TOKEN);

            if (store.getState().reducer.API.API_TOKEN) {
              clearInterval(connTimer);
            }
          }, 2000)

        }
      } else {
        console.log("NO CONNECTION & NO API TOKEN");
      }
    }
  }

  useEffect(() => {
    _INITIALIZE.init();
  }, []);

  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;

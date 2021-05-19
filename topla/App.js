import 'react-native-gesture-handler';
import React from 'react';
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

import reducer from './reducers';

const store = createStore(reducer);

const Stack = createStackNavigator();

class App extends React.Component {

  _setDeviceInfo = async () => {
    let deviceInfo = {
      uid: 'topla_' + getUniqueId(),
      id: getDeviceId(),
      buildNumber: getBuildNumber(),
      model: getModel(),
      bundleId: getBundleId(),
    }

    NetInfo.addEventListener(state => {
      store.dispatch({ type: 'SET_DEVICE_CONNECTION', payload: { connectionType: state.type, isConnected: state.isConnected } });
    });

    await getLastUpdateTime().then((lastUpdateTime) => {
      deviceInfo.lastUpdated = lastUpdateTime;
      store.dispatch({ type: 'SET_DEVICE_INFO', payload: deviceInfo });
    });

    SplashScreen.hide();
  }

  componentDidMount() {
    console.log("@App Launched");
    this._setDeviceInfo();
  }

  render() {
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
                gestureEnabled: false, // Soru sayfasında geri dönmek yok
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;

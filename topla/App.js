import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Main from './src/modules/Main';
import QuestionSettings from './src/modules/screens/questionsettings';
import PremiumScreen from './src/modules/screens/premium';

import reducer from './reducers';

const store = createStore(reducer);

const Stack = createStackNavigator();

class App extends React.Component {
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
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;

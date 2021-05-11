import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './src/modules/Main';
import Header from './src/modules/header';
import QuestionSettings from './src/modules/screens/questionsettings';

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
            }}>
            <Stack.Screen
              name="Home"
              component={Main}
            />
            <Stack.Screen
              name="QuestionSettings"
              component={QuestionSettings}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;

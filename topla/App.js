import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './modules/Main';
import Header from './modules/header';
import QuestionSettings from './modules/screens/questionsettings';

import reducer from './reducers';

const store = createStore(reducer);

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Main}
              options={{ headerTitle: props => <Header {...props} /> }}
            />
            <Stack.Screen
              name="QuestionSettings"
              component={QuestionSettings}
              options={{ headerTitle: props => <Header {...props} /> }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;

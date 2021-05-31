import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, /*faCrown,*/ faCog } from '@fortawesome/free-solid-svg-icons'

import I18n from "../utils/i18n.js";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/home'
import OptionsScreen from './screens/options';

const Tab = createBottomTabNavigator();

class Home extends React.Component {

    render() {

        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen}
                    options={{
                        tabBarLabel: I18n.t("home"),
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faHome} size={size} color={color} />
                        ),
                    }} />
                {/*<Tab.Screen name="Premium" component={PremiumScreen}
                    options={{
                        tabBarLabel: 'Premium',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faCrown} size={size} color={color} />
                        ),
                    }} />*/}
                <Tab.Screen name="Options" component={OptionsScreen}
                    options={{
                        tabBarLabel: I18n.t("settings"),
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faCog} size={size} color={color} />
                        ),
                    }} />
            </Tab.Navigator>
        );
    }
}

export default Home;
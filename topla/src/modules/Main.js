import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, /*faCrown,*/ faCog } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import I18n from "../utils/i18n.js";
import Theme from '../themes'

// Components 
import HomeScreen from './screens/home'
import OptionsScreen from './screens/options';

const Tab = createBottomTabNavigator();

const Home = (props) => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: true,
                activeTintColor: Theme(props.reducer.settings.darkMode).tabBarActiveTint,
                inactiveTintColor: Theme(props.reducer.settings.darkMode).tabBarInactiveTint,
                style: {
                    backgroundColor: Theme(props.reducer.settings.darkMode).tabBar,
                    borderTopWidth: 0,
                }
            }}>
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

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
    }
};

export default connect(mapStateToProps)(Home);
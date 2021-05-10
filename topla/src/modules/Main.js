import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, faCrown, faCog } from '@fortawesome/free-solid-svg-icons'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/home'
import PremiumScreen from './screens/premium';
import OptionsScreen from './screens/options';

const Tab = createBottomTabNavigator();

class Home extends React.Component {

    render() {

        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen}
                    options={{
                        tabBarLabel: 'Ana Sayfa',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faHome} size={size} color={color} />
                        ),
                    }} />
                <Tab.Screen name="Premium" component={PremiumScreen}
                    options={{
                        tabBarLabel: 'Premium',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faCrown} size={size} color={color} />
                        ),
                    }} />
                <Tab.Screen name="Options" component={OptionsScreen}
                    options={{
                        tabBarLabel: 'Ayarlar',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faCog} size={size} color={color} />
                        ),
                    }} />
            </Tab.Navigator>
        );
    }
}


const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(Home);
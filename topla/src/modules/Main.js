import React from 'react';
import { Text, Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, faCrown, faCog } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AwesomeAlert from 'react-native-awesome-alerts';
import Config from 'react-native-config';

import I18n from "../utils/i18n.js";
import Theme from '../themes'

// Components 
import HomeScreen from './screens/home'
import OptionsScreen from './screens/options';
import PremiumScreen from './screens/premium';

const Tab = createBottomTabNavigator();

const Home = (props) => {

    return (
        <>
            <Tab.Navigator
                tabBarOptions={{
                    showLabel: true,
                    activeTintColor: Theme(props.settings.darkMode).tabBarActiveTint,
                    inactiveTintColor: Theme(props.settings.darkMode).tabBarInactiveTint,
                    style: {
                        backgroundColor: Theme(props.settings.darkMode).tabBar,
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

                {
                    props.API.DATA.hasPremium == false && <Tab.Screen name="Premium" component={PremiumScreen}
                        options={{
                            tabBarLabel: 'Premium',
                            tabBarIcon: ({ color, size }) => (
                                <FontAwesomeIcon icon={faCrown} size={size} color={color} />
                            ),
                        }} />
                }

                <Tab.Screen name="Options" component={OptionsScreen}
                    options={{
                        tabBarLabel: I18n.t("settings"),
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faCog} size={size} color={color} />
                        ),
                    }} />
            </Tab.Navigator>
            <AwesomeAlert
                show={props.reducer.modals.announcements}
                showProgress={false}
                title={I18n.t("modals_announcements")}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showConfirmButton={true}
                useNativeDriver={true}
                confirmText={I18n.t("modals_okay")}
                confirmButtonColor="#1bb524"
                customView={<>
                    {props.API.DATA.APP_ANNOUNCEMENTS && props.API.DATA.APP_ANNOUNCEMENTS.map((el, indx) => {
                        return <Text>{indx + 1}. {el}</Text>
                    })}
                </>}
                onConfirmPressed={() => {
                    props.dispatch({ type: "SET_MODAL", payload: { announcements: false } })
                }}
            />
            <AwesomeAlert
                show={props.reducer.modals.selectKeys}
                showProgress={false}
                title={I18n.t("modals_select_keys")}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                useNativeDriver={true}
                showConfirmButton={true}
                confirmText={I18n.t("modals_okay")}
                confirmButtonColor="#1bb524"
                onConfirmPressed={() => {
                    props.dispatch({ type: "SET_MODAL", payload: { selectKeys: false } })
                }}
            />
            <AwesomeAlert
                show={props.reducer.modals.maintenance}
                showProgress={false}
                title={I18n.t("modals_maintenance")}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                useNativeDriver={true}
                showConfirmButton={false}
                titleStyle={{ fontSize: 16 }}
            />
            <AwesomeAlert
                show={props.reducer.modals.initialize}
                showProgress={true}
                useNativeDriver={true}
                animatedValue={0}
                progressColor={"#0f7cbb"}
                progressSize={32}
                title={I18n.t("modals_loading")}
                customView={<>
                    <Text>{Config.DEV_MODE == 'true' ? Config.API_DEV_URL : Config.API_URL}</Text>
                    <Text>{JSON.stringify(props.reducer.deviceInfo.uuid)}</Text>
                    <Text>{JSON.stringify(props.reducer.deviceInfo.buildNumber)}</Text>
                </>}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={false}
                titleStyle={{ fontSize: 18 }}
            />

            <AwesomeAlert
                show={props.reducer.modals.banned}
                showProgress={false}
                title={I18n.t("modals_banned_title")}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={false}
                useNativeDriver={true}
                contentContainerStyle={{ width: "90%" }}
                titleStyle={{ fontSize: 16 }}
            />
            <AwesomeAlert
                show={props.reducer.modals.softUpdate}
                showProgress={false}
                title={I18n.t("modals_new_update_title")}
                message={I18n.t("modals_softupdate")}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                useNativeDriver={true}
                cancelText={I18n.t("modals_update_cancel")}
                confirmText={I18n.t("modals_update_update")}
                confirmButtonColor="#1bb524"
                onCancelPressed={() => {
                    props.dispatch({ type: "SET_MODAL", payload: { softUpdate: false } })
                }}
                onConfirmPressed={() => {
                    const PLAY_STORE_LINK = 'market://details?id=' + props.reducer.deviceInfo.bundleId + '&rnd=' + Math.random();
                    Linking.openURL(PLAY_STORE_LINK).catch(err =>
                        console.error("An error occurred with linking to gplay market", err)
                    );
                }}
            />
            <AwesomeAlert
                show={props.reducer.modals.hardUpdate}
                showProgress={false}
                title={I18n.t("modals_new_update_title")}
                message={I18n.t("modals_hardupdate")}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                useNativeDriver={true}
                cancelText={I18n.t("modals_update_cancel")}
                confirmText={I18n.t("modals_update_update")}
                confirmButtonColor="#1bb524"
                onConfirmPressed={() => {
                    const PLAY_STORE_LINK = 'market://details?id=' + props.reducer.deviceInfo.bundleId + '&rnd=' + Math.random();
                    Linking.openURL(PLAY_STORE_LINK).catch(err =>
                        console.error("An error occurred with linking to gplay market", err)
                    );
                }}
            />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        settings: state.settings,
        API: state.API,
    }
};

export default connect(mapStateToProps)(Home);
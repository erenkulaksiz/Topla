import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSync, /*faBell,*/ faEnvelope, faCrown, faAdjust, faIdCard, faHeart } from '@fortawesome/free-solid-svg-icons'
import Config from 'react-native-config';
import {
    AdMobBanner,
    //AdMobInterstitial,
} from 'react-native-admob'

import I18n from "../../../utils/i18n.js";
import Theme from '../../../themes'
import Header from "../../header";
import style from './style';
import AwesomeAlert from 'react-native-awesome-alerts';

const OptionsScreen = props => {

    const _checkConnection = () => {
        return props.reducer.connection.isConnected
    }

    const _navigateToPremium = () => {
        if (_checkConnection()) {
            props.navigation.navigate('PremiumScreen');
        } else {
            props.dispatch({ type: "SET_MODAL", payload: { checkConnection: true } });
        }
    }

    const _navigateToContact = () => {
        //props.navigation.navigate('ContactScreen'); `string text ${expression} string text`
        console.log("MAILTO: ", Config.DEVELOPER_CONTACT_MAIL);
        const mail = {
            subject: `Topla Support`,
            body: `[${props.reducer.deviceInfo.uuid},${props.reducer.deviceInfo.buildNumber}] ${I18n.t("contact_message")} `,
        };
        Linking.openURL(`mailto:${Config.DEVELOPER_CONTACT_MAIL}?subject=${mail.subject}&body=${mail.body}`);
    }

    const _refreshPremium = () => {
        props.dispatch({
            type: 'API_REGISTER',
            payload: {
                uuid: props.reducer.deviceInfo.uuid,
                bundleId: props.reducer.deviceInfo.bundleId,
                model: props.reducer.deviceInfo.model,
            }
        });
        alert(I18n.t("subscription_renew")); // Abonelik yenilendi .<-
    }

    const _darkMode = () => {
        props.dispatch({ type: "DARK_MODE", payload: props.settings.darkMode == 'dark' ? "light" : "dark" });
        props.dispatch({ type: "LAST_DARKMODE_SELECTED_BYHAND", payload: true });
    }

    return (
        <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            <Header />
            <View style={style.headerContainer}>
                <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("settings")}</Text>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
            </View>
            <View style={{ ...style.content, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                <View style={style.buttonsWrapper}>
                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }} onPress={() => _refreshPremium()}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faSync} size={16} color={Theme(props.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("settings_refreshSubscription")}</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }}>
                        <View style={style.buttonIcon}>
                            <FontAwesomeIcon icon={faBell} size={16} color={"#000"} />
                        </View>
                        <Text style={style.buttonText}>Bildirimler</Text>
                    </TouchableOpacity>*/}
                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }} onPress={() => _navigateToContact()}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faEnvelope} size={16} color={Theme(props.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("settings_contact")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }} onPress={() => _navigateToPremium()}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faCrown} size={16} color={Theme(props.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("settings_removeAds")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }} onPress={() => _darkMode()}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faAdjust} size={16} color={Theme(props.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("settings_darkMode")}</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }} onPress={async () => {
                        await props.dispatch({
                            type: 'API_PREMIUM',
                            payload: {
                                uuid: props.reducer.deviceInfo.uuid,
                            }
                        });
                        await props.dispatch({ type: "SET_MODAL", payload: { premiumGiven: true } });
                    }}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <Text>Debug</Text>
                        </View>
                        <Text style={style.buttonText}>givePremium</Text>
                    </TouchableOpacity>

                </View>
                <View style={style.altContent}>
                    <TouchableOpacity style={style.altTextWrapper} onPress={() => { Clipboard.setString("" + props.reducer.deviceInfo.uuid); alert("UID Kopyalandı") }}>
                        <FontAwesomeIcon icon={faIdCard} size={16} style={{ marginRight: 6, }} color={Theme(props.settings.darkMode).textDefault} />
                        <Text style={{ ...style.altText, color: Theme(props.settings.darkMode).textDefault }}>UID: {props.reducer.deviceInfo.uuid}</Text>
                    </TouchableOpacity>
                    <View style={style.altTextWrapper}>
                        <Text style={{ ...style.altText, color: Theme(props.settings.darkMode).textDefault }}>v{props.reducer.deviceInfo.version}, {props.reducer.deviceInfo.buildNumber}</Text>
                    </View>
                    <TouchableOpacity style={style.altTextWrapper} onPress={() => { Linking.openURL(Config.DEVELOPER_GITHUB_ACCOUNT); }}>
                        <Text style={{ ...style.altText, fontSize: 10, color: Theme(props.settings.darkMode).textDefault }}>Coded with <FontAwesomeIcon icon={faHeart} size={8} color={Theme(props.settings.darkMode).textDefault} /></Text>
                    </TouchableOpacity>
                </View>
            </View>
            <AwesomeAlert
                show={props.reducer.modals.premiumGiven}
                showProgress={false}
                title={"hasPremium: " + props.API.DATA.hasPremium}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showConfirmButton={true}
                confirmText={I18n.t("modals_okay")}
                confirmButtonColor="#0f7cbb"
                onConfirmPressed={() => {
                    props.dispatch({ type: "SET_MODAL", payload: { premiumGiven: false } })
                }}
            />
            <AwesomeAlert
                show={props.reducer.modals.checkConnection}
                showProgress={false}
                title={"İnternet bağlantınızı kontrol ediniz"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showConfirmButton={true}
                confirmText={I18n.t("modals_okay")}
                confirmButtonColor="#0f7cbb"
                onConfirmPressed={() => {
                    props.dispatch({ type: "SET_MODAL", payload: { checkConnection: false } })
                }}
            />
            {
                props.API.DATA.hasPremium || <View style={{ width: "100%" }}>
                    <AdMobBanner
                        adSize="smartBanner"
                        adUnitID={Config.ADMOB_BANNER_OPTIONS}
                        testDevices={[AdMobBanner.simulatorId]}
                        onAdFailedToLoad={error => console.error(error)}
                    />
                </View>
            }
        </SafeAreaView>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        settings: state.settings,
        API: state.API,
    }
};

export default connect(mapStateToProps)(OptionsScreen);
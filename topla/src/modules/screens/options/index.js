import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, Linking } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSync, /*faBell,*/ faEnvelope, faCrown, faAdjust } from '@fortawesome/free-solid-svg-icons'
import Config from 'react-native-config';

import I18n from "../../../utils/i18n.js";
import Theme from '../../../themes'
import Header from "../../header";
import style from './style';

const OptionsScreen = props => {

    const _checkConnection = () => {
        return props.reducer.connection.isConnected
    }

    const _navigateToPremium = () => {
        if (_checkConnection()) {
            props.navigation.navigate('PremiumScreen');
        } else {
            alert("İnternet bağlantınızı kontrol ediniz");
        }
    }

    const _navigateToContact = () => {
        //props.navigation.navigate('ContactScreen'); `string text ${expression} string text`
        console.log("MAILTO: ", Config.DEVELOPER_CONTACT_MAIL);
        const mail = {
            subject: `[${props.reducer.deviceInfo.uuid}] Support`,
            body: `Message: `,
        };
        Linking.openURL(`mailto:${Config.DEVELOPER_CONTACT_MAIL}?subject=${mail.subject}&body=${mail.body}`);
    }

    const _refreshPremium = () => {
        alert("Refreshed.");
    }

    const _darkMode = () => {
        props.dispatch({ type: "DARK_MODE", payload: props.reducer.settings.darkMode == 'dark' ? "light" : "dark" });
        //alert("Koyu mod: " + props.reducer.settings.darkMode);
    }

    return (
        <View style={{ ...style.container, backgroundColor: Theme(props.reducer.settings.darkMode).container }}>
            <Header />
            <View style={style.headerContainer}>
                <Text style={{ ...style.headerText, color: Theme(props.reducer.settings.darkMode).text }}>{I18n.t("settings")}</Text>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.reducer.settings.darkMode).bar }}></View>
            </View>
            <View style={{ ...style.content, backgroundColor: Theme(props.reducer.settings.darkMode).questionSlotBackground }}>
                <View style={style.buttonsWrapper}>
                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.reducer.settings.darkMode).settingsButtonBackground }} onPress={() => _refreshPremium()}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.reducer.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faSync} size={16} color={Theme(props.reducer.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.reducer.settings.darkMode).textDefault }}>{I18n.t("settings_refreshSubscription")}</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }}>
                        <View style={style.buttonIcon}>
                            <FontAwesomeIcon icon={faBell} size={16} color={"#000"} />
                        </View>
                        <Text style={style.buttonText}>Bildirimler</Text>
                    </TouchableOpacity>*/}
                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.reducer.settings.darkMode).settingsButtonBackground }} onPress={() => _navigateToContact()}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.reducer.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faEnvelope} size={16} color={Theme(props.reducer.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.reducer.settings.darkMode).textDefault }}>{I18n.t("settings_contact")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.reducer.settings.darkMode).settingsButtonBackground }} onPress={() => _navigateToPremium()}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.reducer.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faCrown} size={16} color={Theme(props.reducer.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.reducer.settings.darkMode).textDefault }}>{I18n.t("settings_removeAds")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.reducer.settings.darkMode).settingsButtonBackground }} onPress={() => _darkMode()}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.reducer.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faAdjust} size={16} color={Theme(props.reducer.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.reducer.settings.darkMode).textDefault }}>{I18n.t("settings_darkMode")}</Text>
                    </TouchableOpacity>
                    {/*
                    <TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }} onPress={() => console.log("api", props.reducer.API)}>
                        <View style={style.buttonIcon}>
                            <FontAwesomeIcon icon={faAdjust} size={16} color={"#000"} />
                        </View>
                        <Text style={style.buttonText}>Debug</Text>
                    </TouchableOpacity>
                    */}
                </View>
                <View style={style.altContent}>
                    <TouchableOpacity style={style.altTextWrapper} onPress={() => { Clipboard.setString("" + props.reducer.deviceInfo.uid); alert("UID Kopyalandı") }}>
                        <Text style={style.altText}>UID: {props.reducer.deviceInfo.uuid}</Text>
                        {/*<Text style={style.altText}>TOKEN: {props.reducer.API.API_TOKEN ? props.reducer.API.API_TOKEN : "no token"}</Text>*/}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer
    }
};

export default connect(mapStateToProps)(OptionsScreen);
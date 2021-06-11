import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSync, /*faBell,*/ faEnvelope, faCrown, faAdjust } from '@fortawesome/free-solid-svg-icons'

import Header from "../../header";

import I18n from "../../../utils/i18n.js";

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
        props.navigation.navigate('ContactScreen');
    }

    const _refreshPremium = () => {
        alert("Refreshed.");
    }

    const _darkMode = () => {
        props.dispatch({ type: "DARK_MODE" });
        alert("Koyu mod: " + props.reducer.settings.darkMode);
    }

    return (
        <View style={style.container}>
            <Header />
            <View style={style.headerContainer}>
                <Text style={style.headerText}>{I18n.t("settings")}</Text>
                <View style={style.headerBar}></View>
            </View>
            <View style={style.content}>
                <View style={style.buttonsWrapper}>
                    <TouchableOpacity style={style.button} onPress={() => _refreshPremium()}>
                        <View style={style.buttonIcon}>
                            <FontAwesomeIcon icon={faSync} size={16} color={"#000"} />
                        </View>
                        <Text style={style.buttonText}>{I18n.t("settings_refreshSubscription")}</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }}>
                        <View style={style.buttonIcon}>
                            <FontAwesomeIcon icon={faBell} size={16} color={"#000"} />
                        </View>
                        <Text style={style.buttonText}>Bildirimler</Text>
                    </TouchableOpacity>*/}
                    <TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }} onPress={() => _navigateToContact()}>
                        <View style={style.buttonIcon}>
                            <FontAwesomeIcon icon={faEnvelope} size={16} color={"#000"} />
                        </View>
                        <Text style={style.buttonText}>{I18n.t("settings_contact")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.button }} onPress={() => _navigateToPremium()}>
                        <View style={style.buttonIcon}>
                            <FontAwesomeIcon icon={faCrown} size={16} color={"#000"} />
                        </View>
                        <Text style={style.buttonText}>{I18n.t("settings_removeAds")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }} onPress={() => _darkMode()}>
                        <View style={style.buttonIcon}>
                            <FontAwesomeIcon icon={faAdjust} size={16} color={"#000"} />
                        </View>
                        <Text style={style.buttonText}>{I18n.t("settings_darkMode")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }} onPress={() => console.log("api", props.reducer.API)}>
                        <View style={style.buttonIcon}>
                            <FontAwesomeIcon icon={faAdjust} size={16} color={"#000"} />
                        </View>
                        <Text style={style.buttonText}>Debug</Text>
                    </TouchableOpacity>
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
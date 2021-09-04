import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSync, /*faBell,*/ faEnvelope, /*faCrown,*/ faAdjust, faIdCard, faHeart, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import Config from 'react-native-config';
import * as RNIap from 'react-native-iap';

import I18n from "../../utils/i18n.js";
import Theme from "../../themes";
import Header from "../../modules/header";
import style from "./style";
import AwesomeAlert from "react-native-awesome-alerts";

const OptionsScreen = props => {

    const _checkConnection = () => {
        return props.reducer.connection.isConnected
    }

    const _navigate = {
        premium: () => {
            if (_checkConnection()) {
                props.navigation.navigate('PremiumScreen');
            } else {
                props.dispatch({ type: "SET_MODAL", payload: { checkConnection: true } });
            }
        },
        contact: () => {
            const mail = {
                subject: `Topla Support`,
                body: `[${props.reducer.deviceInfo.uuid},${props.reducer.deviceInfo.buildNumber}] ${I18n.t("contact_message")} `,
            };
            Linking.openURL(`mailto:${Config.DEVELOPER_CONTACT_MAIL}?subject=${mail.subject}&body=${mail.body}`);
        },
        tac: () => {
            // Terms and conditions
            Linking.openURL(Config.APP_TAC_URL);
        }
    }

    const _refreshPremium = () => {
        if (props.settings.cooldown.refreshStatus > 0) {
            RNIap.initConnection()
                .catch(() => {
                    console.log("store error on IAP");

                    RNIap.endConnection();
                })
                .then(async () => {

                    const availablePurchases = await RNIap.getAvailablePurchases();
                    console.log("@OPTIONS Available Purchases: ", availablePurchases);
                    await props.dispatch({
                        type: 'API_IAP_INIT',
                        payload: {
                            data: availablePurchases,
                            platform: Platform.OS,
                            uuid: props.reducer.deviceInfo.uuid,
                            API_TOKEN: props.API.DATA.API_TOKEN,
                        }
                    });

                    setTimeout(async () => {
                        console.log("iapInitData.hasPremium: ", props.API.iapInitData.hasPremium, " data.hasPremium: ", props.API.DATA.hasPremium)

                        if (!(props.API.iapInitData.hasPremium == props.API.DATA.hasPremium)) {
                            console.log("Api state and database doesn't match, refreshing register");

                            await Api.registerDevice({
                                uuid: props.reducer.deviceInfo.uuid,
                                bundleId: props.reducer.deviceInfo.bundleId,
                                model: props.reducer.deviceInfo.model,
                            })
                                .then(response => response.json())
                                .then(json => {
                                    if (json.success) {
                                        console.log("API HANDLER response -> ", json);
                                        store.dispatch({
                                            type: 'API_REGISTER',
                                            payload: {
                                                data: json
                                            }
                                        });
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                });
                        } else {
                            console.log("API and iapInit hasPremium matches");
                        }
                    }, 4000)

                    RNIap.endConnection();

                    props.dispatch({ type: "USE_REFRESH_STATUS", payload: Date.now() });

                    alert(I18n.t("subscription_renew")); // Abonelik yenilendi .<-

                });
        } else {
            alert("You are refreshing too much! Wait 24 hours and check back later.");
        }
    }

    useEffect(() => {

        return () => {
            try {
                RNIap.endConnection();
            } catch (error) {
                console.log("Error with RNIap.endConnection() @ options", error);
            }
        };
    }, [])

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

                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }}
                        onPress={() => _refreshPremium()}>

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

                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }}
                        onPress={() => _navigate.contact()}>

                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faEnvelope} size={16} color={Theme(props.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("settings_contact")}</Text>
                    </TouchableOpacity>

                    {
                        /*
                            <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }}
                                onPress={() => _navigate.premium()}>
    
                                <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                                    <FontAwesomeIcon icon={faCrown} size={16} color={Theme(props.settings.darkMode).textDefault} />
                                </View>
                                <Text style={{ ...style.buttonText, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("settings_removeAds")}</Text>
                            </TouchableOpacity>
                        */
                    }

                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }}
                        onPress={() => _darkMode()}>

                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faAdjust} size={16} color={Theme(props.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("settings_darkMode")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).settingsButtonBackground }}
                        onPress={() => _navigate.tac()}>
                        <View style={{ ...style.buttonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <FontAwesomeIcon icon={faFileAlt} size={16} color={Theme(props.settings.darkMode).textDefault} />
                        </View>
                        <Text style={{ ...style.buttonText, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("terms_and_conditions")}</Text>
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
import React from 'react';
import { Text, View, TouchableOpacity, Image } from "react-native";
import { connect } from 'react-redux';
//import Config from 'react-native-config';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faStar, faPlay } from '@fortawesome/free-solid-svg-icons'

import style from "./style";
import I18n from "../../utils/i18n.js";
import Theme from "../../themes";
import ProgressBar from "../../modules/progressbar";
import { map } from '../../utils';

const ChildPlaySlotScreen = props => {

    const _navigateToVersus = () => {

    }

    const _renderChildPlaySlot = () => {
        return (
            <TouchableOpacity
                style={{ marginBottom: 24, marginTop: 16, shadowColor: props.settings.darkMode ? "#FFF" : "#919191" }}
                onPress={() => _navigateToVersus()}
                activeOpacity={0.7} >
                <View style={{
                    ...style.element,
                    backgroundColor: Theme(props.settings.darkMode).questionSlotBackground
                }}>
                    <Image style={style.elementLogo} source={require('../../tc.png')} />
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <Text style={{ ...style.elementTitle, color: Theme(props.settings.darkMode).textDefault, height: "100%" }}>
                            {I18n.t("childplay_title_adition")}
                        </Text>
                    </View>

                    <View style={style.elementBar} />
                    <Text style={{ ...style.elementContent, color: Theme(props.settings.darkMode).textDefault }}>
                        Gittikçe zorlaşan, çocuklar için toplama ve çıkarma işlemleri
                    </Text>
                    <View style={{ ...style.elementBar, marginTop: 10 }} />

                    <View style={{ marginTop: 8 }}>
                        <ProgressBar value={50} height={16} />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                        <View style={{ flexDirection: "row", height: "100%", alignItems: "center" }}>
                            <FontAwesomeIcon icon={faStar} size={18} color={Theme(props.settings.darkMode).textDefault} style={{ marginRight: 8 }} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 24, fontWeight: "bold" }}>6<Text style={{ fontSize: 18, fontWeight: "200" }}>/50</Text></Text>
                        </View>
                    </View>
                </View>
                <View
                    style={style.play}
                    activeOpacity={0.7}>
                    <FontAwesomeIcon icon={faPlay} size={18} color={'white'} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {
                /*
                    <View style={style.headerContainer}>
                        <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("home_childPlayTitle")}</Text>
                        <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
                    </View>
                */
            }

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 24 }}>Coming soon...</Text>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        questionSettings: state.questionSettings,
        API: state.API,
        settings: state.settings,
    }
};

export default connect(mapStateToProps)(ChildPlaySlotScreen);
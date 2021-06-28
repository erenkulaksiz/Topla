import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableWithoutFeedback } from 'react-native';

import style from './style';
import Header from "../../header";
import I18n from "../../../utils/i18n.js";
import Theme from '../../../themes'

const PremiumScreen = props => {
    return (
        <View style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            <Header backShown onBack={() => { props.navigation.goBack() }} />
            <View style={style.headerContainer}>
                <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("settings_removeAds")}</Text>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
            </View>
            <View style={style.content}>
                <TouchableWithoutFeedback onPress={() => { alert("asdas") }}>
                    <View style={{ ...style.premiumWrapper, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                        <Text>asdasd</Text>
                    </View>
                </TouchableWithoutFeedback>

            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        settings: state.settings,
        API: state.API,
    }
};

export default connect(mapStateToProps)(PremiumScreen);
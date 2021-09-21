import React from 'react';
import { Text, View } from "react-native";
import { connect } from 'react-redux';

import style from "./style";
import I18n from "../../utils/i18n.js";
import Theme from "../../themes";

const LearnScreen = props => {
    return (
        <View style={{ flex: 1 }}>
            {
                /*
                    <View style={style.headerContainer}>
                        <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("home_learnTitle")}</Text>
                        <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
                    </View>
                */
            }

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: Theme(props.settings.darkMode).textDefault, fontWeight: "bold", fontSize: 24 }}>Coming soon...</Text>
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

export default connect(mapStateToProps)(LearnScreen);
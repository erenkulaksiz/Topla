import React, { useEffect } from 'react';
import { Text, View, ScrollView } from "react-native";
import { connect } from 'react-redux';
import Config from 'react-native-config';

import style from './style';
import I18n from "../../../utils/i18n.js";
import QuestionSlot from "../../questionslot";
import Header from "../../header";
import Theme from '../../../themes'

import {
    AdMobBanner,
    //AdMobInterstitial,
} from 'react-native-admob'

const HomeScreen = props => {

    const _questionPlay = question => {
        props.navigation.navigate('QuestionSettings', { question: question })
    }

    return (
        <View style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            <Header />
            <View style={style.headerContainer}>
                <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("home")}</Text>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
            </View>
            <ScrollView
                style={style.questionsScroll}
                snapToAlignment="start"
                snapToInterval={190}>
                {props.questionSettings.questionInitials.map((question, index) => {
                    return (<QuestionSlot
                        key={index}
                        onPlay={() => { _questionPlay(question) }}
                        question={question}
                    />)
                })}
            </ScrollView>
            {
                props.API.DATA.hasPremium || <View style={{ width: "100%" }}>
                    <AdMobBanner
                        adSize="smartBanner"
                        adUnitID={Config.ADMOB_BANNER}
                        testDevices={[AdMobBanner.simulatorId]}
                        onAdFailedToLoad={error => console.error(error)}
                    />
                </View>
            }
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

export default connect(mapStateToProps)(HomeScreen);
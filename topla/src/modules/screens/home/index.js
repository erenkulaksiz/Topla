import React from 'react';
import { Text, View, ScrollView } from "react-native";
import { connect } from 'react-redux';

import style from './style';
import I18n from "../../../utils/i18n.js";
import QuestionSlot from "../../questionslot";
import Header from "../../header";
import Theme from '../../../themes'

import {
    AdMobBanner,
} from 'react-native-admob'

const HomeScreen = props => {

    const _questionPlay = question => {
        props.navigation.navigate('QuestionSettings', { question: question })
    }

    return (
        <View style={{ ...style.container, backgroundColor: Theme(props.reducer.settings.darkMode).container }}>
            <Header />
            <View style={style.headerContainer}>
                <Text style={{ ...style.headerText, color: Theme(props.reducer.settings.darkMode).text }}>{I18n.t("home")}</Text>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.reducer.settings.darkMode).bar }}></View>
            </View>
            <ScrollView style={style.questionsScroll}>
                {props.questionSettings.questionInitials.map((question, index) => {
                    return (<QuestionSlot
                        key={index}
                        onPlay={() => { _questionPlay(question) }}
                        question={question}
                    />)
                })}
            </ScrollView>
            <View style={{ width: "100%" }}>
                <AdMobBanner
                    adSize="smartBanner"
                    adUnitID="ca-app-pub-3940256099942544/6300978111"
                    testDevices={[AdMobBanner.simulatorId]}
                    onAdFailedToLoad={error => console.error(error)}
                />
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        questionSettings: state.questionSettings,
    }
};

export default connect(mapStateToProps)(HomeScreen);
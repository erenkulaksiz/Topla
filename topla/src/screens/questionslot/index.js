import React from 'react';
import { Text, View, ScrollView, SafeAreaView } from "react-native";
import { connect } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
//import Config from 'react-native-config';

import style from "./style";
import I18n from "../../utils/i18n.js";
import Theme from "../../themes";
import Header from "../../modules/header";
import QuestionSlot from "../../modules/questionslot";

const QuestionSlotScreen = props => {

    const _questionPlay = question => {
        if (question.requiresPremium && props.API.DATA.hasPremium) {
            props.navigation.navigate('QuestionSettings', { question: question });
        } else if (question.requiresPremium && props.API.DATA.hasPremium == false) {
            alert("You need to buy premium in order to play this question type!"); // #TODO: make a good alert
        } else {
            props.navigation.navigate('QuestionSettings', { question: question });
        }
    }

    return (
        <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            <Header backShown onBack={() => props.navigation.goBack()} />
            <View style={style.headerContainer}>
                <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("questionPlay_speed_title")}</Text>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
            </View>
            <ScrollView
                style={style.questionsScroll}
            //snapToAlignment="start"
            //snapToInterval={190}
            >
                {props.questionSettings.questionInitials.map((question, index) => {
                    return question.isVersusMode || question.isChildPlay || question.isDragDrop ? null : <QuestionSlot
                        key={question.nameId}
                        onPlay={() => _questionPlay(question)}
                        question={question}
                    />
                })}
            </ScrollView>
        </SafeAreaView>
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

export default connect(mapStateToProps)(QuestionSlotScreen);
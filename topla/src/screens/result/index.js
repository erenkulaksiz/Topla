import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import prettyMs from 'pretty-ms';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import I18n from "../../utils/i18n.js";
import style from "./style";
import Header from "../../modules/header";
import Theme from "../../themes";

const ResultScreen = props => {

    const _preventGoingBack = e => {
        e.preventDefault();

    };

    useEffect(() => {
        //console.log("PERFORMANCE ON QUESTION END: ", (performance.now() - props.reducer.PERFORMANCE.questionEnd_StartPerf))
        props.dispatch({ type: "SET_PERF_QUESTION", payload: { questionEnd_EndPerf: performance.now() } });
        props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: false });
        props.navigation.addListener('beforeRemove', (e) => _preventGoingBack(e));
    }, []);

    const _navigateToHome = async () => {
        await props.navigation.removeListener('beforeRemove');
        props.navigation.navigate('Home');
        console.log("@results back to home");
        props.dispatch({ type: "RESET_QUESTION_RESULTS" });
    }

    return (
        <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            <Header />
            <View style={style.headerContainer}>
                <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("question_results")}</Text>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
            </View>
            <View style={{ ...style.infoBox, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                <Text style={{ ...style.infoTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("questionresults_summary")}</Text>
                <View style={{ ...style.infoBar, backgroundColor: Theme(props.settings.darkMode).textDefault }}></View>
                <View style={style.infoContent}>
                    <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("questionresults_totaltime")}: {prettyMs(props.currentQuestion.stats.finalTime)}</Text>
                    {props.currentQuestion.stats.totalCorrect == 0 || <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("questionresults_truecount")}: {props.currentQuestion.stats.totalCorrect}</Text>}
                    {props.currentQuestion.stats.totalWrong == 0 || <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("questionresults_wrongcount")}: {props.currentQuestion.stats.totalWrong}</Text>}
                    {props.currentQuestion.stats.totalEmpty == 0 || <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("questionresults_emptycount")}: {props.currentQuestion.stats.totalEmpty}</Text>}
                    <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("questionresults_totalquestions")}: {props.questionSettings.questionCount}</Text>
                </View>
            </View>
            <ScrollView style={style.content}>
                {props.currentQuestion.questionResults.map((element, index) => {
                    return (
                        <View style={{
                            margin: 4, padding: 12, elevation: 2,
                            marginBottom: props.currentQuestion.questionResults.length == (index + 1) ? 70 : 8, // Sonuncu ise aşağıya boşluk bırak
                            borderRadius: 8,
                            backgroundColor: Theme(props.settings.darkMode).questionSlotBackground
                        }} key={index}>
                            <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>
                                {(element.questionStep) + 1}. {I18n.t("question")}
                                {" - "}
                                <Text style={{ color: (element.questionEmpty ? Theme(props.settings.darkMode).textDefault : (element.questionAnswerCorrect ? "green" : "red")) }}>
                                    {"" + (element.questionEmpty ? I18n.t("question_answer_empty") : (element.questionAnswerCorrect ? I18n.t("question_answer_correct") : I18n.t("question_answer_wrong")))}
                                </Text>
                            </Text>

                            {
                                element.questionEmpty ? <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>{props.currentQuestion.questions[element.questionStep].question} = {props.currentQuestion.questions[element.questionStep].questionAnswer}</Text>
                                    : <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>{props.currentQuestion.questions[element.questionStep].question} = {element.questionAnswer}</Text>
                            }

                            {
                                element.questionEmpty || (element.questionAnswerCorrect || <Text style={{ color: "green" }}>{I18n.t("question_answer")}: {props.currentQuestion.questions[element.questionStep].questionAnswer}</Text>)
                            }

                            <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("questionresults_time")}: {prettyMs(element.questionTime)}</Text>
                        </View>
                    )
                })}
                <View style={{ marginBottom: 16 }}></View>
            </ScrollView>
            <View style={style.bottomButtonWrapper}>
                <TouchableOpacity style={style.bottomButton} activeOpacity={0.7} onPress={() => _navigateToHome()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={12} color={"#fff"} />
                    <Text style={{ fontSize: 15, color: "#fff", marginLeft: 8 }}>{I18n.t("question_results_back")}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const mapStateToProps = (state) => {
    return {
        currentQuestion: state.currentQuestion,
        questionSettings: state.questionSettings,
        API: state.API,
        settings: state.settings,
    }
};

export default connect(mapStateToProps)(ResultScreen);
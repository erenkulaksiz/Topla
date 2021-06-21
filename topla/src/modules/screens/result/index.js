import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Text, View, Button, ScrollView } from 'react-native';
import prettyMs from 'pretty-ms';

import I18n from "../../../utils/i18n.js";
import style from './style';
import Header from "../../header";

const ResultScreen = props => {

    useEffect(() => {
        //console.log("PERFORMANCE ON QUESTION END: ", (performance.now() - props.reducer.PERFORMANCE.questionEnd_StartPerf))
        props.dispatch({ type: "SET_PERF_QUESTION", payload: { questionEnd_EndPerf: performance.now() } });
    }, []);

    const _navigateToHome = () => {
        props.navigation.navigate('Home');
        console.log("@results back to home");
        props.dispatch({ type: "RESET_QUESTION_RESULTS" });
    }

    return (
        <View style={style.container}>
            <Header />
            <View style={style.headerContainer}>
                <Text style={style.headerText}>{I18n.t("question_results")}</Text>
                <View style={style.headerBar}></View>
            </View>
            <View style={style.infoBox}>
                <Text style={style.infoTitle}>Özet</Text>
                <View style={style.infoBar}></View>
                <View style={style.infoContent}>
                    <Text>Toplam Süre: {prettyMs(props.currentQuestion.stats.finalTime, { colonNotation: true })}</Text>
                    <Text>Doğru Sayısı: {props.currentQuestion.stats.totalCorrect}</Text>
                    <Text>Yanlış Sayısı: {props.currentQuestion.stats.totalWrong}</Text>
                    <Text>Boş Sayısı: {props.currentQuestion.stats.totalEmpty}</Text>
                </View>
            </View>
            <ScrollView style={style.content}>
                {props.currentQuestion.questionResults.map((element, index) => {
                    return (
                        <View
                            style={{ margin: 4, padding: 12, elevation: 2, backgroundColor: "white", marginBottom: 8, borderRadius: 8, }}
                            key={index}>

                            <Text>
                                {(element.questionStep) + 1}. {I18n.t("question")}
                                {" - "}
                                <Text style={{ color: (element.questionEmpty ? "black" : (element.questionAnswerCorrect ? "green" : "red")) }}>
                                    {"" + (element.questionEmpty ? "BOŞ" : (element.questionAnswerCorrect ? I18n.t("question_answer_correct") : I18n.t("question_answer_wrong")))}
                                </Text>

                            </Text>

                            {
                                element.questionEmpty ? <Text>{props.currentQuestion.questions[element.questionStep].question} = {props.currentQuestion.questions[element.questionStep].questionAnswer}</Text>
                                    : <Text>{props.currentQuestion.questions[element.questionStep].question} = {element.questionAnswer}</Text>
                            }

                            {
                                element.questionEmpty || (element.questionAnswerCorrect || <Text style={{ color: "green" }}>{I18n.t("question_answer")}: {props.currentQuestion.questions[element.questionStep].questionAnswer}</Text>)
                            }

                            <Text>Süre: {prettyMs(element.questionTime, { colonNotation: true })}</Text>
                        </View>
                    )
                })}
                <View style={{ marginBottom: 16 }}></View>
            </ScrollView>
            <View style={{ width: "100%", padding: 8 }}>
                <Button title={I18n.t("question_results_back")} onPress={() => _navigateToHome()}></Button>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        currentQuestion: state.currentQuestion
    }
};

export default connect(mapStateToProps)(ResultScreen);
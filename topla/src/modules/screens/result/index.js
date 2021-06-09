import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button, ScrollView } from 'react-native';
import style from './style';
import I18n from "../../../utils/i18n.js";
import Header from "../../header";
import prettyMs from 'pretty-ms';

const ResultScreen = props => {

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
                    <Text>Toplam Süre: {prettyMs(props.reducer.currentQuestion.stats.finalTime, { colonNotation: true })}</Text>
                    <Text>Doğru Sayısı: {props.reducer.currentQuestion.stats.totalCorrect}</Text>
                    <Text>Yanlış Sayısı: {props.reducer.currentQuestion.stats.totalWrong}</Text>
                    <Text>Boş Sayısı: {props.reducer.currentQuestion.stats.totalEmpty}</Text>
                </View>
            </View>
            <ScrollView style={style.content}>
                {props.reducer.currentQuestion.questionResults.map((element, index) => {
                    return (
                        <View
                            style={{ margin: 4, padding: 12, elevation: 2, backgroundColor: "white", marginBottom: 8, borderRadius: 8, }}
                            key={index}
                        >
                            <Text>{(element.questionStep) + 1}. {I18n.t("question")} - <Text style={{ color: element.questionAnswerCorrect ? "green" : "red" }}>{"" + (element.questionAnswerCorrect ? I18n.t("question_answer_correct") : I18n.t("question_answer_wrong"))}</Text></Text>
                            <Text>{props.reducer.currentQuestion.questions[element.questionStep].question} = {element.questionAnswer}</Text>
                            {!element.questionAnswerCorrect && <Text style={{ color: "green" }}>{I18n.t("question_answer")}: {props.reducer.currentQuestion.questions[element.questionStep].questionAnswer}</Text>}
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
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(ResultScreen);
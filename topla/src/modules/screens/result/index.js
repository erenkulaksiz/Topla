import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button, ScrollView } from 'react-native';
import style from './style';

import Header from "../../header";
import question from '../question';

class ResultScreen extends React.Component {

    _navigateToHome = () => {
        this.props.navigation.navigate('Home');
        console.log("@results back to home");

        this.props.dispatch({ type: "RESET_QUESTION_RESULTS" });
    }

    componentDidMount() {
        //this._resetNav();

    }

    render() {
        return (
            <View style={style.container}>
                <Header />
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>Sonuçlar</Text>
                    <View style={style.headerBar}></View>
                </View>
                <ScrollView style={style.content}>
                    {this.props.reducer.currentQuestion.questionResults.map((element, index) => {
                        return (
                            <View
                                style={{ margin: 4, padding: 12, elevation: 2, backgroundColor: "white", marginBottom: 8, borderRadius: 8, }}
                                key={index}
                            >
                                <Text>{(element.questionStep) + 1}. Soru - <Text style={{ color: element.questionAnswerCorrect ? "green" : "red" }}>{"" + (element.questionAnswerCorrect ? "Doğru" : "Yanlış")}</Text></Text>
                                <Text>{this.props.reducer.currentQuestion.questions[element.questionStep].question} = {element.questionAnswer}</Text>
                                {!element.questionAnswerCorrect && <Text style={{ color: "green" }}>Cevap: {this.props.reducer.currentQuestion.questions[element.questionStep].questionAnswer}</Text>}
                            </View>
                        )
                    })}
                    <View style={{ marginBottom: 16 }}></View>
                </ScrollView>
                <View style={{ width: "100%", padding: 8 }}>
                    <Button title={"ana sayfa"} onPress={() => this._navigateToHome()}></Button>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(ResultScreen);
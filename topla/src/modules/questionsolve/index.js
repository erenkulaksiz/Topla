import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import style from './style';
import { connect } from 'react-redux';

const QuestionSolve = props => {

    const _renderButton = (element, index) => {
        return (<TouchableOpacity style={style.button} onPress={() => props.onAnswerPress(element, index)} key={index}>
            <Text style={{ fontSize: 18 }}>{"" + element}</Text>
        </TouchableOpacity>)
    }

    return (
        <View style={style.container}>
            <View style={style.questionTitleWrapper}>
                <Text style={style.questionTitle}>
                    {props.reducer.currentQuestion.questions[props.reducer.currentQuestion.currentStep].question}
                </Text>
            </View>

            <View style={style.buttonsWrapper}>
                {props.reducer.currentQuestion.questions[props.reducer.currentQuestion.currentStep].questionOptions.map((element, index) => {
                    return _renderButton(element, index);
                })}
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSolve);
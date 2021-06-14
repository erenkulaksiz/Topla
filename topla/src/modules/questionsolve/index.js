import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';

import style from './style';

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
                    {props.currentQuestion.questions[props.currentQuestion.currentStep].question}
                </Text>
            </View>
            <View style={style.buttonsWrapper}>
                {props.currentQuestion.questions[props.currentQuestion.currentStep].questionOptions.map((element, index) => {
                    return _renderButton(element, index);
                })}
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        currentQuestion: state.currentQuestion
    }
};

export default connect(mapStateToProps)(QuestionSolve);
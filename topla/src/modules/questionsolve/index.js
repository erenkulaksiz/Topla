import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';

import style from './style';
import Theme from '../../themes';

const QuestionSolve = props => {

    const _renderButton = (element, index) => {
        return (<TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }} activeOpacity={0.85} onPress={() => props.onAnswerPress(element, index)} key={index}>
            <Text style={{ fontSize: 18, color: Theme(props.settings.darkMode).textDefault }}>{"" + element}</Text>
        </TouchableOpacity>)
    }

    return (
        <View style={style.container}>
            <View style={{
                ...style.questionTitleWrapper, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground,
                paddingTop: props.versusMode ? 12 : 32,
                paddingBottom: props.versusMode ? 12 : 32,
            }}>

                <Text style={{ ...style.questionTitle, color: Theme(props.settings.darkMode).textDefault }}>
                    {props.versusMode ? (props.player == 1 ? props.currentQuestion.questions[props.currentQuestion.versusStats.p1.currentStep].question : props.currentQuestion.questions[props.currentQuestion.versusStats.p2.currentStep].question) : props.currentQuestion.questions[props.currentQuestion.currentStep].question}
                </Text>
            </View>
            <View style={style.buttonsWrapper}>
                {props.currentQuestion.questions[(props.versusMode ? (props.player == 1 ? props.currentQuestion.versusStats.p1.currentStep : props.currentQuestion.versusStats.p2.currentStep) : props.currentQuestion.currentStep)].questionOptions.map((element, index) => {
                    return _renderButton(element, index);
                })}
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        currentQuestion: state.currentQuestion,
        settings: state.settings,
    }
};

export default connect(mapStateToProps)(QuestionSolve);
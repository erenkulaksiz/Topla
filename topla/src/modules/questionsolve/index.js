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
            <View style={{ ...style.questionTitleWrapper, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                <Text style={{ ...style.questionTitle, color: Theme(props.settings.darkMode).textDefault }}>
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
        currentQuestion: state.currentQuestion,
        settings: state.settings,
    }
};

export default connect(mapStateToProps)(QuestionSolve);
import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, Button } from "react-native";
import style from './style';
import PropTypes from 'prop-types';

class QuestionSolve extends React.Component {

    render() {

        const {
            currentQuestion,
            onAnswerPress,
        } = this.props

        const _renderButton = (element, index) => {
            return (<TouchableOpacity style={style.button} onPress={() => onAnswerPress(element, index)} key={index}>
                <Text style={{ fontSize: 18 }}>{"" + element}</Text>
            </TouchableOpacity>)
        }

        return (
            <View style={style.container}>
                <View style={style.questionTitleWrapper}>
                    <Text style={style.questionTitle}>
                        {currentQuestion.questions[currentQuestion.currentStep].question}
                    </Text>
                </View>

                <View style={style.buttonsWrapper}>
                    {currentQuestion.questions[currentQuestion.currentStep].questionOptions.map((element, index) => {
                        return _renderButton(element, index);
                    })}
                </View>
            </View>
        );
    }
}

QuestionSolve.propTypes = {
    currentQuestion: PropTypes.object,
    onAnswerPress: PropTypes.func,
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSolve);
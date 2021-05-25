import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, Button } from "react-native";
import style from './style';
import PropTypes from 'prop-types';

class QuestionSolve extends React.Component {

    // Önce kaçıncı soruda olduğunu bul. Sonra o sorudaki seçenekler ile sonucu yükle

    render() {

        const {
            currentQuestion,
            onAnswerPress,
        } = this.props

        //console.log("asddssd ", this.props.reducer);
        /*this.props.reducer.currentQuestion.questions[this.props.currentQuestion.currentStep].question*/

        console.log("step: ", currentQuestion.currentStep)

        return (
            <View style={style.container}>
                <View style={style.questionTitleWrapper}>
                    <Text style={style.questionTitle}>
                        {currentQuestion.questions[currentQuestion.currentStep].question}
                    </Text>
                    <View style={style.buttonsWrapper}>
                        {currentQuestion.questions[currentQuestion.currentStep].questionOptions.map((element, index) => {
                            return <View style={{ padding: 4 }} key={element}>
                                <Button title={"" + element} onPress={() => onAnswerPress(index)} />
                            </View>
                        })}
                    </View>
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
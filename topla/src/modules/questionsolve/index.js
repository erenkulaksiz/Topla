import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';

import style from './style';
import Theme from '../../themes';

const QuestionSolve = props => {

    const _renderQuestion = () => {
        return (
            <Text style={{ ...style.questionTitle, color: Theme(props.settings.darkMode).textDefault }}>
                {props.versusMode ? (props.player == 1 ? props.currentQuestion.questions[props.currentQuestion.versusStats.p1.currentStep].question : props.currentQuestion.questions[props.currentQuestion.versusStats.p2.currentStep].question) : props.currentQuestion.questions[props.currentQuestion.currentStep].question}
            </Text>
        )
    }

    const _renderButton = (element, index) => {
        return (<TouchableOpacity style={{ ...style.button, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }} activeOpacity={0.85} onPress={() => props.onAnswerPress(element, index)} key={index}>
            <Text style={{ fontSize: 18, color: Theme(props.settings.darkMode).textDefault }}>{"" + element}</Text>
        </TouchableOpacity>)
    }

    const _renderDragButton = (elements) => {
        let innerGroup = [];
        let outerGroup = [];
        const _renderOuterGroup = [];

        let location = 0;
        for (let j = 1; j <= Math.floor(elements.length / 2); j++) {
            for (let i = 0; i < 2; i++) {
                innerGroup.push(elements[location]);
                location++;
            }
            outerGroup.push(innerGroup);
            innerGroup = [];
        }

        outerGroup.map((element, index) => {
            _renderOuterGroup.push(<View style={{ flexDirection: "row", width: "100%" }}>
                {
                    element.map((ele, ind) => {
                        return <TouchableOpacity style={{ flex: 1, padding: 24, marginRight: 6, marginBottom: 6, backgroundColor: "#fff", borderRadius: 12 }}>
                            <Text>{ele}</Text>
                        </TouchableOpacity>
                    })
                }
            </View>)
        })

        return _renderOuterGroup
    }

    const _renderBoxes = () => {
        const elements = [];

        props.currentQuestion.questions[props.currentQuestion.currentStep].questionArguments.map((element, index) => {
            elements.push(
                <View style={{ height: 64, width: 64, backgroundColor: "white", borderWidth: 2, borderColor: "gray", padding: 12, borderRadius: 16, justifyContent: "center", alignItems: "center" }} key={index + JSON.stringify(element) + "dragelement"}>
                    <Text>{element}</Text>
                </View>
            )
            if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[index]) {
                if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[index] == "addition") {
                    elements.push(<Text style={{ fontSize: 28, marginLeft: 12, marginRight: 12, }} key={index + element + "add"}>+</Text>);
                } else if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[index] == "subtraction") {
                    elements.push(<Text style={{ fontSize: 28, marginLeft: 12, marginRight: 12, }} key={index + element + "sub"}>-</Text>);
                } else if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[index] == "multiplication") {
                    elements.push(<Text style={{ fontSize: 28, marginLeft: 12, marginRight: 12, }} key={index + element + "mult"}>x</Text>);
                }
            }
        })

        return (<>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {elements}
            </View>
            <View style={{ width: "100%", marginTop: 24, padding: 12, backgroundColor: "#eee", borderRadius: 12 }}>
                <Text style={{ fontSize: 24, marginLeft: 12 }}>= {props.currentQuestion.questions[props.currentQuestion.currentStep].questionAnswer}</Text>
            </View>
        </>)
    }

    return (
        <View style={style.container}>
            <View style={{
                ...style.questionTitleWrapper, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground,
                paddingTop: props.versusMode ? 12 : 32,
                paddingBottom: props.versusMode ? 12 : 32,
                alignItems: props.isDragDrop ? "center" : "flex-start"
            }}>

                {props.isDragDrop ? _renderBoxes() : _renderQuestion()}

            </View>
            <View style={style.buttonsWrapper}>
                {props.isDragDrop ?
                    _renderDragButton(props.currentQuestion.questions[props.currentQuestion.currentStep].questionOptions) : props.currentQuestion.questions[(props.versusMode ? (props.player == 1 ? props.currentQuestion.versusStats.p1.currentStep : props.currentQuestion.versusStats.p2.currentStep) : props.currentQuestion.currentStep)].questionOptions.map((element, index) => {
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
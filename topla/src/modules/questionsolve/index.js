import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { DraxProvider, DraxView } from 'react-native-drax';
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import style from './style';
import Theme from '../../themes';

const QuestionSolve = props => {

    const _renderQuestion = () => {
        return (<Text style={{ ...style.questionTitle, color: Theme(props.settings.darkMode).textDefault }}>
            {props.versusMode ? (props.player == 1 ? props.currentQuestion.questions[props.currentQuestion.versusStats.p1.currentStep].question : props.currentQuestion.questions[props.currentQuestion.versusStats.p2.currentStep].question) : props.currentQuestion.questions[props.currentQuestion.currentStep].question}
        </Text>)
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
            _renderOuterGroup.push(<View style={{ flexDirection: "row", width: "100%" }} key={index}>
                {
                    element.map((ele, ind) => {

                        let exist = false;

                        props.currentQuestion.dragDropInput.map((elex) => {
                            console.log("elex: ", elex, " index: ", element[ind]);
                            if (elex.index == element[ind].index) {
                                exist = true;
                            }
                        })

                        if (!exist) {
                            return <DraxView
                                key={JSON.stringify(ele.opt) + ind}
                                style={style.dragSenderBox}
                                payload={ele}
                                hoverDraggingStyle={{
                                    elevation: 24,
                                    zIndex: 64,
                                    borderWidth: 2,
                                    borderColor: "#7a7a7a",
                                    borderStyle: "dashed",
                                    transform: [{ rotate: '4deg' }],
                                }}>
                                <Text style={{ fontSize: 24 }}>{ele.opt}</Text>
                            </DraxView>
                        } else {
                            return <View style={{ ...style.dragSenderBox, backgroundColor: "transparent", elevation: 0 }} key={ind}>
                                <Text style={{ fontSize: 24, color: "transparent" }}></Text>
                            </View>
                        }
                    })
                }
            </View>)
        })

        return _renderOuterGroup
    }

    const _renderBoxes = () => {
        const elements = [];

        props.currentQuestion.questions[props.currentQuestion.currentStep].questionArguments.map((element, index) => { // Çarpma işlemlerini gösteren kutucuklar
            let recieverStyles = { ...style.dragRecieverBox };
            let draggable = false;

            props.currentQuestion.dragDropInput.map((ele, ind) => {
                if (ele.draggedTo == index) {
                    recieverStyles = { ...recieverStyles, borderColor: "#eee" };
                    draggable = true;
                }
            })

            elements.push(
                <DraxView
                    style={{ ...recieverStyles }}
                    key={index + JSON.stringify(element) + "dragelement"}
                    onReceiveDragDrop={({ dragged: { payload } }) => {
                        //props.dispatch({type: "PUSH_TO_DRAG_DROP_INPUT",})

                        if (payload.option) {
                            return;
                        }

                        const recievedOption = props.currentQuestion.questions[props.currentQuestion.currentStep].questionOptions[payload.index];
                        console.log(`SHOULD: ${payload.index} -> ${recievedOption.opt}`);

                        let exist = false;
                        props.currentQuestion.dragDropInput.map((ele, ind) => {
                            if (ele.draggedTo == index) {
                                exist = true;
                            }
                        })

                        if (!exist) {
                            props.dispatch({
                                type: "PUSH_TO_DRAG_DROP_INPUT",
                                payload: {
                                    opt: recievedOption.opt,
                                    index: recievedOption.index,
                                    draggedTo: index
                                }
                            });
                        }

                        if (props.currentQuestion.dragDropInput.length == 3) {
                            props.onDragAnswerFinish(props.currentQuestion.dragDropInput);
                        } else {
                            props.onDraggedInput();
                        }

                    }}
                    payload={{ index: index, option: true }}
                    draggable={draggable}
                    receivingStyle={{
                        borderWidth: 2,
                        borderColor: "#7a7a7a",
                        borderStyle: "dashed",
                    }}
                    hoverDraggingStyle={{
                        elevation: 24,
                        zIndex: 64,
                        borderWidth: 2,
                        borderColor: "#7a7a7a",
                        borderStyle: "dashed",
                        transform: [{ rotate: '4deg' }],
                    }}>
                    <Text style={{ color: "#000", fontSize: 20 }}>{props.currentQuestion.dragDropInput.map((ele, ind) => {
                        if (ele.draggedTo == index) return <Text>{ele.opt}</Text>
                    })}</Text>
                </DraxView>
            );
            if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[index]) {
                if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[index] == "addition") {
                    elements.push(<Text style={{ fontSize: 28, marginLeft: 12, marginRight: 12, }} key={index + JSON.stringify(element) + "add"}>+</Text>);
                } else if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[index] == "subtraction") {
                    elements.push(<Text style={{ fontSize: 28, marginLeft: 12, marginRight: 12, }} key={index + JSON.stringify(element) + "sub"}>-</Text>);
                } else if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[index] == "multiplication") {
                    elements.push(<Text style={{ fontSize: 28, marginLeft: 12, marginRight: 12, }} key={index + JSON.stringify(element) + "mult"}>x</Text>);
                }
            }
        })

        return (<>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                {elements}
            </View>
            <View style={{ width: "100%", marginTop: 24, marginLeft: 24, marginRight: 24, padding: 14, backgroundColor: "#eee", borderRadius: 12, flexDirection: "row" }}>

                {
                    props.questionSettings.displayResultDragDrop && <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text>Şu anki Sonuç</Text>
                        <Text style={{ fontSize: 24, marginLeft: 12 }}>={props.currentQuestion.dragDropCurrentResult}</Text>
                    </View>
                }

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Cevap</Text>
                    <Text style={{ fontSize: 24, marginLeft: 12 }}>={props.currentQuestion.questions[props.currentQuestion.currentStep].questionAnswer}</Text>
                </View>
            </View>
        </>)
    }

    return (
        <DraxProvider>
            <View style={style.container}>
                <View style={{
                    ...style.questionTitleWrapper, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground,
                    paddingTop: props.versusMode ? 12 : 32,
                    paddingBottom: props.versusMode ? 12 : 32,
                    alignItems: props.isDragDrop ? "center" : "flex-start"
                }}>

                    {props.isDragDrop ? _renderBoxes() : _renderQuestion()}

                </View>
                <DraxView
                    style={{ ...style.buttonsWrapper }}
                    onReceiveDragDrop={({ dragged: { payload } }) => {
                        if (payload.option) {
                            console.log("This is a option with index: ", payload.index);
                            props.currentQuestion.dragDropInput.map((element) => {
                                if (element.draggedTo == payload.index) {
                                    props.dispatch({
                                        type: "REMOVE_FROM_DRAG_DROP_INPUT",
                                        payload: element.draggedTo,
                                    });
                                    props.onDraggedInput();
                                }
                            })
                        }
                        console.log("Drag drop inputs: ", props.currentQuestion.dragDropInput);
                    }}>
                    {
                        props.isDragDrop ?
                            _renderDragButton(props.currentQuestion.questions[props.currentQuestion.currentStep].questionOptions) : props.currentQuestion.questions[(props.versusMode ? (props.player == 1 ? props.currentQuestion.versusStats.p1.currentStep : props.currentQuestion.versusStats.p2.currentStep) : props.currentQuestion.currentStep)].questionOptions.map((element, index) => {
                                return _renderButton(element, index);
                            })
                    }
                </DraxView>
            </View>
        </DraxProvider>
    );
}

QuestionSolve.propTypes = {
    versusMode: PropTypes.bool,
    isDragDrop: PropTypes.bool,
    player: PropTypes.number,
    onDraggedInput: PropTypes.func,
    onDragAnswerFinish: PropTypes.func,
}
QuestionSolve.defaultProps = {
    versusMode: false,
    isDragDrop: false,
    player: 0,
}

const mapStateToProps = (state) => {
    return {
        questionSettings: state.questionSettings,
        currentQuestion: state.currentQuestion,
        settings: state.settings,
    }
};

export default connect(mapStateToProps)(QuestionSolve);
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Text, View, Alert, TouchableOpacity, Button } from 'react-native';
import style from './style';
import Header from "../../header";
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import _ from "lodash";
import I18n from "../../../utils/i18n.js";

// Components
import QuestionSolve from '../../questionsolve';

const QuestionScreen = props => {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        props.navigation.addListener('beforeRemove', (e) => _preventGoingBack(e))

        if (!props.currentQuestion.isStarted) {
            props.dispatch({ type: "SET_QUESTION_SOLVING", payload: true });
        }

        _loadQuestions();
    }, []);

    const _modal = control => {
        props.dispatch({ type: "SET_PAUSE_MODAL", payload: control });
    }

    const _pause = () => {
        _modal(true);
    }

    const _continue = () => {
        _modal(false);
    }

    const _goBack = () => {
        _modal(false);
        props.navigation.goBack();
    }

    const _generateRandomInt = (min, max) => {
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        return random
    }

    const _loadQuestions = () => {
        // TODO: Question settings'deki ayarlara göre currentQuestion.questions'a rasgele seçenekler ile pushlayacak

        console.log("@Load Questions")

        props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: false });

        const questions = [];

        const values = ["addition", "subtraction", "multiplication", "division"];

        const operation = value => {
            if (value == values[0]) return "+"
            if (value == values[1]) return "-"
            if (value == values[2]) return "x"
            if (value == values[3]) return "/"
        }

        for (let a = 1; a <= props.questionSettings.questionCount; a++) {
            let number1 = _generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange);
            let number2 = _generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange);
            let numberTemp = 0;

            const keys = Object.keys(props.questionSettings.operations).filter(k => props.questionSettings.operations[k] === true);
            const questionOperationRandom = keys[_.sample(Object.keys(keys))]
            console.log("KEY: ", questionOperationRandom)

            if (keys.length == 0) {
                alert("OPERATİON SEÇMEN LAZIM");
            }

            if (questionOperationRandom == values[0]) {
                numberTemp = number1 + number2;
            } else if (questionOperationRandom == values[1]) {
                numberTemp = number1 - number2;
                if (numberTemp < 0) {
                    // Swap number1 with number2
                    number1 = number1 ^ number2
                    number2 = number1 ^ number2
                    number1 = number1 ^ number2
                    numberTemp = number1 - number2; // Yeniden hesapla
                    //alert(number1 + operation(questionOperationRandom) + number2 + "=" + numberTemp);
                }
            } else if (questionOperationRandom == values[2]) {
                numberTemp = number1 * number2;
            } else if (questionOperationRandom == values[3]) {
                numberTemp = number1 / number2;
            }

            questions.push({
                question: `${number1} ${operation(questionOperationRandom)} ${number2}`,
                questionArguments: [number1, number2],
                questionAnswer: numberTemp,
                questionOptions: [],
                questionOperation: questionOperationRandom,
            });

        }

        // rasgele seçenek üretimi
        questions.map((question, index) => {
            for (let a = 1; a <= props.questionSettings.optionCount; a++) {
                if (a == 1) {
                    question.questionOptions.push(question.questionAnswer);
                } else {
                    let randomNumber = _generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange);

                    /*
                    if(question.questionOperation == values[2]){
                        // Çarpmaysa rasgele seçenekleri ona göre üret

                        
                    }*/

                    if (question.questionOptions.indexOf(randomNumber) < 0) {
                        question.questionOptions.push(randomNumber);
                    } else {
                        a--;
                    }
                }
            }
        });

        questions.map(question => {
            question.questionOptions.sort(() => Math.random() - 0.5);
        })

        props.dispatch({ type: "SET_ALL_QUESTIONS", payload: questions });
        props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: true });
        console.log("questions ", questions);
    }

    const _renderBars = () => {
        const bars = [];
        for (let a = 0; a < props.questionSettings.questionCount; a++) {
            if (a == props.currentQuestion.currentStep) {
                bars.push(<View style={{ ...style.bars, backgroundColor: "#A1A1A1" }} key={a}></View>);
            } else {
                if (props.currentQuestion.currentStep < a) {
                    bars.push(<View style={style.bars} key={a}></View>);
                } else {
                    bars.push(<View style={{ ...style.bars, backgroundColor: props.currentQuestion.questionResults[a].questionAnswerCorrect ? "#63D816" : "#E80707" }} key={a}></View>);
                }
            }
        }
        return bars
    }

    const _renderTimer = () => {

        let time = 0;

        return (
            <Text>asdasd</Text>
        )
    }

    const _finishQuestionSolving = () => {
        console.log("@finish question solving");
        props.navigation.navigate('ResultScreen')

    }

    const _preventGoingBack = e => {
        e.preventDefault();
        Alert.alert(
            I18n.t("question_solving_back_title"),
            I18n.t("question_solving_back_desc"),
            [
                { text: I18n.t("question_solving_back_cancel"), style: 'cancel', onPress: () => { } },
                {
                    text: I18n.t("question_solving_back_back"),
                    style: 'destructive',
                    onPress: () => {
                        props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
                        props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });
                        props.dispatch({ type: "RESET_QUESTION_RESULTS" });
                        props.navigation.dispatch(e.data.action)
                    },
                },
            ]
        )
    }

    const _gotoNextQuestion = async (element, index) => {

        // TODO: iki ayrı if else içinde iki ayrı dispatch değil bir tane merkezi dispatch'a bağla

        if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOptions[index] == props.currentQuestion.questions[props.currentQuestion.currentStep].questionAnswer) {
            await props.dispatch({
                type: "PUSH_TO_QUESTION_RESULT", payload: {
                    questionStep: props.currentQuestion.currentStep,
                    questionAnswerCorrect: true,
                    questionAnswer: element,
                }
            });
        } else {
            await props.dispatch({
                type: "PUSH_TO_QUESTION_RESULT", payload: {
                    questionStep: props.currentQuestion.currentStep,
                    questionAnswerCorrect: false,
                    questionAnswer: element,
                }
            });
        }

        if ((props.currentQuestion.currentStep + 1) < props.questionSettings.questionCount) {
            props.dispatch({ type: "GOTO_NEXT_QUESTION" });
        } else {
            props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
            props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });

            console.log("SORU ÇÖZÜMÜ BİTTİ: ", props.currentQuestion.questionResults);

            props.navigation.removeListener('beforeRemove')
            props.navigation.popToTop();
            _finishQuestionSolving();
        }

    }

    return (
        <View style={style.container}>
            <Header pauseShown onPause={() => _pause()} />
            <View style={style.headerContainer}>
                <View style={style.headerLeft}>
                    <FontAwesomeIcon icon={faClock} size={16} color={"#000"} />
                    {_renderTimer()}
                    <Text style={style.timerFinishText}>/ 10sn</Text>
                </View>
                <View style={style.headerRight}>
                    <Text style={style.questionCountTitle}>{I18n.t("question")}:</Text>
                    <Text style={style.questionCount}>{(props.currentQuestion.currentStep + 1)}</Text>
                    <Text> /{props.questionSettings.questionCount}</Text>
                </View>
            </View>

            <View style={style.barsWrapper}>
                {/* Bars */}
                {_renderBars()}
            </View>

            <View style={style.content}>
                {props.reducer.currentQuestion.isQuestionsLoaded &&
                    <QuestionSolve
                        currentQuestion={props.currentQuestion}
                        onAnswerPress={(element, index) => _gotoNextQuestion(element, index)}
                    />
                }
            </View>

            {/* #################### MODAL #################### */}
            <Modal
                isVisible={props.reducer.pauseModalShown}
                onSwipeComplete={() => _continue()}
                swipeDirection={['down']}
                style={style.modalWrapper}
                onBackdropPress={() => _continue()}>

                <View style={style.modal}>

                    <Text style={style.modalTitle}>{I18n.t("modal_paused")}</Text>
                    <View style={style.modalSeperator}></View>

                    <TouchableOpacity style={style.button} onPress={() => _continue()}>
                        <Text style={style.buttonText}>{I18n.t("modal_continue")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ ...style.button, backgroundColor: "#bd0f0f", marginTop: 6 }} onPress={() => _goBack()}>
                        <Text style={style.buttonText}>{I18n.t("modal_exit")}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const mapStateToProps = (state) => {
    const { reducer } = state;
    const { questionSettings } = reducer;
    const { currentQuestion } = reducer;
    return { reducer, currentQuestion, questionSettings }
};

export default connect(mapStateToProps)(QuestionScreen);
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import _ from "lodash";
import prettyMs from 'pretty-ms';
import AwesomeAlert from 'react-native-awesome-alerts';

import I18n from "../../../utils/i18n.js";
import style from './style';
import Header from "../../header";
import QuestionSolve from '../../questionsolve';

const QuestionScreen = props => {

    const [timer, setTimer] = useState(0);
    const [thisQuestionTime, setQTime] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);
    const [backAlert, setBackAlert] = useState(false);

    useEffect(() => {
        _INITIALIZE();
    }, []);

    const _INITIALIZE = async () => {
        props.navigation.addListener('beforeRemove', (e) => page._preventGoingBack(e))
        if (!props.currentQuestion.isStarted) {
            props.dispatch({ type: "SET_QUESTION_SOLVING", payload: true });
        }
        _loadQuestions();
        _timer.startTimer();
    }

    const _timer = { // 5 saat
        startTimer: () => {
            console.log("@START TIMER");
            setTimerStarted(true);
        },
        clear: () => setTimer(0),
        pause: () => setTimerStarted(false),
        resume: () => setTimerStarted(true),
        _render: () => {
            return (
                <Text style={{ marginLeft: 8 }}>{prettyMs(timer - thisQuestionTime, { colonNotation: true })}</Text>
            )
        }
    }

    useEffect(() => {
        let timeout = null;
        if (timerStarted) {
            timeout = setTimeout(() => {
                if ((timer - thisQuestionTime) >= props.questionSettings.perQuestionTime) {
                    setTimerStarted(false); // -> Soru süresi aşılırsa
                    page._questionEmpty(props.currentQuestion.currentStep);
                }
                setTimer(timer + 100);
            }, 100);
        }
        return () => {
            if (!timerStarted) {
                clearTimeout(timeout);
            }
        }
    }, [timer, timerStarted]);

    const page = { // page handler 
        _modal: control => {
            props.dispatch({ type: "SET_PAUSE_MODAL", payload: control });
        },
        _pause: () => {
            page._modal(true);
            _timer.pause();
        },
        _continue: () => {
            page._modal(false);
            _timer.resume();
        },
        _goBack: () => {
            page._modal(false);
            props.navigation.goBack();
        },
        _finishQuestionSolving: async () => {

            props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
            props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });
            let results = {
                correct: 0,
                wrong: 0,
                empty: 0,
            }
            props.currentQuestion.questionResults.map((element, index) => {
                if (element.questionAnswerCorrect) results.correct += 1;
                else results.wrong += 1;

                if (element.questionEmpty) results.empty += 1;
            })
            console.log(`TOTAL CORRECT: ${results.correct} | TOTAL WRONG: ${results.wrong} | TOTAL EMPTY: ${results.wrong}`);
            props.dispatch({
                type: "SET_STATS",
                payload: {
                    finalTime: timer,
                    totalCorrect: results.correct,
                    totalWrong: results.wrong,
                    totalEmpty: results.empty,
                }
            });
            console.log("SORU ÇÖZÜMÜ BİTTİ (QUESTIONRESULTS): ", props.currentQuestion.questionResults);
            props.dispatch({ type: "SET_PERF_QUESTION", payload: { questionEnd_StartPerf: performance.now() } })
            props.navigation.removeListener('beforeRemove')

            console.log("@finish question solving");
            _timer.pause();
            _timer.clear();
            setQTime(0);
            props.navigation.navigate('ResultScreen');
        },
        _nextQuestion: () => {
            props.dispatch({ type: "GOTO_NEXT_QUESTION" });
            setQTime(timer);
            console.log("qTime ", timer);
        },
        _questionEmpty: async () => {
            await props.dispatch({
                type: "PUSH_TO_QUESTION_RESULT", payload: {
                    questionStep: props.currentQuestion.currentStep,
                    questionAnswer: 0,
                    questionSolveTime: timer,
                    questionTime: timer - thisQuestionTime,
                    questionEmpty: true,
                }
            });

            if ((props.currentQuestion.currentStep + 1) < props.questionSettings.questionCount) {
                await page._nextQuestion();
                setTimerStarted(true);
            } else {
                page._finishQuestionSolving();
            }

        },
        _renderBars: () => {
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
        },
        _generateRandomInt: (min, max) => {
            const random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random
        },
        _preventGoingBack: e => {
            e.preventDefault();
            _timer.pause();
            setBackAlert(true);
        },
        _gotoNextQuestion: async (element, index) => {
            await props.dispatch({
                type: "PUSH_TO_QUESTION_RESULT", payload: {
                    questionStep: props.currentQuestion.currentStep,
                    questionAnswerCorrect: (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOptions[index] == props.currentQuestion.questions[props.currentQuestion.currentStep].questionAnswer),
                    questionAnswer: element,
                    questionSolveTime: timer,
                    questionTime: timer - thisQuestionTime,
                }
            });
            if ((props.currentQuestion.currentStep + 1) < props.questionSettings.questionCount) {
                page._nextQuestion();
            } else {
                page._finishQuestionSolving();
            }
        },
    }

    const _loadQuestions = () => {
        console.log("@Load Questions")
        props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: false });
        const performance_begin = performance.now();
        const questions = [];

        const values = [
            "addition",
            "subtraction",
            "multiplication",
            "division"
        ];

        const operation = value => {
            if (value == values[0]) return "+"
            if (value == values[1]) return "-"
            if (value == values[2]) return "x"
            if (value == values[3]) return "/"
        }

        for (let a = 1; a <= props.questionSettings.questionCount; a++) {
            let number1 = page._generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange);
            let number2 = page._generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange);
            let numberTemp = 0;
            console.log("________________________");
            const keys = Object.keys(props.questionSettings.operations).filter(k => props.questionSettings.operations[k] === true);
            const questionOperationRandom = keys[_.sample(Object.keys(keys))]
            console.log("KEY: ", questionOperationRandom)
            if (questionOperationRandom == values[0]) {
                numberTemp = number1 + number2;
                console.log("toplama: " + number1 + " x " + number2 + " = " + numberTemp);
            } else if (questionOperationRandom == values[1]) {
                numberTemp = number1 - number2;
                if (numberTemp < 0) {
                    number1 = number1 ^ number2
                    number2 = number1 ^ number2
                    number1 = number1 ^ number2
                    numberTemp = number1 - number2;
                }
                console.log("cikarma: " + number1 + " x " + number2 + " = " + numberTemp);
            } else if (questionOperationRandom == values[2]) {
                numberTemp = number1 * number2;
                console.log("carpma: " + number1 + " x " + number2 + " = " + numberTemp);
            } else if (questionOperationRandom == values[3]) {
                const isInt = value => {
                    return (parseFloat(value) == parseInt(value)) && !isNaN(value);
                }
                const isPrime = value => {
                    let result = 0;
                    for (let i = 1; i < value; i++) { if (value % i == 0) result++; }
                    if (result > 1) return false
                    return true
                }
                number1 = page._generateRandomInt((props.questionSettings.minRange), props.questionSettings.maxRange);
                const bolenler = [];
                while (isPrime(number1)) { number1 = page._generateRandomInt((props.questionSettings.minRange), props.questionSettings.maxRange); }
                while (!isInt(number1 / number2)) { number2 = page._generateRandomInt((props.questionSettings.minRange), props.questionSettings.maxRange); }
                for (let i = 1; i < number1; i++) {
                    let sonuc = number1 / i;
                    if (isInt(sonuc)) {
                        bolenler.push(sonuc);
                    }
                }
                console.log("bölenler ", bolenler);
                let randomKey = _.sample(bolenler);
                while (randomKey == number1) { randomKey = _.sample(bolenler) }
                number2 = randomKey;
                numberTemp = number1 / number2;
                console.log("İŞLEM: " + number1 + " / " + number2 + " = " + numberTemp);
            }

            questions.push({
                question: `${number1} ${operation(questionOperationRandom)} ${number2}`,
                questionArguments: [number1, number2],
                questionAnswer: numberTemp,
                questionOptions: [],
                questionOperation: questionOperationRandom,
            });
        }

        questions.map(question => {
            for (let a = 1; a <= props.questionSettings.optionCount; a++) {
                if (a == 1) {
                    question.questionOptions.push(question.questionAnswer);
                } else {
                    // Basamak sayısını al.
                    const basamak = Math.max(Math.floor(Math.log10(Math.abs(question.questionAnswer))), 0) + 1
                    const range = (Math.pow(10, (basamak - 1)));
                    let randomNumber = page._generateRandomInt((question.questionAnswer - range), (question.questionAnswer + range));
                    if (question.questionOptions.indexOf(randomNumber) < 0) question.questionOptions.push(randomNumber);
                    else a--;
                }
            }
        });
        questions.map(question => {
            question.questionOptions.sort(() => Math.random() - 0.5);
        })
        props.dispatch({ type: "SET_ALL_QUESTIONS", payload: questions });
        props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: true });
        const performance_after = performance.now();
        console.log("generation performance: " + (performance_after - performance_begin) + "ms")
        console.log("questions ", questions);
    }

    const onBackCancel = () => {
        setBackAlert(false);
        _timer.resume();
    }

    const onBackSubmit = () => {
        setBackAlert(false);
        props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
        props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });
        props.dispatch({ type: "RESET_QUESTION_RESULTS" });
        _timer.pause();
        props.navigation.removeListener('beforeRemove');
        props.navigation.popToTop();
    }

    return (
        <View style={style.container}>
            <Header pauseShown onPause={() => page._pause()} />
            <View style={style.headerContainer}>
                <View style={style.headerLeft}>
                    <FontAwesomeIcon icon={faClock} size={16} color={"#000"} />
                    {_timer._render()}
                    <Text style={style.timerFinishText}>/ {prettyMs(props.questionSettings.perQuestionTime)}</Text>
                </View>
                <View style={style.headerRight}>
                    <Text style={style.questionCountTitle}>{I18n.t("question")}:</Text>
                    <Text style={style.questionCount}>{(props.currentQuestion.currentStep + 1)}</Text>
                    <Text> /{props.questionSettings.questionCount}</Text>
                </View>
            </View>
            <View style={style.barsWrapper}>
                {page._renderBars()}
            </View>
            <View style={style.content}>
                {
                    props.currentQuestion.isQuestionsLoaded &&
                    <QuestionSolve
                        currentQuestion={props.currentQuestion}
                        onAnswerPress={(element, index) => page._gotoNextQuestion(element, index)}
                    />
                }
            </View>
            <AwesomeAlert
                show={backAlert}
                showProgress={false}
                title={I18n.t("question_solving_back_title")}
                message={I18n.t("question_solving_back_desc")}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText={I18n.t("question_solving_back_cancel")}
                confirmText={I18n.t("question_solving_back_back")}
                confirmButtonColor="#DD6B55"
                contentContainerStyle={{ width: "80%" }}
                actionContainerStyle={{ height: 40, marginTop: 32 }}
                cancelButtonStyle={{ height: "100%", justifyContent: "center" }}
                confirmButtonStyle={{ height: "100%", justifyContent: "center" }}
                onCancelPressed={() => onBackCancel()}
                onConfirmPressed={() => onBackSubmit()}
            />
            <Modal
                isVisible={props.reducer.pauseModalShown}
                onSwipeComplete={() => page._continue()}
                swipeDirection={['down']}
                style={style.modalWrapper}
                onBackdropPress={() => page._continue()}>
                <View style={style.modal}>
                    <Text style={style.modalTitle}>{I18n.t("modal_paused")}</Text>
                    <View style={style.modalSeperator}></View>
                    <TouchableOpacity style={style.button} activeOpacity={0.7} onPress={() => page._continue()}>
                        <Text style={style.buttonText}>{I18n.t("modal_continue")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.button, backgroundColor: "#bd0f0f", marginTop: 6 }} activeOpacity={0.7} onPress={() => page._goBack()}>
                        <Text style={style.buttonText}>{I18n.t("modal_exit")}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        currentQuestion: state.currentQuestion,
        questionSettings: state.questionSettings
    }
};

export default connect(mapStateToProps)(QuestionScreen);
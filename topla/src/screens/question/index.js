import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock, faTimes, faCheck, faHome, faUndoAlt } from '@fortawesome/free-solid-svg-icons'
import _ from "lodash";
import prettyMs from 'pretty-ms';
import AwesomeAlert from 'react-native-awesome-alerts';
import Sound from 'react-native-sound';
import { Parser } from 'expr-eval';

import Theme from "../../themes";
import I18n from "../../utils/i18n.js";
import style from "./style";
import Header from "../../modules/header";
import QuestionSolve from "../../modules/questionsolve";
import ProgressBar from "../../modules/progressbar";
import { map } from "../../utils";

const sounds = {
    correct: require('../../sounds/correct_2.mp3'),
    wrong: require('../../sounds/wrong.mp3'),
}

const QuestionScreen = props => {

    const [timer, setTimer] = useState(0);
    const [thisQuestionTime, setQTime] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(0);
    const [thisPlayerQ1Time, setSplitPlayerQ1Time] = useState(0);
    const [thisPlayerQ2Time, setSplitPlayerQ2Time] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);

    useEffect(() => {
        console.log("question params: ", props.route.params);
        page._loadQuestions();
        if (!props.route.params.question.isVersusMode) {
            if (props.route.params.question.isChildPlay) {
                props.dispatch({ type: "SET_QUESTION_SOLVING", payload: true });
            } else {
                props.dispatch({ type: "SET_QUESTION_SOLVING", payload: true });
                setQTime(Date.now());
                setQuestionStartTime(Date.now());
                _timer.startTimer();
            }
        }
        props.navigation.addListener('beforeRemove', (e) => page._preventGoingBack(e));
    }, []);

    const _timer = { // 5 saat
        startTimer() {
            console.log("@START TIMER");
            setTimerStarted(true);
        },
        clear: () => setTimer(0),
        pause: () => setTimerStarted(false),
        resume: () => setTimerStarted(true),
        _render({ player = 0 } = {}) {
            if (player == 1) return (<Text style={{ marginLeft: 8, color: Theme(props.settings.darkMode).textDefault }}>{prettyMs(timer - thisPlayerQ1Time)}</Text>)
            else if (player == 2) return (<Text style={{ marginLeft: 8, color: Theme(props.settings.darkMode).textDefault }}>{prettyMs(timer - thisPlayerQ2Time)}</Text>)

            return (
                <Text style={{ marginLeft: 8, color: Theme(props.settings.darkMode).textDefault }}>{prettyMs(timer - thisQuestionTime)}</Text>
            )
        }
    }

    useEffect(() => {
        let timeout = null;
        if (timerStarted) {
            timeout = setTimeout(() => {
                if (props.route.params.question.isVersusMode) {
                    // for player 1
                    if (((timer - thisPlayerQ1Time) >= props.questionSettings.perQuestionTime) && !props.currentQuestion.versusStats.p1.finished) {
                        //_timer.pause(); // -> Soru süresi aşılırsa
                        page._questionEmpty({ currentStep: props.currentQuestion.versusStats.p1.currentStep, player: 1 });
                    }

                    if (((timer - thisPlayerQ2Time) >= props.questionSettings.perQuestionTime) && !props.currentQuestion.versusStats.p2.finished) {
                        //_timer.pause(); // -> Soru süresi aşılırsa
                        page._questionEmpty({ currentStep: props.currentQuestion.versusStats.p2.currentStep, player: 2 });
                    }
                } else {
                    if ((timer - thisQuestionTime) >= props.questionSettings.perQuestionTime) {
                        //_timer.pause(); // -> Soru süresi aşılırsa
                        page._questionEmpty({ currentStep: props.currentQuestion.currentStep });
                    }
                }

                setTimer(Date.now());
            }, 60);
        }
        return () => {
            if (!timerStarted) {
                clearTimeout(timeout);
            }
        }
    }, [timer, timerStarted]);

    const page = { // page handler 
        _modal(control) {
            props.dispatch({ type: "SET_PAUSE_MODAL", payload: control });
        },
        _pause() {
            page._modal(true);
            _timer.pause();
        },
        _continue() {
            page._modal(false);
            _timer.resume();
        },
        _goBack() {
            page._modal(false);
            props.navigation.goBack();
        },
        _returnToHome() {
            onBackSubmit();
        },
        _finishQuestionSolving({ player = 0 } = {}) {
            //props.dispatch({ type: 'LOAD_ADS' }); // Load ads first

            if (props.route.params.question.isVersusMode) {

                if (player == 1) {
                    props.dispatch({ type: "SET_PLAYER1_FINISHED_SOLVING", payload: true });
                } else if (player == 2) {
                    props.dispatch({ type: "SET_PLAYER2_FINISHED_SOLVING", payload: true });
                }

                console.log("p1 results: ", props.currentQuestion.versusStats.p1.questionResults);
                console.log("p2 results: ", props.currentQuestion.versusStats.p2.questionResults);

                console.log("P1 FINISHED: ", props.currentQuestion.versusStats.p1.finished, " P2 FINISHED: ", props.currentQuestion.versusStats.p2.finished)

                if ((props.currentQuestion.versusStats.p1.questionResults.length == props.questionSettings.questionCount) && (props.currentQuestion.versusStats.p2.questionResults.length == props.questionSettings.questionCount)) {
                    _timer.pause();
                    _timer.clear();
                    setSplitPlayerQ1Time(0);
                    setSplitPlayerQ2Time(0);
                    props.navigation.removeListener('beforeRemove'); // Remove listener
                    props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
                    let results = {
                        winner: 0,
                        p1: {
                            totalCorrect: 0,
                            totalWrong: 0,
                            totalEmpty: 0,
                            finalTime: props.currentQuestion.versusStats.p1.questionResults[props.currentQuestion.versusStats.p1.questionResults.length - 1].questionSolveTime,
                        },
                        p2: {
                            totalCorrect: 0,
                            totalWrong: 0,
                            totalEmpty: 0,
                            finalTime: props.currentQuestion.versusStats.p2.questionResults[props.currentQuestion.versusStats.p2.questionResults.length - 1].questionSolveTime,
                        }
                    }
                    props.currentQuestion.versusStats.p1.questionResults.map((element) => {
                        if (element.questionAnswerCorrect) results.p1.totalCorrect += 1;
                        else if (element.questionEmpty) results.p1.totalEmpty += 1;
                        else results.p1.totalWrong += 1;
                    });
                    props.currentQuestion.versusStats.p2.questionResults.map((element) => {
                        if (element.questionAnswerCorrect) results.p2.totalCorrect += 1;
                        else if (element.questionEmpty) results.p2.totalEmpty += 1;
                        else results.p2.totalWrong += 1;
                    });
                    console.log("Results: ", results);
                    if (results.p1.totalCorrect > results.p2.totalCorrect) {
                        results.winner = 1;
                    } else if (results.p2.totalCorrect > results.p1.totalCorrect) {
                        results.winner = 2;
                    } else if (results.p2.totalCorrect == results.p1.totalCorrect) {
                        if (results.p1.finalTime < results.p2.finalTime) {
                            results.winner = 1;
                        } else if (results.p2.finalTime < results.p1.finalTime) {
                            results.winner = 2;
                        } else if (results.p1.finalTime == results.p2.finalTime) {
                            if (results.p1.totalEmpty < results.p2.totalEmpty) {
                                results.winner = 1;
                            } else if (results.p2.totalEmpty < results.p1.totalEmpty) {
                                results.winner = 2;
                            } else if (results.p1.totalEmpty == results.p2.totalEmpty) {
                                results.winner = page._generateRandomInt(1, 2);
                            }
                        }
                    }
                    props.dispatch({
                        type: "SET_VERSUS_PLAYER_STATS",
                        payload: {
                            results: results,
                        }
                    });

                    props.dispatch({ type: "SET_VERSUS_GAME_FINISHED", payload: true });
                    props.dispatch({ type: "SET_PLAYER1_READY", payload: false });
                    props.dispatch({ type: "SET_PLAYER2_READY", payload: false });
                }

            } else {
                props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
                props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });
                let results = {
                    correct: 0,
                    wrong: 0,
                    empty: 0,
                };
                props.currentQuestion.questionResults.map((element) => {
                    if (element.questionAnswerCorrect) results.correct += 1;
                    else if (element.questionEmpty) results.empty += 1;
                    else results.wrong += 1;
                });
                console.log(`TOTAL CORRECT: ${results.correct} | TOTAL WRONG: ${results.wrong} | TOTAL EMPTY: ${results.wrong}`);
                props.dispatch({
                    type: "SET_STATS",
                    payload: {
                        finalTime: timer - questionStartTime,
                        totalCorrect: results.correct,
                        totalWrong: results.wrong,
                        totalEmpty: results.empty,
                    }
                });
                console.log("Finaltime: ", timer - questionStartTime);
                props.dispatch({ type: "SET_PERF_QUESTION", payload: { questionEnd_StartPerf: performance.now() } })
                props.navigation.removeListener('beforeRemove')
                _timer.pause();
                _timer.clear();
                setQTime(0);
                props.navigation.navigate('ResultScreen');
            }
        },
        _nextQuestion: ({ player = 0 } = {}) => {
            console.log("next question, player: ", player);
            if (player != 0) {
                if (player == 1) {
                    props.dispatch({ type: "GOTO_NEXT_QUESTION_PLAYER1" });
                    setSplitPlayerQ1Time(timer);
                    console.log("qTime PLAYER1: ", timer);
                } else if (player == 2) {
                    props.dispatch({ type: "GOTO_NEXT_QUESTION_PLAYER2" });
                    setSplitPlayerQ2Time(timer);
                    console.log("qTime PLAYER2: ", timer);
                }
            } else if (player == 0) {
                props.dispatch({ type: "GOTO_NEXT_QUESTION" });
                setQTime(timer);
                console.log("qTime ", timer);
            }
        },
        _questionEmpty({ currentStep, player = 0 } = {}) {

            if (player != 0) {
                if (player == 1) {
                    props.dispatch({
                        type: "PUSH_TO_PLAYER1_STAT",
                        payload: {
                            questionStep: currentStep,
                            questionAnswerCorrect: false,
                            questionAnswer: 0,
                            questionSolveTime: timer - questionStartTime,
                            questionTime: timer - thisPlayerQ1Time,
                            questionEmpty: true,
                        }
                    });

                    if ((props.currentQuestion.versusStats.p1.currentStep + 1) < props.questionSettings.questionCount) {
                        page._nextQuestion({ player: player });
                        setTimerStarted(true);
                    } else {
                        page._finishQuestionSolving({ player: player });
                    }

                } else if (player == 2) {
                    props.dispatch({
                        type: "PUSH_TO_PLAYER2_STAT",
                        payload: {
                            questionStep: currentStep,
                            questionAnswerCorrect: false,
                            questionAnswer: 0,
                            questionSolveTime: timer - questionStartTime,
                            questionTime: timer - thisPlayerQ2Time,
                            questionEmpty: true,
                        }
                    });

                    if ((props.currentQuestion.versusStats.p2.currentStep + 1) < props.questionSettings.questionCount) {
                        page._nextQuestion({ player: player });
                        setTimerStarted(true);
                    } else {
                        page._finishQuestionSolving({ player: player });
                    }
                }

            } else if (player == 0) {
                props.dispatch({
                    type: "PUSH_TO_QUESTION_RESULT",
                    payload: {
                        questionStep: currentStep,
                        questionAnswerCorrect: false,
                        questionAnswer: 0,
                        questionSolveTime: timer - questionStartTime,
                        questionTime: timer - thisQuestionTime,
                        questionEmpty: true,
                    }
                });

                if ((props.currentQuestion.currentStep + 1) < props.questionSettings.questionCount) {
                    page._nextQuestion();

                    // For dragdrop mode
                    props.dispatch({ type: "SET_DRAG_DROP_NEXT_BUTTON", payload: false });
                    props.dispatch({ type: "RESET_DRAG_DROP_INPUT" });
                    props.dispatch({ type: "SET_DRAG_DROP_CURRENT_RESULT", payload: 0 });

                    setQTime(Date.now());

                    setTimerStarted(true);
                } else {
                    page._finishQuestionSolving();
                }
            }

        },
        _generateRandomInt(min, max) {
            const random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random
        },
        _preventGoingBack(e) {
            e.preventDefault();
            _timer.pause();
            props.dispatch({ type: "SET_MODAL", payload: { backQuestion: true } });
        },
        _dragDropNextQuestion() {

            props.dispatch({ type: "SET_DRAG_DROP_NEXT_BUTTON", payload: false });

            const trueAnswer = Parser.evaluate(props.currentQuestion.questions[props.currentQuestion.currentStep].question);
            const userAnswer = page._dragCalcResult();

            props.dispatch({
                type: "PUSH_TO_QUESTION_RESULT",
                payload: {
                    question: props.currentQuestion.questions[props.currentQuestion.currentStep],
                    questionStep: props.currentQuestion.currentStep,
                    questionAnswerCorrect: userAnswer == trueAnswer,
                    questionAnswer: userAnswer,
                    questionSolveTime: timer - questionStartTime,
                    questionTime: timer - thisQuestionTime,
                    questionGivenArguments: props.currentQuestion.dragDropInput,
                }
            });

            props.dispatch({ type: "RESET_DRAG_DROP_INPUT" });

            props.dispatch({
                type: "SET_DRAG_DROP_CURRENT_RESULT",
                payload: 0
            });

            if ((props.currentQuestion.currentStep + 1) < props.questionSettings.questionCount) {
                page._nextQuestion();
            } else {
                page._finishQuestionSolving();
            }
        },
        _onDragAnswerFinish({ element }) {

            console.log("OnDragAnswerFinish element: ", element);

            props.dispatch({
                type: "SET_DRAG_DROP_CURRENT_RESULT",
                payload: Number(page._dragCalcResult())
            });

            props.dispatch({ type: "SET_DRAG_DROP_NEXT_BUTTON", payload: true });
        },
        _dragCalcResult() {
            const expBuilder = [];
            const expElements = ["x", "y", "z", "e", "a", "f", "k"];

            const values = [
                "addition",
                "subtraction",
                "multiplication",
                "division"
            ];

            for (let i = 0; i < props.questionSettings.digitLength; i++) {
                expBuilder.push(expElements[i]);
                if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[i]) {
                    if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[i] == values[0]) {
                        expBuilder.push("+");
                    } else if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[i] == values[1]) {
                        expBuilder.push("-");
                    } else if (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOperation[i] == values[2]) {
                        expBuilder.push("*");
                    }
                }
            }

            const expBuilderStr = expBuilder.join("");

            const expBuilderKeys = {};

            for (let i = 0; i < props.questionSettings.digitLength; i++) {
                expBuilder.map((element) => {
                    if (element == expElements[i]) {
                        props.currentQuestion.dragDropInput.map((element) => {
                            if (element.draggedTo == i) {
                                expBuilderKeys[expElements[i]] = element.opt;
                            }
                        })
                        if (!expBuilderKeys[expElements[i]]) {
                            expBuilderKeys[expElements[i]] = 0;
                        }
                    }
                });
            }

            const result = Parser.evaluate(expBuilderStr, expBuilderKeys);
            console.log("Expbuilder Keys: ", expBuilderKeys);
            console.log("Expbuilder: ", expBuilderStr);
            console.log("ExpbuilderResult: ", result);

            return result
        },
        _onDragInput() {

            // Calculate current result.

            console.log("Current question: ", props.currentQuestion.questions[props.currentQuestion.currentStep].question);
            console.log("Current drag ONDRAGINPUT inputs: ", props.currentQuestion.dragDropInput);
            props.dispatch({ type: "SET_DRAG_DROP_NEXT_BUTTON", payload: false });

            if (props.currentQuestion.dragDropInput.length == 0) {
                props.dispatch({
                    type: "SET_DRAG_DROP_CURRENT_RESULT",
                    payload: 0
                });
            } else if (props.currentQuestion.dragDropInput.length == 1) {
                props.dispatch({
                    type: "SET_DRAG_DROP_CURRENT_RESULT",
                    payload: Number(props.currentQuestion.dragDropInput[0].opt)
                });
            } else {

                //const sortedDragDropInput = _.sortBy(props.currentQuestion.dragDropInput, 'draggedTo');
                props.dispatch({
                    type: "SET_DRAG_DROP_CURRENT_RESULT",
                    payload: Number(page._dragCalcResult())
                });
            }
        },
        _gotoNextQuestion({ element, index, player = 0 } = {}) {

            let questionAnswerCorrect = (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOptions[index] == props.currentQuestion.questions[props.currentQuestion.currentStep].questionAnswer);

            if (player == 0) {
                props.dispatch({
                    type: "PUSH_TO_QUESTION_RESULT",
                    payload: {
                        question: props.currentQuestion.questions[props.currentQuestion.currentStep],
                        questionStep: props.currentQuestion.currentStep,
                        questionAnswerCorrect: questionAnswerCorrect,
                        questionAnswer: element,
                        questionSolveTime: timer - questionStartTime,
                        questionTime: timer - thisQuestionTime
                    }
                });

                if ((props.currentQuestion.currentStep + 1) < props.questionSettings.questionCount) {
                    page._nextQuestion();
                } else {
                    page._finishQuestionSolving();
                }
            } else if (player == 1) {

                questionAnswerCorrect = (props.currentQuestion.questions[props.currentQuestion.versusStats.p1.currentStep].questionOptions[index] == props.currentQuestion.questions[props.currentQuestion.versusStats.p1.currentStep].questionAnswer);
                props.dispatch({
                    type: "PUSH_TO_PLAYER1_STAT",
                    payload: {
                        question: props.currentQuestion.questions[props.currentQuestion.versusStats.p1.currentStep],
                        questionStep: props.currentQuestion.versusStats.p1.currentStep,
                        questionAnswerCorrect: questionAnswerCorrect,
                        questionAnswer: element,
                        questionSolveTime: timer - questionStartTime,
                        questionTime: timer - thisPlayerQ1Time,
                    }
                });

                if ((props.currentQuestion.versusStats.p1.currentStep + 1) < props.questionSettings.questionCount) {
                    page._nextQuestion({ player: player });
                    console.log("NEXT QUESTION FOR PLAYER 1, STEP: ", props.currentQuestion.versusStats.p1.currentStep + 1);
                } else {
                    page._finishQuestionSolving({ player: player });
                }
            } else if (player == 2) {

                console.log("Question element: ", props.currentQuestion.questions[props.currentQuestion.versusStats.p2.currentStep]);

                questionAnswerCorrect = (props.currentQuestion.questions[props.currentQuestion.versusStats.p2.currentStep].questionOptions[index] == props.currentQuestion.questions[props.currentQuestion.versusStats.p2.currentStep].questionAnswer);
                props.dispatch({
                    type: "PUSH_TO_PLAYER2_STAT",
                    payload: {
                        question: props.currentQuestion.questions[props.currentQuestion.versusStats.p2.currentStep],
                        questionStep: props.currentQuestion.versusStats.p2.currentStep,
                        questionAnswerCorrect: questionAnswerCorrect,
                        questionAnswer: element,
                        questionSolveTime: timer - questionStartTime,
                        questionTime: timer - thisPlayerQ2Time,
                    }
                });

                if ((props.currentQuestion.versusStats.p2.currentStep + 1) < props.questionSettings.questionCount) {
                    page._nextQuestion({ player: player });
                    console.log("NEXT QUESTION FOR PLAYER 2, STEP: ", props.currentQuestion.versusStats.p2.currentStep + 1);
                } else {
                    page._finishQuestionSolving({ player: player });
                }
            }

            const soundCallback = (error, sound) => {
                if (error) return; /*Alert.alert('error', error.message);*/
                sound.setVolume(1);
                sound.play(() => {
                    // Release when it's done so we're not using up resources
                    sound.release();
                });
            };

            if (questionAnswerCorrect) {
                const sound = new Sound(sounds.correct, error => soundCallback(error, sound));
            } else {
                const sound = new Sound(sounds.wrong, error => soundCallback(error, sound));
            }
        },
        _loadQuestions() {
            console.log("@LOADING QUESTIONS");
            props.route.params.question.isDragDrop && console.log("@QUESTION LOAD TYPE IS DRAG DROP");
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

            if (!props.route.params.question.isDragDrop) {
                for (let a = 1; a <= props.questionSettings.questionCount; a++) {
                    let n = { // Numbers
                        st: page._generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange),
                        nd: page._generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange),
                        temp: 0,
                    }
                    const keys = Object.keys(props.questionSettings.operations).filter(k => props.questionSettings.operations[k] === true);
                    const questionOperationRandom = keys[_.sample(Object.keys(keys))]
                    if (questionOperationRandom == values[0]) {
                        n.temp = n.st + n.nd;
                    } else if (questionOperationRandom == values[1]) {
                        n.temp = n.st - n.nd;
                        if (n.temp < 0) {
                            n.st = n.st ^ n.nd
                            n.nd = n.st ^ n.nd
                            n.st = n.st ^ n.nd
                            n.temp = n.st - n.nd;
                        }
                    } else if (questionOperationRandom == values[2]) {
                        n.temp = n.st * n.nd;
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
                        n.st = page._generateRandomInt((props.questionSettings.minRange), props.questionSettings.maxRange);
                        const divider = [];
                        while (isPrime(n.st)) { n.st = page._generateRandomInt((props.questionSettings.minRange), props.questionSettings.maxRange); }
                        while (!isInt(n.st / n.nd)) { n.nd = page._generateRandomInt((props.questionSettings.minRange), props.questionSettings.maxRange); }
                        for (let i = 1; i < n.st; i++) {
                            let result = n.st / i;
                            if (isInt(result)) {
                                divider.push(result);
                            }
                        }
                        let randomKey = _.sample(divider);
                        while (randomKey == n.st) { randomKey = _.sample(divider) }
                        n.nd = randomKey;
                        n.temp = n.st / n.nd;
                    }

                    questions.push({
                        question: `${n.st} ${operation(questionOperationRandom)} ${n.nd}`,
                        questionArguments: [n.st, n.nd],
                        questionAnswer: n.temp,
                        questionOptions: [],
                        questionOperation: questionOperationRandom,
                    });
                }

                questions.map(question => {
                    for (let a = 1; a <= props.questionSettings.optionCount; a++) {
                        if (a == 1) {
                            question.questionOptions.push(question.questionAnswer);
                        } else {
                            const digits = Math.max(Math.floor(Math.log10(Math.abs(question.questionAnswer))), 1);
                            const range = Math.pow(10, digits);

                            let randomNumber = Math.abs(page._generateRandomInt(question.questionAnswer - range, question.questionAnswer + range));
                            if (question.questionOptions.indexOf(randomNumber) < 0) {
                                question.questionOptions.push(randomNumber);
                            } else {
                                a--;
                            }
                        }
                    }
                });

                questions.map(question => question.questionOptions.sort(() => Math.random() - 0.5));

                props.dispatch({ type: "SET_ALL_QUESTIONS", payload: questions });
                props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: true });
                const performance_after = performance.now();
                console.log("set all questions: ", questions);
                console.log("generation performance: " + (performance_after - performance_begin) + "ms");
            } else {
                let questions = [];
                props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: false });
                for (let a = 1; a <= props.questionSettings.questionCount; a++) {
                    let pickedNumbers = [];
                    let allowedOperations = [
                        "addition",
                        "subtraction",
                        "multiplication",
                    ];
                    allowedOperations.sort(() => Math.random() - 0.5);
                    let answerCorrect = 0;
                    let pickedOperations = [];
                    for (let i = 0; i < props.questionSettings.digitLength; i++) {
                        pickedNumbers.push(page._generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange));
                    }
                    for (let i = 0; i < props.questionSettings.digitLength - 1; i++) {
                        pickedOperations.push(allowedOperations[Math.floor(Math.random() * allowedOperations.length)])
                    }
                    let expBuilder = [];
                    pickedNumbers.map((element, index) => {
                        expBuilder.push(element);
                        if (pickedOperations[index]) {
                            if (pickedOperations[index] == "addition") {
                                expBuilder.push("+");
                            } else if (pickedOperations[index] == "subtraction") {
                                expBuilder.push("-");
                            } else if (pickedOperations[index] == "multiplication") {
                                expBuilder.push("*");
                            }
                        }
                    })
                    answerCorrect = Parser.evaluate(expBuilder.join(""));
                    if (answerCorrect < 0) {
                        a--;
                    } else {
                        console.log("Exp builder: " + expBuilder.join("") + " = ", answerCorrect);
                        console.log("Picked operations: " + pickedOperations + " Picked numbers: " + pickedNumbers);
                        questions.push({
                            question: `${expBuilder.join("")}`,
                            questionArguments: [...pickedNumbers],
                            questionAnswer: answerCorrect,
                            questionOptions: [],
                            questionOperation: [...pickedOperations],
                        })
                    }
                }

                questions.map((element) => {
                    element.questionArguments.map((el) => {
                        element.questionOptions.push(el);
                    });

                    for (let i = 0; i < props.questionSettings.digitLength; i++) {
                        const option = page._generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange);

                        if (option == element.questionOptions) a--;
                        else element.questionOptions.push(option);
                    }
                });
                console.log("Options: ", questions[0].questionOptions);

                questions.map(question => question.questionOptions.sort(() => Math.random() - 0.5));
                // Randomize questionOptions. #TODO Test!

                // All options generated now give them index
                questions.map((element) => {
                    const oldOptions = element.questionOptions;
                    const newOptions = [];
                    oldOptions.map((el, index) => {
                        newOptions.push({ opt: el, index: index });
                    })
                    element.questionOptions = newOptions;
                });

                props.dispatch({ type: "SET_ALL_QUESTIONS", payload: questions });
                console.log("all questions: ", questions);
                props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: true });
            }
        },
        _render: {
            bars({ player = 0 } = {}) {
                const bars = [];
                if (props.currentQuestion.isQuestionsLoaded && props.currentQuestion.isStarted) {
                    if (player == 0) {
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
                    } else {
                        for (let a = 0; a < props.questionSettings.questionCount; a++) {
                            if (player == 1) {
                                if (a == props.currentQuestion.versusStats.p1.currentStep) {
                                    bars.push(<View style={{ ...style.bars, backgroundColor: "#A1A1A1" }} key={a}></View>);
                                } else {
                                    if (props.currentQuestion.versusStats.p1.currentStep < a) {
                                        bars.push(<View style={style.bars} key={a}></View>);
                                    } else {
                                        bars.push(<View style={{ ...style.bars, backgroundColor: props.currentQuestion.versusStats.p1.questionResults[a].questionAnswerCorrect ? "#63D816" : "#E80707" }} key={a}></View>);
                                    }
                                }
                            } else if (player == 2) {
                                if (a == props.currentQuestion.versusStats.p2.currentStep) {
                                    bars.push(<View style={{ ...style.bars, backgroundColor: "#A1A1A1" }} key={a}></View>);
                                } else {
                                    if (props.currentQuestion.versusStats.p2.currentStep < a) {
                                        bars.push(<View style={style.bars} key={a}></View>);
                                    } else {
                                        bars.push(<View style={{ ...style.bars, backgroundColor: props.currentQuestion.versusStats.p2.questionResults[a].questionAnswerCorrect ? "#63D816" : "#E80707" }} key={a}></View>);
                                    }
                                }
                            }
                        }
                    }
                }

                return bars
            },
            versus() {
                return (
                    <>
                        {
                            props.currentQuestion.versusStats.gameFinished && page._render.versusFinished()
                        }
                        {
                            props.currentQuestion.versusStats.gameStarted || page._render.ready()
                        }
                        <View style={{ height: "50%", transform: [{ rotate: '180deg' }] }}>
                            {
                                props.currentQuestion.versusStats.p1.finished ? page._render.playerFinished() : <><View style={{ ...style.headerContainer }}>
                                    <View style={style.headerLeft}>
                                        <FontAwesomeIcon icon={faClock} size={16} color={Theme(props.settings.darkMode).textDefault} />
                                        {props.currentQuestion.isStarted && _timer._render({ player: 1 })}
                                        <Text style={{ ...style.timerFinishText, color: Theme(props.settings.darkMode).textDefault }}>/ {prettyMs(props.questionSettings.perQuestionTime)}</Text>
                                    </View>
                                    <View style={style.headerRight}>
                                        <Text style={{ ...style.questionCountTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question")}:</Text>
                                        <Text style={{ ...style.questionCount, color: Theme(props.settings.darkMode).textDefault }}>{(props.currentQuestion.versusStats.p1.currentStep + 1)}</Text>
                                        <Text style={{ color: Theme(props.settings.darkMode).textDefault }}> /{props.questionSettings.questionCount}</Text>
                                    </View>
                                </View>
                                    <View style={style.barsWrapper}>
                                        {page._render.bars({ player: 1 })}
                                    </View>
                                    <View style={style.content}>
                                        {
                                            props.currentQuestion.isQuestionsLoaded && <QuestionSolve
                                                currentQuestion={props.currentQuestion.versusStats.p1.currentStep}
                                                onAnswerPress={(element, index) => page._gotoNextQuestion({ element: element, index: index, player: 1 })}
                                                versusMode
                                                player={1}
                                            />
                                        }
                                    </View>
                                </>
                            }
                        </View>
                        <View style={{ height: "50%" }}>
                            {
                                props.currentQuestion.versusStats.p2.finished ? page._render.playerFinished() : <>
                                    <View style={{ ...style.headerContainer }}>
                                        <View style={style.headerLeft}>
                                            <FontAwesomeIcon icon={faClock} size={16} color={Theme(props.settings.darkMode).textDefault} />
                                            {props.currentQuestion.isStarted && _timer._render({ player: 2 })}
                                            <Text style={{ ...style.timerFinishText, color: Theme(props.settings.darkMode).textDefault }}>/ {prettyMs(props.questionSettings.perQuestionTime)}</Text>
                                        </View>
                                        <View style={style.headerRight}>
                                            <Text style={{ ...style.questionCountTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question")}:</Text>
                                            <Text style={{ ...style.questionCount, color: Theme(props.settings.darkMode).textDefault }}>{(props.currentQuestion.versusStats.p2.currentStep + 1)}</Text>
                                            <Text style={{ color: Theme(props.settings.darkMode).textDefault }}> /{props.questionSettings.questionCount}</Text>
                                        </View>
                                    </View>
                                    <View style={style.barsWrapper}>
                                        {page._render.bars({ player: 2 })}
                                    </View>
                                    <View style={style.content}>
                                        {
                                            props.currentQuestion.isQuestionsLoaded && <QuestionSolve
                                                currentQuestion={props.currentQuestion.versusStats.p2.currentStep}
                                                onAnswerPress={(element, index) => page._gotoNextQuestion({ element: element, index: index, player: 2 })}
                                                versusMode
                                                player={2}
                                            />
                                        }
                                    </View>
                                </>
                            }

                        </View>

                    </>
                )
            },
            questions() {
                return (<>
                    <View style={style.headerContainer}>
                        {
                            props.route.params.question.isChildPlay || <View style={style.headerLeft}>
                                <FontAwesomeIcon icon={faClock} size={16} color={Theme(props.settings.darkMode).textDefault} />
                                {props.currentQuestion.isStarted && _timer._render()}
                                <Text style={{ ...style.timerFinishText, color: Theme(props.settings.darkMode).textDefault }}>/ {prettyMs(props.questionSettings.perQuestionTime)}</Text>
                            </View>
                        }
                        <View style={style.headerRight}>
                            <Text style={{ ...style.questionCountTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question")}:</Text>
                            <Text style={{ ...style.questionCount, color: Theme(props.settings.darkMode).textDefault }}>{(props.currentQuestion.currentStep + 1)}</Text>
                            <Text style={{ color: Theme(props.settings.darkMode).textDefault }}> /{props.questionSettings.questionCount}</Text>
                        </View>
                    </View>
                    {
                        props.route.params.question.isChildPlay || <View style={style.barsWrapper}>
                            {page._render.bars()}
                        </View>
                    }
                    <View style={style.content}>
                        <QuestionSolve
                            currentQuestion={props.currentQuestion}
                            onAnswerPress={(element, index) => page._gotoNextQuestion({ element: element, index: index })}
                            isChildPlay={props.route.params.question.isChildPlay}
                            isDragDrop={props.route.params.question.isDragDrop}
                            onDragAnswerFinish={(element) => page._onDragAnswerFinish({ element: element })}
                            onDraggedInput={() => page._onDragInput()}
                        />
                    </View>
                </>
                )
            },
            modals() {
                return (
                    <>
                        <AwesomeAlert
                            show={props.reducer.modals.backQuestion}
                            showProgress={false}
                            title={I18n.t("question_solving_back_title")}
                            message={I18n.t("question_solving_back_desc")}
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={false}
                            showCancelButton={true}
                            showConfirmButton={true}
                            useNativeDriver={true}
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
                    </>
                )
            },
            versusFinished() {

                const pageWinner = ({ results, isWinner, totalQuestions, onHomePage, onRetry }) => {

                    //const resultProgressCorrect = map(results.totalCorrect, 0, totalQuestions, 1, 100);
                    //const resultProgressWrong = map(results.totalWrong, 0, totalQuestions, 1, 100);

                    return (
                        <View style={{ ...style.pageWinnerContainer, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <View style={style.pageWinnerTextWrapper}>
                                <Text style={{ ...style.pageWinnerTitle, color: isWinner ? "#0FCB3B" : "#DC1818" }}>{isWinner ? I18n.t("versus_winner") : I18n.t("versus_loser")}!</Text>
                            </View>
                            <View style={style.pageTimeTextWrapper}>
                                <Text style={{ ...style.pageTimeText, color: Theme(props.settings.darkMode).textDefault }}>{totalQuestions} {I18n.t("versus_question")} - {prettyMs(results.finalTime)}</Text>
                            </View>
                            <View style={style.pageWinnerCorrects}>
                                <Text style={{ ...style.pageWinnerResultText, color: "#0FCB3B" }}>{results.totalCorrect} {I18n.t("question_answer_correct")}</Text>
                                <Text style={{ ...style.pageWinnerResultText, color: "#DC1818", marginLeft: 8, marginRight: 8 }}>{results.totalWrong} {I18n.t("question_answer_wrong")}</Text>
                                <Text style={{ ...style.pageWinnerResultText, color: Theme(props.settings.darkMode).textDefault }}>{results.totalEmpty} {I18n.t("question_answer_empty")}</Text>
                            </View>
                            {
                                /*
                                    <View style={style.pageWinnerProgressWrapper}>
                                        <ProgressBar value={resultProgressCorrect} height={10} />
                                    </View>
                                    <View style={style.pageWinnerProgressWrapper}>
                                        <ProgressBar value={resultProgressWrong} height={10} barColor="#DC1818" />
                                    </View>
                                */
                            }
                            <View style={style.pageWinnerButtonsWrapper}>
                                <View style={style.buttonWrapper}>
                                    <TouchableOpacity style={style.pageWinnerButton} onPress={() => onHomePage()}>
                                        <View style={style.pageWinnerButtonIcon}>
                                            <FontAwesomeIcon icon={faHome} size={30} color={"#fff"} />
                                        </View>
                                        <Text style={{ ...style.pageWinnerButtonText, color: Theme(props.settings.darkMode).blue }}>{I18n.t("dragdrop_results_home")}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={style.buttonWrapper}>
                                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }} onPress={() => onRetry()}>
                                        <View style={{ ...style.pageWinnerButtonIcon, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground, borderColor: Theme(props.settings.darkMode).blue, borderWidth: 2, }}>
                                            <FontAwesomeIcon icon={faUndoAlt} size={30} color={Theme(props.settings.darkMode).blue} />
                                        </View>
                                        <Text style={{ ...style.pageWinnerButtonText, color: Theme(props.settings.darkMode).blue }}>{I18n.t("dragdrop_results_playAgain")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View >
                    )
                }

                return (<View style={style.versusContainer}>
                    <View style={style.versusBox}>
                        <View style={{ flex: 1, transform: [{ rotate: '180deg' }] }}>
                            {pageWinner({
                                results: props.currentQuestion.versusStats.p1,
                                isWinner: (props.currentQuestion.versusStats.winner == 1),
                                totalQuestions: props.questionSettings.questionCount,
                                onHomePage: () => page._returnToHome(),
                                onRetry() {
                                    page._returnToHome();
                                    props.navigation.navigate('QuestionScreen', { question: props.route.params.question });
                                }
                            })}
                        </View>
                        <View style={{ height: 2, paddingLeft: 24, paddingRight: 24, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <View style={{ height: 2, width: "100%", backgroundColor: "#000", opacity: 0.1, }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            {pageWinner({
                                results: props.currentQuestion.versusStats.p2,
                                isWinner: (props.currentQuestion.versusStats.winner == 2),
                                totalQuestions: props.questionSettings.questionCount,
                                onHomePage: () => page._returnToHome(),
                                onRetry() {
                                    page._returnToHome();
                                    props.navigation.navigate('QuestionScreen', { question: props.route.params.question });
                                }
                            })}
                        </View>

                    </View>
                </View>)
            },
            playerFinished() {
                return (<View style={style.playerFinishedWrapper}>
                    <Text style={{ fontSize: 18, color: Theme(props.settings.darkMode).textDefault }}>{(props.currentQuestion.versusStats.p1.finished && props.currentQuestion.versusStats.p2.finished) || I18n.t("versus_you_finished")}</Text>
                </View>)
            },
            ready() {

                const checkBothReady = () => {
                    if (props.currentQuestion.versusStats.p1.ready && props.currentQuestion.versusStats.p2.ready) {
                        props.dispatch({ type: "SET_GAME_STARTED", payload: true });
                        props.dispatch({ type: "SET_QUESTION_SOLVING", payload: true });
                        _timer.startTimer();
                        setSplitPlayerQ1Time(Date.now());
                        setSplitPlayerQ2Time(Date.now());
                        setQuestionStartTime(Date.now());
                    }
                }

                const pageCheckReady = ({ ready, player, onPress } = {}) => {
                    return (
                        <View style={{ flex: 1 }}>
                            <View style={style.playerReadyTitleWrapper}>
                                <Text style={{ ...style.playerReadyTitle, color: ready ? "#0FCB3B" : "#DC1818" }}>{I18n.t("versus_ready_player_title")} {player}</Text>
                            </View>
                            <View style={style.playerReadyIcon}>
                                <FontAwesomeIcon icon={ready ? faCheck : faTimes} size={88} color={ready ? "#0FCB3B" : "#DC1818"} />
                            </View>
                            <View style={style.playerReadyDesc}>
                                <Text style={{ color: Theme(props.settings.darkMode).textDefault }}>{ready || I18n.t("versus_ready_desc")}</Text>
                            </View>
                            <View style={style.playerReadyButtonWrapper}>
                                <TouchableOpacity style={style.bottomButton} activeOpacity={0.7} onPress={() => onPress()}>
                                    <Text style={{ ...style.playerReadyButtonText, color: Theme(props.settings.darkMode).textInverse }}>{ready ? I18n.t("versus_not_ready") : I18n.t("versus_ready")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View >
                    )
                }

                return (<View style={style.overlayReadyWrapper}>
                    <View style={style.overlayReady}>
                        <View style={{ flex: 1, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground, transform: [{ rotate: '180deg' }], paddingBottom: 16 }}>
                            {
                                pageCheckReady({
                                    ready: props.currentQuestion.versusStats.p1.ready,
                                    player: 1,
                                    onPress() {
                                        if (props.currentQuestion.versusStats.p1.ready) {
                                            props.dispatch({ type: "SET_PLAYER1_READY", payload: false });
                                        } else {
                                            props.dispatch({ type: "SET_PLAYER1_READY", payload: true });
                                            checkBothReady();
                                        }
                                    }
                                })
                            }
                        </View>
                        <View style={{ height: 2, paddingLeft: 24, paddingRight: 24, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            <View style={{ height: 2, width: "100%", backgroundColor: "#000", opacity: 0.1, }} />
                        </View>
                        <View style={{ flex: 1, paddingBottom: 16, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                            {
                                pageCheckReady({
                                    ready: props.currentQuestion.versusStats.p2.ready,
                                    player: 2,
                                    onPress() {
                                        if (props.currentQuestion.versusStats.p2.ready) {
                                            props.dispatch({ type: "SET_PLAYER2_READY", payload: false });
                                        } else {
                                            props.dispatch({ type: "SET_PLAYER2_READY", payload: true });
                                            checkBothReady();
                                        }
                                    }
                                })
                            }
                        </View>
                    </View>
                </View>)
            },
        }
    }

    const onBackCancel = () => {
        props.dispatch({ type: "SET_MODAL", payload: { backQuestion: false } })
        _timer.resume();
    }

    const onBackSubmit = () => {
        props.dispatch({ type: "SET_MODAL", payload: { backQuestion: false } })
        props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: false });
        props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
        props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });
        //props.dispatch({ type: "RESET_VERSUS_STATS" });
        props.dispatch({ type: "RESET_QUESTION_RESULTS" });
        props.dispatch({ type: "SET_GAME_STARTED", payload: false });
        props.dispatch({ type: "SET_PLAYER1_READY", payload: false });
        props.dispatch({ type: "SET_PLAYER2_READY", payload: false });
        props.dispatch({ type: "SET_DRAG_DROP_NEXT_BUTTON", payload: false });
        props.dispatch({ type: "RESET_DRAG_DROP_INPUT" });
        props.dispatch({ type: "SET_VERSUS_GAME_FINISHED", payload: false });
        props.dispatch({
            type: "SET_DRAG_DROP_CURRENT_RESULT",
            payload: 0
        });
        _timer.pause();
        _timer.clear();
        props.navigation.removeListener('beforeRemove');
        props.navigation.popToTop();
    }

    return (
        <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            {props.route.params.question.isVersusMode || <Header pauseShown onPause={() => page._pause()} />}
            {props.route.params.question.isVersusMode ? (props.currentQuestion.isQuestionsLoaded && page._render.versus()) : (props.currentQuestion.isQuestionsLoaded && page._render.questions())}
            {page._render.modals()}
            {
                props.currentQuestion.dragDropNextQuestion && <View style={style.bottomButtonOverlay}>
                    <TouchableOpacity
                        style={style.bottomButton}
                        onPress={() => page._dragDropNextQuestion()}>
                        <Text style={{ color: "#fff", fontSize: 17 }}>{I18n.t("dragdrop_nextquestion")}</Text>
                    </TouchableOpacity>
                </View>
            }
        </SafeAreaView>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        currentQuestion: state.currentQuestion,
        questionSettings: state.questionSettings,
        settings: state.settings,
    }
};

export default connect(mapStateToProps)(QuestionScreen);


import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Text, View, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import _ from "lodash";
import prettyMs from 'pretty-ms';
import AwesomeAlert from 'react-native-awesome-alerts';
import Sound from 'react-native-sound';

import Theme from '../../../themes'
import I18n from "../../../utils/i18n.js";
import style from './style';
import Header from "../../header";
import QuestionSolve from '../../questionsolve';

const sounds = {
    correct: require('../../../../src/sounds/correct_2.mp3'),
    wrong: require('../../../../src/sounds/wrong.mp3'),
}

const QuestionScreen = props => {

    const [timer, setTimer] = useState(0);
    const [thisQuestionTime, setQTime] = useState(0);
    const [thisPlayerQ1Time, setSplitPlayerQ1Time] = useState(0);
    const [thisPlayerQ2Time, setSplitPlayerQ2Time] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);

    useEffect(async () => {
        console.log("loaded question solving");
        console.log("question params: ", props.route.params);
        page._loadQuestions();
        props.dispatch({ type: "SET_QUESTION_SOLVING", payload: true });
        _timer.startTimer();
        props.navigation.addListener('beforeRemove', (e) => page._preventGoingBack(e));
    }, []);

    const _timer = { // 5 saat
        startTimer: () => {
            console.log("@START TIMER");
            setTimerStarted(true);
        },
        clear: () => setTimer(0),
        pause: () => setTimerStarted(false),
        resume: () => setTimerStarted(true),
        _render: ({ player = 0 } = {}) => {

            if (player == 1) return (<Text style={{ marginLeft: 8, color: Theme(props.settings.darkMode).textDefault }}>{prettyMs(timer - thisPlayerQ1Time, { colonNotation: true })}</Text>)
            else if (player == 2) return (<Text style={{ marginLeft: 8, color: Theme(props.settings.darkMode).textDefault }}>{prettyMs(timer - thisPlayerQ2Time, { colonNotation: true })}</Text>)

            return (
                <Text style={{ marginLeft: 8, color: Theme(props.settings.darkMode).textDefault }}>{prettyMs(timer - thisQuestionTime, { colonNotation: true })}</Text>
            )
        }
    }

    useEffect(() => {
        let timeout = null;
        if (timerStarted) {
            timeout = setTimeout(async () => {
                if (props.route.params.question.isVersusMode) {
                    // for player 1
                    if ((timer - thisPlayerQ1Time) >= props.questionSettings.perQuestionTime) {
                        //await _timer.pause(); // -> Soru süresi aşılırsa
                        page._questionEmpty({ currentStep: props.currentQuestion.versusStats.p1.currentStep, player: 1 });
                    }

                    if ((timer - thisPlayerQ2Time) >= props.questionSettings.perQuestionTime) {
                        //await _timer.pause(); // -> Soru süresi aşılırsa
                        page._questionEmpty({ currentStep: props.currentQuestion.versusStats.p2.currentStep, player: 2 });
                    }
                } else {
                    if ((timer - thisQuestionTime) >= props.questionSettings.perQuestionTime) {
                        //await _timer.pause(); // -> Soru süresi aşılırsa
                        page._questionEmpty({ currentStep: props.currentQuestion.currentStep });
                    }
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
        _finishQuestionSolving: async ({ player = 0 } = {}) => {
            //props.dispatch({ type: 'LOAD_ADS' }); // Load ads first

            // 2 state var, birincisi player 1 bitirmiş ama player 2 bitirmemiş veya ikisi de bitirmiş.

            if (props.route.params.question.isVersusMode) {

                if (player == 1) {
                    props.dispatch({ type: "SET_PLAYER1_FINISHED_SOLVING", payload: true });
                } else if (player == 2) {
                    props.dispatch({ type: "SET_PLAYER2_FINISHED_SOLVING", payload: true });
                }

                if (props.currentQuestion.versusStats.p1.finished && props.currentQuestion.versusStats.p2.finished) {
                    alert("both finished");
                    _timer.pause();
                    _timer.clear();
                    setSplitPlayerQ1Time(0);
                    setSplitPlayerQ2Time(0);
                    props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
                    let results = {
                        p1: {
                            correct: 0,
                            wrong: 0,
                            empty: 0,
                        },
                        p2: {
                            correct: 0,
                            wrong: 0,
                            empty: 0,
                        }
                    }
                }

            } else {
                props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
                props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });
                let results = {
                    correct: 0,
                    wrong: 0,
                    empty: 0,
                }
                props.currentQuestion.questionResults.map((element, index) => {
                    if (element.questionAnswerCorrect) results.correct += 1;
                    else if (element.questionEmpty) results.empty += 1;
                    else results.wrong += 1;
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
                await props.navigation.removeListener('beforeRemove')

                console.log("@finish question solving");
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
                    //setPlayerQTime({ ...thisPQTime, player1: timer });
                    setSplitPlayerQ1Time(timer);
                    console.log("qTime PLAYER1: ", timer);
                } else if (player == 2) {
                    props.dispatch({ type: "GOTO_NEXT_QUESTION_PLAYER2" });
                    //setPlayerQTime({ ...thisPQTime, player2: timer });
                    setSplitPlayerQ2Time(timer);
                    console.log("qTime PLAYER2: ", timer);
                }
            } else if (player == 0) {
                props.dispatch({ type: "GOTO_NEXT_QUESTION" });
                setQTime(timer);
                console.log("qTime ", timer);
            }
        },
        _questionEmpty: ({ currentStep, player = 0 } = {}) => {

            if (player != 0) {
                if (player == 1) {
                    props.dispatch({
                        type: "PUSH_TO_PLAYER1_STAT",
                        payload: {
                            questionStep: currentStep,
                            questionAnswerCorrect: false,
                            questionAnswer: 0,
                            questionSolveTime: timer,
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
                            questionSolveTime: timer,
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
                        questionSolveTime: timer,
                        questionTime: timer - thisQuestionTime,
                        questionEmpty: true,
                    }
                });

                if ((props.currentQuestion.currentStep + 1) < props.questionSettings.questionCount) {
                    page._nextQuestion();
                    setTimerStarted(true);
                } else {
                    page._finishQuestionSolving();
                }
            }

        },
        _renderBars: ({ player = 0 } = {}) => {
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
        _renderVersus: () => {
            return (
                <>
                    <View style={{ height: "50%", transform: [{ rotate: '180deg' }] }}>
                        {
                            props.currentQuestion.versusStats.p1.finished ? <View><Text>Finished</Text></View> : <><View style={{ ...style.headerContainer }}>
                                <View style={style.headerLeft}>
                                    <FontAwesomeIcon icon={faClock} size={16} color={Theme(props.settings.darkMode).textDefault} />
                                    {_timer._render({ player: 1 })}
                                    <Text style={{ ...style.timerFinishText, color: Theme(props.settings.darkMode).textDefault }}>/ {prettyMs(props.questionSettings.perQuestionTime)}</Text>
                                </View>
                                <View style={style.headerRight}>
                                    <Text style={{ ...style.questionCountTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question")}:</Text>
                                    <Text style={{ ...style.questionCount, color: Theme(props.settings.darkMode).textDefault }}>{(props.currentQuestion.versusStats.p1.currentStep + 1)}</Text>
                                    <Text style={{ color: Theme(props.settings.darkMode).textDefault }}> /{props.questionSettings.questionCount}</Text>
                                </View>
                            </View>
                                <View style={style.barsWrapper}>
                                    {page._renderBars({ player: 1 })}
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
                    <View style={{ height: "50%", backgroundColor: "#eee" }}>
                        {
                            props.currentQuestion.versusStats.p2.finished ? <View><Text>Finished</Text></View> : <>
                                <View style={{ ...style.headerContainer }}>
                                    <View style={style.headerLeft}>
                                        <FontAwesomeIcon icon={faClock} size={16} color={Theme(props.settings.darkMode).textDefault} />
                                        {_timer._render({ player: 2 })}
                                        <Text style={{ ...style.timerFinishText, color: Theme(props.settings.darkMode).textDefault }}>/ {prettyMs(props.questionSettings.perQuestionTime)}</Text>
                                    </View>
                                    <View style={style.headerRight}>
                                        <Text style={{ ...style.questionCountTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question")}:</Text>
                                        <Text style={{ ...style.questionCount, color: Theme(props.settings.darkMode).textDefault }}>{(props.currentQuestion.versusStats.p2.currentStep + 1)}</Text>
                                        <Text style={{ color: Theme(props.settings.darkMode).textDefault }}> /{props.questionSettings.questionCount}</Text>
                                    </View>
                                </View>
                                <View style={style.barsWrapper}>
                                    {page._renderBars({ player: 2 })}
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
        _renderQuestions: () => {
            return (<>
                <View style={style.headerContainer}>
                    <View style={style.headerLeft}>
                        <FontAwesomeIcon icon={faClock} size={16} color={Theme(props.settings.darkMode).textDefault} />
                        {_timer._render()}
                        <Text style={{ ...style.timerFinishText, color: Theme(props.settings.darkMode).textDefault }}>/ {prettyMs(props.questionSettings.perQuestionTime)}</Text>
                    </View>
                    <View style={style.headerRight}>
                        <Text style={{ ...style.questionCountTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question")}:</Text>
                        <Text style={{ ...style.questionCount, color: Theme(props.settings.darkMode).textDefault }}>{(props.currentQuestion.currentStep + 1)}</Text>
                        <Text style={{ color: Theme(props.settings.darkMode).textDefault }}> /{props.questionSettings.questionCount}</Text>
                    </View>
                </View>
                <View style={style.barsWrapper}>
                    {page._renderBars()}
                </View>
                <View style={style.content}>
                    <QuestionSolve
                        currentQuestion={props.currentQuestion}
                        onAnswerPress={(element, index) => page._gotoNextQuestion({ element: element, index: index })}
                    />
                </View>
            </>
            )
        },
        _renderModals: () => {
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
        _generateRandomInt: (min, max) => {
            const random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random
        },
        _preventGoingBack: e => {
            e.preventDefault();
            _timer.pause();
            props.dispatch({ type: "SET_MODAL", payload: { backQuestion: true } })
        },
        _gotoNextQuestion: async ({ element, index, player = 0 } = {}) => {

            let questionAnswerCorrect = (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOptions[index] == props.currentQuestion.questions[props.currentQuestion.currentStep].questionAnswer);

            if (player == 1) {
                questionAnswerCorrect = (props.currentQuestion.questions[props.currentQuestion.versusStats.p1.currentStep].questionOptions[index] == props.currentQuestion.questions[props.currentQuestion.versusStats.p1.currentStep].questionAnswer);
            } else if (player == 2) {
                questionAnswerCorrect = (props.currentQuestion.questions[props.currentQuestion.versusStats.p2.currentStep].questionOptions[index] == props.currentQuestion.questions[props.currentQuestion.versusStats.p2.currentStep].questionAnswer);
            }

            console.log("PLAYER:", player, " CORRECT: ", questionAnswerCorrect);

            if (player == 0) {
                await props.dispatch({
                    type: "PUSH_TO_QUESTION_RESULT",
                    payload: {
                        questionStep: props.currentQuestion.currentStep,
                        questionAnswerCorrect: questionAnswerCorrect,
                        questionAnswer: element,
                        questionSolveTime: timer,
                        questionTime: timer - thisQuestionTime
                    }
                });
            } else if (player == 1) {
                await props.dispatch({
                    type: "PUSH_TO_PLAYER1_STAT",
                    payload: {
                        questionStep: props.currentQuestion.versusStats.p1.currentStep,
                        questionAnswerCorrect: questionAnswerCorrect,
                        questionAnswer: element,
                        questionSolveTime: timer,
                        questionTime: timer - thisPlayerQ1Time,
                    }
                });
            } else if (player == 2) {
                await props.dispatch({
                    type: "PUSH_TO_PLAYER2_STAT",
                    payload: {
                        questionStep: props.currentQuestion.versusStats.p2.currentStep,
                        questionAnswerCorrect: questionAnswerCorrect,
                        questionAnswer: element,
                        questionSolveTime: timer,
                        questionTime: timer - thisPlayerQ2Time,
                    }
                });
            }

            const soundCallback = (error, sound) => {
                if (error) {
                    Alert.alert('error', error.message);
                    return;
                }
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

            if (player == 0) {
                if ((props.currentQuestion.currentStep + 1) < props.questionSettings.questionCount) {
                    page._nextQuestion();
                } else {
                    page._finishQuestionSolving();
                }
            } else if (player == 1) {
                if ((props.currentQuestion.versusStats.p1.currentStep + 1) < props.questionSettings.questionCount) {
                    page._nextQuestion({ player: player });
                    console.log("NEXT QUESTION FOR PLAYER 1, STEP: ", props.currentQuestion.versusStats.p1.currentStep + 1);
                } else {
                    page._finishQuestionSolving({ player: player });
                }
            } else if (player == 2) {
                if ((props.currentQuestion.versusStats.p2.currentStep + 1) < props.questionSettings.questionCount) {
                    page._nextQuestion({ player: player });
                    console.log("NEXT QUESTION FOR PLAYER 2, STEP: ", props.currentQuestion.versusStats.p2.currentStep + 1);
                } else {
                    page._finishQuestionSolving({ player: player });
                }
            }

        },
        _loadQuestions: () => {
            console.log("@Load Questions")
            props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: false });
            const performance_begin = performance.now();
            const questions = [];
            console.log("Performance begin set for questions");

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
            //console.log("_____ QUESTIONS: ", questions);

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
                            console.log("----");
                            console.log("basamak: ", digits);
                            console.log("range: ", range);
                            console.log("generated questionoption: ", digits);
                        } else {
                            a--;
                        }
                    }
                }
            });

            questions.map(question => question.questionOptions.sort(() => Math.random() - 0.5))

            props.dispatch({ type: "SET_ALL_QUESTIONS", payload: questions });
            console.log("set all questions: ", questions);
            props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: true });
            const performance_after = performance.now();
            console.log("generation performance: " + (performance_after - performance_begin) + "ms")
            console.log("questions ", questions);
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
        _timer.pause();
        _timer.clear();
        props.navigation.removeListener('beforeRemove');
        props.navigation.popToTop();
    }

    return (
        <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            {props.route.params.question.isVersusMode || <Header pauseShown onPause={() => page._pause()} />}

            {
                props.route.params.question.isVersusMode ? (props.currentQuestion.isQuestionsLoaded && page._renderVersus()) : (props.currentQuestion.isQuestionsLoaded && page._renderQuestions())
            }

            {
                page._renderModals()
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


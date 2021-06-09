import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Text, View, Alert, TouchableOpacity, Button } from 'react-native';
import style from './style';
import Header from "../../header";
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import _ from "lodash";
import I18n from "../../../utils/i18n.js";
import prettyMs from 'pretty-ms';

import QuestionSolve from '../../questionsolve';

const QuestionScreen = props => {

    const [timer, setTimer] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);

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

    const _timer = { // buna 5 saat harcadım
        //timer: null,
        startTimer: () => {
            console.log("@START TIMER");
            //setStart(Date.now());
            /*
            _timer.timer = setInterval(() => {
                setTime(time + 100);
            }, 100);*/
            setTimerStarted(true);
        },
        clear: () => {
            /*clearInterval(_timer.timer);
            setTime(0);*/
            //setTimerStarted(false);
            setResetTimer(true);
        },
        pause: () => {
            /*
            clearInterval(_timer.timer);
            _timer.oldStart = Date.now();*/

            setTimerStarted(false);
        },
        resume: () => {
            //setStart(Date.now());
            //console.log("Paused for this long: ", (Date.now() - _timer.oldStart))
            //const myold = Date.now() - _timer.oldStart;
            //console.log("myold: ", (Date.now() - Date.now() + myold))
            //_timer.clear();
            //setStart(Date.now());

            //setStart(_timer.oldStart);

            /*
            _timer.timer = setInterval(() => { // set another interval
                setTime(time + 100);
            }, 100);*/

            /*clearInterval(_timer.timer);
            _timer.timer = setInterval(() => { // set another interval
                setTime(Date.now());
            }, 100);*/

            setTimerStarted(true);
        },
        _render: () => {
            return (
                <Text style={{ marginLeft: 8 }}>{timer}</Text>
            )
        }
    }

    useEffect(() => {
        if (timerStarted) {
            const timeout = setTimeout(() => {
                setTimer(timer + 100);
            }, 100);
        }
    }, [timer, timerStarted]);

    //

    const page = { // page handler 
        _modal: control => {
            props.dispatch({ type: "SET_PAUSE_MODAL", payload: control });
        },
        _pause: () => {
            page._modal(true);
        },
        _continue: () => {
            page._modal(false);
        },
        _goBack: () => {
            page._modal(false);
            props.navigation.goBack();
        },
        _finishQuestionSolving: () => {
            console.log("@finish question solving");
            props.navigation.navigate('ResultScreen');
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
            Alert.alert(
                I18n.t("question_solving_back_title"),
                I18n.t("question_solving_back_desc"),
                [
                    {
                        text: I18n.t("question_solving_back_cancel"), style: 'cancel', onPress: () => {
                            _timer.resume();
                        }
                    },
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
        },
        _gotoNextQuestion: async (element, index) => {
            await props.dispatch({
                type: "PUSH_TO_QUESTION_RESULT", payload: {
                    questionStep: props.currentQuestion.currentStep,
                    questionAnswerCorrect: (props.currentQuestion.questions[props.currentQuestion.currentStep].questionOptions[index] == props.currentQuestion.questions[props.currentQuestion.currentStep].questionAnswer),
                    questionAnswer: element,
                    questionSolveTime: timer,
                }
            });
            if ((props.currentQuestion.currentStep + 1) < props.questionSettings.questionCount) {
                props.dispatch({ type: "GOTO_NEXT_QUESTION" });
                _timer.clear();
            } else {
                props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
                props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });

                console.log("SORU ÇÖZÜMÜ BİTTİ: ", props.currentQuestion.questionResults);

                props.navigation.removeListener('beforeRemove')
                props.navigation.popToTop();
                _finishQuestionSolving();
            }
        }
    }

    const _loadQuestions = () => {
        console.log("@Load Questions")

        const performance_begin = performance.now();

        props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: false });

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
            const keys = Object.keys(props.questionSettings.operations).filter(k => props.questionSettings.operations[k] === true); // true olan keyleri arraya al
            const questionOperationRandom = keys[_.sample(Object.keys(keys))] // arraydan rastgele key getir
            console.log("KEY: ", questionOperationRandom)

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
                }
            } else if (questionOperationRandom == values[2]) {
                numberTemp = number1 * number2;
            } else if (questionOperationRandom == values[3]) {
                const isInt = value => {
                    return (parseFloat(value) == parseInt(value)) && !isNaN(value);
                }

                const isPrime = value => {
                    let result = 0;
                    for (let i = 1; i < value; i++) { if (value % i == 0) result++; }
                    if (result > 1) return false
                    else return true
                }

                number1 = page._generateRandomInt((props.questionSettings.minRange), props.questionSettings.maxRange);
                const bolenler = []; // bölmenin olasılıkları

                while (isPrime(number1)) {
                    number1 = page._generateRandomInt((props.questionSettings.minRange), props.questionSettings.maxRange);
                }

                while (!isInt(number1 / number2)) {
                    number2 = page._generateRandomInt((props.questionSettings.minRange), props.questionSettings.maxRange);
                }

                for (let i = 1; i < number1; i++) {
                    let sonuc = number1 / i;
                    if (isInt(sonuc)) {
                        bolenler.push(sonuc);
                    }
                }

                console.log("bölenler ", bolenler);

                let randomKey = _.sample(bolenler); // Arraydan rastgele bölen al
                while (randomKey == number1) {
                    randomKey = _.sample(bolenler)
                }
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

        // rasgele seçenek üretimi
        questions.map(question => {
            for (let a = 1; a <= props.questionSettings.optionCount; a++) {
                if (a == 1) {
                    question.questionOptions.push(question.questionAnswer);
                } else {
                    let randomNumber = page._generateRandomInt(props.questionSettings.minRange, props.questionSettings.maxRange);

                    /*
                    if(question.questionOperation == values[2]){
                        // Çarpmaysa rasgele seçenekleri ona göre üret
                    }
                    */

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

        const performance_after = performance.now();

        console.log("generation performance: " + (performance_after - performance_begin) + "ms")
        console.log("questions ", questions);
    }

    return (
        <View style={style.container}>
            <Header pauseShown onPause={() => _pause()} />
            <View style={style.headerContainer}>
                <View style={style.headerLeft}>
                    <FontAwesomeIcon icon={faClock} size={16} color={"#000"} />
                    {_timer._render()}
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
                {page._renderBars()}
            </View>

            <View style={style.content}>
                {props.reducer.currentQuestion.isQuestionsLoaded &&
                    <QuestionSolve
                        currentQuestion={props.currentQuestion}
                        onAnswerPress={(element, index) => page._gotoNextQuestion(element, index)}
                    />
                }
            </View>

            {/* #################### MODAL #################### */}
            <Modal
                isVisible={props.reducer.pauseModalShown}
                onSwipeComplete={() => page._continue()}
                swipeDirection={['down']}
                style={style.modalWrapper}
                onBackdropPress={() => page._continue()}>

                <View style={style.modal}>

                    <Text style={style.modalTitle}>{I18n.t("modal_paused")}</Text>
                    <View style={style.modalSeperator}></View>

                    <TouchableOpacity style={style.button} onPress={() => page._continue()}>
                        <Text style={style.buttonText}>{I18n.t("modal_continue")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ ...style.button, backgroundColor: "#bd0f0f", marginTop: 6 }} onPress={() => page._goBack()}>
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
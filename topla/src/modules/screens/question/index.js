import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Alert, TouchableOpacity, Button } from 'react-native';
import style from './style';
import Header from "../../header";
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

import _ from "lodash";

// Components
import QuestionSolve from '../../questionsolve';

class QuestionScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            timer: 0,
        }
    }

    _modal = (control) => {
        this.props.dispatch({ type: "SET_PAUSE_MODAL", payload: control });
    }

    _pause = () => {
        this._modal(true);
    }

    _continue = () => {
        this._modal(false);
    }

    _goBack = () => {
        this._modal(false);
        this.props.navigation.goBack();
    }

    _generateRandomInt = (min, max) => {
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        return random
    }

    _loadQuestions = () => {
        // TODO: Question settings'deki ayarlara göre currentQuestion.questions'a rasgele seçenekler ile pushlayacak

        console.log("@Load Questions")

        this.props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: false });

        const questions = [];

        for (let a = 1; a <= this.props.questionSettings.questionCount; a++) {
            let number1 = this._generateRandomInt(this.props.questionSettings.minRange, this.props.questionSettings.maxRange);
            let number2 = this._generateRandomInt(this.props.questionSettings.minRange, this.props.questionSettings.maxRange);
            let numberTemp = 0;

            const values = ["addition", "subtraction", "multiplication", "division"];

            const operation = value => {
                if (value == values[0]) return "+"
                if (value == values[1]) return "-"
                if (value == values[2]) return "x"
                if (value == values[3]) return "/"
            }

            const keys = Object.keys(this.props.questionSettings.operations).filter(k => this.props.questionSettings.operations[k] === true);
            const questionOperationRandom = keys[_.sample(Object.keys(keys))]
            console.log("KEY: ", questionOperationRandom)

            if (questionOperationRandom == values[0]) {
                numberTemp = number1 + number2;
            } else if (questionOperationRandom == values[1]) {
                numberTemp = number1 - number2;
                if (numberTemp < 0) {
                    alert(number1 + operation(questionOperationRandom) + number2 + "=" + numberTemp);
                    a--; // TODO: asdads
                }
            }

            questions.push({
                question: `${number1} ${operation(questionOperationRandom)} ${number2}`,
                questionArguments: [number1, number2],
                questionAnswer: numberTemp, // TODO: seçenek sayısına göre
                questionOptions: [],
                questionOperation: questionOperationRandom, // işlem // TODO: 4 tane işlem varsa random 4 yap
            });

        }

        // rasgele seçenek üretimi
        questions.map((question, index) => {
            for (let a = 1; a <= this.props.questionSettings.optionCount; a++) {
                if (a == 1) {
                    question.questionOptions.push(question.questionAnswer);
                } else {
                    let randomNumber = this._generateRandomInt(this.props.questionSettings.minRange, this.props.questionSettings.maxRange);
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

        this.props.dispatch({ type: "SET_ALL_QUESTIONS", payload: questions });
        this.props.dispatch({ type: "SET_QUESTIONS_LOADED", payload: true });
        console.log("questions ", questions);
    }

    _renderBars = () => {
        const bars = [];
        for (let a = 0; a < this.props.questionSettings.questionCount; a++) {
            if (a == this.props.currentQuestion.currentStep) {
                bars.push(<View style={{ ...style.bars, backgroundColor: "#A1A1A1" }} key={a}></View>);
            } else {
                if (this.props.currentQuestion.currentStep < a) {
                    bars.push(<View style={style.bars} key={a}></View>);
                } else {
                    bars.push(<View style={{ ...style.bars, backgroundColor: this.props.currentQuestion.questionResults[a].questionAnswerCorrect ? "#63D816" : "#E80707" }} key={a}></View>);
                }
            }
        }
        return bars
    }

    _renderTimer = () => {

        let time = 0;

        return (
            <Text>asdasd</Text>
        )
    }

    _finishQuestionSolving = () => {
        console.log("@finish question solving");
        this.props.navigation.navigate('ResultScreen')

    }

    _preventGoingBack = e => {
        e.preventDefault();
        Alert.alert(
            'Çözümler iptal olacak',
            'Çıkış yapmak istediğinize emin misiniz?',
            [
                { text: "Iptal", style: 'cancel', onPress: () => { } },
                {
                    text: 'Geri',
                    style: 'destructive',
                    onPress: () => {
                        this.props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
                        this.props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });
                        this.props.dispatch({ type: "RESET_QUESTION_RESULTS" });
                        this.props.navigation.dispatch(e.data.action)
                    },
                },
            ]
        )
    }

    _gotoNextQuestion = async (element, index) => {

        // TODO: iki ayrı if else içinde iki ayrı dispatch değil bir tane merkezi dispatch'a bağla

        if (this.props.currentQuestion.questions[this.props.currentQuestion.currentStep].questionOptions[index] == this.props.currentQuestion.questions[this.props.currentQuestion.currentStep].questionAnswer) {
            await this.props.dispatch({
                type: "PUSH_TO_QUESTION_RESULT", payload: {
                    questionStep: this.props.currentQuestion.currentStep,
                    questionAnswerCorrect: true,
                    questionAnswer: element,
                }
            });
        } else {
            await this.props.dispatch({
                type: "PUSH_TO_QUESTION_RESULT", payload: {
                    questionStep: this.props.currentQuestion.currentStep,
                    questionAnswerCorrect: false,
                    questionAnswer: element,
                }
            });
        }

        if ((this.props.currentQuestion.currentStep + 1) < this.props.questionSettings.questionCount) {
            this.props.dispatch({ type: "GOTO_NEXT_QUESTION" });
        } else {
            this.props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
            this.props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });

            console.log("SORU ÇÖZÜMÜ BİTTİ: ", this.props.currentQuestion.questionResults);

            this.props.navigation.removeListener('beforeRemove')
            this.props.navigation.popToTop();
            this._finishQuestionSolving();
        }

    }

    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e) => this._preventGoingBack(e))

        if (!this.props.currentQuestion.isStarted) {
            // Soru çözümünü başlat
            this.props.dispatch({ type: "SET_QUESTION_SOLVING", payload: true });
        }

        this._loadQuestions();
    }

    render() {

        return (
            <View style={style.container}>
                <Header pauseShown onPause={() => this._pause()} />
                <View style={style.headerContainer}>
                    <View style={style.headerLeft}>
                        <FontAwesomeIcon icon={faClock} size={16} color={"#000"} />
                        {this._renderTimer()}
                        <Text style={style.timerFinishText}>/ 10sn</Text>
                    </View>
                    <View style={style.headerRight}>
                        <Text style={style.questionCountTitle}>Soru:</Text>
                        <Text style={style.questionCount}>{(this.props.currentQuestion.currentStep + 1)}</Text>
                        <Text> /{this.props.questionSettings.questionCount}</Text>
                    </View>
                </View>

                <View style={style.barsWrapper}>
                    {/* Bars */}
                    {this._renderBars()}
                </View>

                <View style={style.content}>
                    {this.props.reducer.currentQuestion.isQuestionsLoaded &&
                        <QuestionSolve
                            currentQuestion={this.props.currentQuestion}
                            onAnswerPress={(element, index) => this._gotoNextQuestion(element, index)}
                        />
                    }
                </View>

                {/* #################### MODAL #################### */}
                <Modal
                    isVisible={this.props.reducer.pauseModalShown}
                    onSwipeComplete={() => this._continue()}
                    swipeDirection={['down']}
                    style={style.modalWrapper}
                    onBackdropPress={() => this._continue()}>

                    <View style={style.modal}>

                        <Text style={style.modalTitle}>Durduruldu</Text>
                        <View style={style.modalSeperator}></View>

                        <TouchableOpacity style={style.button} onPress={() => this._continue()}>
                            <Text style={style.buttonText}>Devam Et</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ ...style.button, backgroundColor: "#bd0f0f", marginTop: 6 }} onPress={() => this._goBack()}>
                            <Text style={style.buttonText}>Çıkış</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    const { reducer } = state;
    const { questionSettings } = reducer;
    const { currentQuestion } = reducer;
    return { reducer, currentQuestion, questionSettings }
};

export default connect(mapStateToProps)(QuestionScreen);
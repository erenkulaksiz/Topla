import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Alert, TouchableOpacity, Button } from 'react-native';
import style from './style';
import Header from "../../header";
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

class QuestionScreen extends React.Component {

    constructor(props) {
        super(props)
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

    _renderBars = () => {
        const myBars = [];
        for (let a = 1; a <= this.props.questionSettings.questionCount; a++) {
            if (a == this.props.currentQuestion.currentStep) {
                myBars.push(<View style={{ ...style.bars, backgroundColor: "black" }} key={a}></View>);
            } else {
                myBars.push(<View style={style.bars} key={a}></View>);
            }
        }
        return myBars
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
                    onPress: () => this.props.navigation.dispatch(e.data.action),
                },
            ]
        )
    }

    _gotoNextQuestion = () => {
        // TODO: first check if question is true here.

        //const currentStep = this.props.reducer.currentQuestion.currentStep;


        if (this.props.currentQuestion.currentStep < this.props.questionSettings.questionCount) {
            this.props.dispatch({ type: "GOTO_NEXT_QUESTION" });
        } else {
            this.props.dispatch({ type: "SET_QUESTION_SOLVING", payload: false });
            this.props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 0 });

            // buradan sonuçlar ekranına git

            this.props.navigation.removeListener('beforeRemove')

            this.props.navigation.popToTop();

            this._finishQuestionSolving();
        }

    }

    componentDidMount() {

        this.props.navigation.addListener('beforeRemove', (e) => this._preventGoingBack(e))


        if (this.props.currentQuestion.currentStep == 0) {
            this.props.dispatch({ type: "SET_ACTIVE_QUESTION_SOLVING", payload: 1 });
        }

        if (!this.props.currentQuestion.isStarted) {
            // Soru çözümünü başlat
            this.props.dispatch({ type: "SET_QUESTION_SOLVING", payload: true });
        }

        console.log("ADASDDSASDASD", this.props.currentQuestion)
    }

    render() {

        return (
            <View style={style.container}>
                <Header pauseShown onPause={() => this._pause()} />
                <View style={style.headerContainer}>
                    <View style={style.headerLeft}>
                        <FontAwesomeIcon icon={faClock} size={16} color={"#000"} />
                        <Text style={style.timerText}>8sn</Text>
                        <Text style={style.timerFinishText}>/ 10sn</Text>
                    </View>
                    <View style={style.headerRight}>
                        <Text style={style.questionCountTitle}>Soru:</Text>
                        <Text style={style.questionCount}>{this.props.currentQuestion.currentStep}</Text>
                        <Text> /5</Text>
                    </View>
                </View>

                <View style={style.barsWrapper}>
                    {/* Bars */}
                    {this._renderBars()}
                </View>

                <View style={style.content}>
                    <Button onPress={() => this._gotoNextQuestion()} title="next"></Button>
                </View>


                {/* ################################################ */}
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
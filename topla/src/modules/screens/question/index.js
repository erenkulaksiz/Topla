import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import style from './style';
import Header from "../../header";
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

class QuestionScreen extends React.Component {

    constructor(props) {
        super(props)
        this.barsCount = 5;
        this.bars = [];
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

    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e) => {
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
        })
    }

    render() {

        for (let a = 1; a < this.barsCount; a++) {
            this.bars.push(<View style={style.bars} key={"bar_" + a}></View>);
        }

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
                        <Text style={style.questionCount}>1</Text>
                        <Text> /5</Text>
                    </View>
                </View>

                <View style={style.barsWrapper}>
                    {/* Bars */}
                    {this.bars}
                </View>

                <View style={style.content}>
                    <Text>dfgdf</Text>
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
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionScreen);
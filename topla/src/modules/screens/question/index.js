import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Alert, Button, TouchableOpacity } from 'react-native';
import style from './style';
import Header from "../../header";
import Modal from 'react-native-modal';

class QuestionScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    _modal = (control) => {
        this.props.dispatch({ type: "SET_PAUSE_MODAL", payload: control });
    }

    _pause = () => {
        this._modal(true);

        //this.props.navigation.goBack();
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

        return (
            <View style={style.container}>
                <Header pauseShown onPause={() => this._pause()} />
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>Soru</Text>
                    <View style={style.headerBar}></View>
                </View>
                <View style={style.content}>
                    <Text>dfgdf</Text>
                </View>
                <Modal
                    isVisible={this.props.reducer.pauseModalShown}
                    onSwipeComplete={() => { this._modal(false) }}
                    swipeDirection={['down']}
                    style={style.modalWrapper}
                    onBackdropPress={() => { this._modal(false) }}>
                    <View style={style.modal}>

                        <Text style={style.modalTitle}>Durduruldu</Text>
                        <View style={style.modalSeperator}></View>

                        <TouchableOpacity style={style.button} onPress={() => { this._modal(false) }}>
                            <Text style={style.buttonText}>Devam Et</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...style.button, backgroundColor: "#bd0f0f", marginTop: 6 }} onPress={() => { this._modal(false) }}>
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
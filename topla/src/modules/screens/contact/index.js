import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button } from 'react-native';
import style from './style';

import Header from "../../header";

const ContactScreen = props => {

    const _sendToAPI = () => {
        props.dispatch({ type: "API_SEND_MESSAGE", payload: { message: "MESAJJJ", email: "royjce@gmail.com" } });
    }

    return (
        <View style={style.container}>
            <Header backShown={true} onBack={() => { props.navigation.goBack() }} />
            <View style={style.headerContainer}>
                <Text style={style.headerText}>İletişim</Text>
                <View style={style.headerBar}></View>
            </View>
            <View style={style.content}>
                <Text>Contact</Text>
                <Button title='GONDER' onPress={() => _sendToAPI}></Button>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(ContactScreen);
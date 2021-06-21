import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button, TextInput } from 'react-native';
import style from './style';

import Header from "../../header";

const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ContactScreen = props => {
    const _sendToAPI = () => {
        if (re.test(String(props.API.contact.email).toLowerCase())) {
            props.dispatch({
                type: "API_SEND_MESSAGE",
                payload: {
                    uuid: props.reducer.deviceInfo.uuid,
                    bundleId: props.reducer.deviceInfo.bundleId,
                    model: props.reducer.deviceInfo.model,
                    message: props.API.contact.message,
                    email: props.API.contact.email,
                    reason: props.API.contact.reason,
                    API_TOKEN: props.API.API_TOKEN,
                }
            });
        } else {
            alert("Invalid email");
        }
    }

    const _setMail = email => {
        props.dispatch({ type: "SET_API_CONTACT", payload: { email: email } })
    }

    const _setMessage = msg => {
        props.dispatch({ type: "SET_API_CONTACT", payload: { message: msg } })
    }

    return (
        <View style={style.container}>
            <Header backShown={true} onBack={() => { props.navigation.goBack() }} />
            <View style={style.headerContainer}>
                <Text style={style.headerText}>İletişim</Text>
                <View style={style.headerBar}></View>
            </View>
            <View style={style.content}>
                <Text style={{ fontSize: 16, marginBottom: 8, }}>E-mail Adresiniz</Text>
                <TextInput
                    style={style.input}
                    onChangeText={text => {
                        _setMail(text);
                    }}
                    value={props.API.contact.email}
                    placeholder={"E-Mail Adresiniz"}
                    autoFocus={true}
                />
                <Text style={{ fontSize: 16, marginBottom: 8, }}>Mesajınız</Text>
                <TextInput
                    multiline
                    numberOfLines={4}
                    onChangeText={text => {
                        _setMessage(text);
                    }}
                    value={props.API.contact.message}
                    placeholder={"Mesajınız"}
                    editable
                    maxLength={300}
                    style={style.input}
                />
                <Button title='GONDER' onPress={() => _sendToAPI()}></Button>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        API: state.API,
    }
};

export default connect(mapStateToProps)(ContactScreen);
import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Alert } from 'react-native';
import style from './style';
import { StackActions } from '@react-navigation/native';
import Header from "../../header";

class QuestionScreen extends React.Component {

    _goBack = () => {
        alert("ads");
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e) => {
            // Prevent default behavior of leaving the screen
            e.preventDefault();

            // Prompt the user before leaving the screen
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
                <Header backShown={true} onBack={() => this._goBack()} />
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>Soru</Text>
                    <View style={style.headerBar}></View>
                </View>
                <View style={style.content}>
                    <Text>asd</Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionScreen);
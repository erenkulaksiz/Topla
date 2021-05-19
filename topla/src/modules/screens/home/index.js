import React from 'react';
import { connect } from 'react-redux';
import { Text, View, ScrollView } from "react-native";
import style from './style';

import QuestionSlot from "../../questionslot";
import Header from "../../header";

import questionTypes from "./questionTypes";

import I18n from "../../../utils/i18n.js";

class HomeScreen extends React.Component {

    // TODO: Premium ekranında önce internet kontrolü yap

    _questionPlay(question) {
        this.props.navigation.navigate('QuestionSettings', { question: question })
    }

    render() {

        const questionList = questionTypes.map((question, index) => {
            return (<QuestionSlot
                key={index}
                onPlay={() => { this._questionPlay(question) }}
                question={question}
            />)
        })

        return (
            <View style={style.container}>
                <Header />
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>{I18n.t("home")}</Text>
                    <View style={style.headerBar}></View>
                </View>
                <ScrollView style={style.questionsScroll}>
                    {questionList}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(HomeScreen);
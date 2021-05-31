import React from 'react';
import { Text, View, ScrollView } from "react-native";
import style from './style';

import QuestionSlot from "../../questionslot";
import Header from "../../header";

import questionTypes from "./questionTypes";

import I18n from "../../../utils/i18n.js";

class HomeScreen extends React.Component {

    _questionPlay(question) {
        this.props.navigation.navigate('QuestionSettings', { question: question })
    }

    render() {

        return (
            <View style={style.container}>
                <Header />
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>{I18n.t("home")}</Text>
                    <View style={style.headerBar}></View>
                </View>
                <ScrollView style={style.questionsScroll}>
                    {questionTypes.map((question, index) => {
                        return (<QuestionSlot
                            key={index}
                            onPlay={() => { this._questionPlay(question) }}
                            question={question}
                        />)
                    })}
                </ScrollView>
            </View>
        );
    }
}

export default HomeScreen;
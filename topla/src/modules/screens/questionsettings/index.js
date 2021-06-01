import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Text, View, Button, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import Header from "../../header";

import I18n from "../../../utils/i18n.js";

const QuestionSettings = props => {

    const _navigateToQuestion = question => {
        const keys = Object.keys(props.reducer.questionSettings.operations).filter(k => props.reducer.questionSettings.operations[k] === true);

        console.log("WHO GOT THE KEYS -> ", keys);
        if (keys.length == 0) {
            alert("Please select atleast one operation");
        } else {
            props.navigation.navigate('QuestionScreen', { question: question })
        }
    }

    const _incrementOptions = () => {
        props.dispatch({ type: "INCREMENT_QUESTION_OPTIONS" });
    }

    const _decrementOptions = () => {
        props.dispatch({ type: "DECREMENT_QUESTION_OPTIONS" });
    }

    const _incrementQuestionCount = () => {
        props.dispatch({ type: "INCREMENT_QUESTION_COUNT" });
    }

    const _decrementQuestionCount = () => {
        props.dispatch({ type: "DECREMENT_QUESTION_COUNT" });
    }

    const _setMaxRange = value => {
        if (parseInt(value)) {
            // Eğer sayı geçerliyse
            value = parseInt(value)
        }
        if (props.reducer.questionSettings.maxRange >= 90) {
            setIncremental(100);
        } else if (props.reducer.questionSettings.maxRange < 90) {
            setIncremental(10);
        }
        props.dispatch({ type: "SET_MAX_RANGE", payload: value });
    }

    const _incrementMaxRange = () => {

        // TODO: Increment ve decrement bozuk.

        if (props.reducer.questionSettings.maxRange >= 90) {
            props.dispatch({ type: "SET_RANGE_INCREMENTAL", payload: 100 });
        } else if (props.reducer.questionSettings.maxRange <= 100) {
            props.dispatch({ type: "SET_RANGE_INCREMENTAL", payload: 10 });
        }
        console.log(props.reducer.questionSettings.maxRange + " <maxrange - incremental> " + props.reducer.questionSettings.rangeIncremental);
        props.dispatch({ type: "INCREMENT_MAX_RANGE", payload: props.reducer.questionSettings.rangeIncremental });
    }

    const _decrementMaxRange = () => {
        if (!props.reducer.questionSettings.maxRange <= 0) {
            if (props.reducer.questionSettings.maxRange >= 90) {
                props.dispatch({ type: "SET_RANGE_INCREMENTAL", payload: 100 });
            } else if (props.reducer.questionSettings.maxRange <= 100) {
                props.dispatch({ type: "SET_RANGE_INCREMENTAL", payload: 10 });
            }
            console.log(props.reducer.questionSettings.maxRange + " <maxrange - incremental> " + props.reducer.questionSettings.rangeIncremental);
            props.dispatch({ type: "DECREMENT_MAX_RANGE", payload: props.reducer.questionSettings.rangeIncremental });
        }
    }

    return (
        <View style={style.container}>
            <Header backShown onBack={() => props.navigation.goBack()} />
            <View style={style.headerContainer}>
                <View>
                    <Text style={style.headerText}>{I18n.t("question_settings")}</Text>
                </View>
                <View style={style.headerTextWrapperRight}>
                    <Text style={style.headerTextQuestionSettings}>{I18n.t("question_defaults")} - {props.route.params.question.name}</Text>
                </View>
            </View>
            <View style={style.headerBar}></View>
            <ScrollView style={style.content}>
                <View style={style.questionSettingsWrapper}>
                    <View style={style.elementLogoWrapper}>
                        <Image
                            style={style.elementLogo}
                            source={require('../../../tc.png')}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={style.settingsWrapper}>
                        <View style={style.setting}>
                            <Text style={style.settingTitle}>{I18n.t("question_numberRange")}: </Text>
                            <View style={style.settingWrapper}>
                                <View style={style.setting_incrementWrapper}>
                                    <View style={style.setting_increment}>
                                        <TouchableOpacity style={style.decrement} onPress={() => _decrementMaxRange()}>
                                            <Text style={{ fontSize: 18 }}>-{props.reducer.questionSettings.rangeIncremental}</Text>
                                        </TouchableOpacity>
                                        <View style={style.incrementCenter_field}>
                                            <TextInput
                                                style={style.inputfield}
                                                onChangeText={text => {
                                                    _setMaxRange(text);
                                                }}
                                                value={props.reducer.questionSettings.maxRange.toString()}
                                                placeholder="0"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        <TouchableOpacity style={style.increment} onPress={() => _incrementMaxRange()}>
                                            <Text style={{ fontSize: 18 }}>+{props.reducer.questionSettings.rangeIncremental}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={style.setting}>
                            <Text style={style.settingTitle}>{I18n.t("question_count")}: </Text>
                            <View style={style.settingWrapper}>
                                <View style={style.setting_incrementWrapper}>
                                    <View style={style.setting_increment}>
                                        <TouchableOpacity style={style.decrement} onPress={() => _decrementQuestionCount()}>
                                            <Text style={{ fontSize: 18 }}>-</Text>
                                        </TouchableOpacity>
                                        <View style={style.incrementCenter}>
                                            <Text style={{ fontSize: 16 }}>{props.reducer.questionSettings.questionCount}</Text>
                                        </View>
                                        <TouchableOpacity style={style.increment} onPress={() => _incrementQuestionCount()}>
                                            <Text style={{ fontSize: 18 }}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={style.setting}>
                            <Text style={style.settingTitle}>{I18n.t("question_optionCount")}: </Text>
                            <View style={style.settingWrapper}>
                                <View style={style.setting_incrementWrapper}>
                                    <View style={style.setting_increment}>
                                        <TouchableOpacity style={style.decrement} onPress={() => _decrementOptions()}>
                                            <Text style={{ fontSize: 18 }}>-</Text>
                                        </TouchableOpacity>
                                        <View style={style.incrementCenter}>
                                            <Text style={{ fontSize: 16 }}>{props.reducer.questionSettings.optionCount}</Text>
                                        </View>
                                        <TouchableOpacity style={style.increment} onPress={() => _incrementOptions()}>
                                            <Text style={{ fontSize: 18 }}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...style.setting, backgroundColor: "#e6e6e6", borderRadius: 4 }}>
                            <CheckBox
                                disabled={false}
                                value={props.reducer.questionSettings.operations.addition}
                                onValueChange={(newValue) => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.reducer.questionSettings.operations, addition: newValue } })}
                            />
                            <Text style={style.label}>{I18n.t("question_add")}</Text>
                        </View>
                        <View style={{ ...style.setting, backgroundColor: "#e6e6e6", borderRadius: 4 }}>
                            <CheckBox
                                disabled={false}
                                value={props.reducer.questionSettings.operations.subtraction}
                                onValueChange={(newValue) => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.reducer.questionSettings.operations, subtraction: newValue } })}
                            />
                            <Text style={style.label}>{I18n.t("question_sub")}</Text>
                        </View>
                        <View style={{ ...style.setting, backgroundColor: "#e6e6e6", borderRadius: 4 }}>
                            <CheckBox
                                disabled={false}
                                value={props.reducer.questionSettings.operations.multiplication}
                                onValueChange={(newValue) => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.reducer.questionSettings.operations, multiplication: newValue } })}
                            />
                            <Text style={style.label}>{I18n.t("question_mul")}</Text>
                        </View>
                        <View style={{ ...style.setting, backgroundColor: "#e6e6e6", borderRadius: 4 }}>
                            <CheckBox
                                disabled={false}
                                value={props.reducer.questionSettings.operations.division}
                                onValueChange={(newValue) => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.reducer.questionSettings.operations, division: newValue } })}
                            />
                            <Text style={style.label}>{I18n.t("question_div")}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={style.bottomButtonWrapper}>
                <TouchableOpacity style={style.bottomButton} onPress={() => _navigateToQuestion(props.route.params.question)}>
                    <FontAwesomeIcon icon={faPlay} size={12} color={"#fff"} />
                    <Text style={{ fontSize: 15, color: "#fff", marginLeft: 8 }}>{I18n.t("question_start")}</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSettings);
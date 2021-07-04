import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, ScrollView, Image, TextInput, SafeAreaView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import prettyMs from 'pretty-ms';
import Config from 'react-native-config';
import {
    AdMobBanner,
    //AdMobInterstitial,
} from 'react-native-admob'

import I18n from "../../../utils/i18n.js";
import Header from "../../header";
import Theme from '../../../themes'
import style from './style';

import {
    AdMobInterstitial,
} from 'react-native-admob'
import store from '../../../store/index.js';

const QuestionSettings = props => {

    useEffect(() => {
        // setQuestionParams
        console.log("@params: ", props.route.params.question);
        _setQuestionParams(props.route.params.question);
    }, []);

    const {
        questionCount,
        optionCount,
        perQuestionTime,
        operations,
        minRange,
        maxRange,
        rangeDecremental,
        rangeIncremental,
    } = props.questionSettings;

    const logSettings = {
        questionCount: questionCount,
        optionCount: optionCount,
        perQuestionTime: perQuestionTime,
        operations: operations,
        minRange: minRange,
        maxRange: maxRange,
        rangeDecremental: rangeDecremental,
        rangeIncremental: rangeIncremental,
    }

    const _showAds = async (question) => {
        console.log("show ads");

        const _navToQuestion = () => {
            /*
            store.dispatch({
                type: 'API_LOG',
                payload: {
                    uuid: props.reducer.deviceInfo.uuid,
                    bundleId: props.reducer.deviceInfo.bundleId,
                    ACTION: "questionsolve_start",
                    API_TOKEN: props.API.DATA.API_TOKEN,
                    ACTION_DESC: logSettings,
                }
            });*/

            props.navigation.navigate('QuestionScreen', { question: question });
            console.log("Should navigate now !!!");
            //store.dispatch({ type: 'SET_AD_READY', payload: false });
            //store.dispatch({ type: 'LOAD_ADS' });
        }

        AdMobInterstitial.removeAllListeners();

        if (props.reducer.ads.ready) {
            AdMobInterstitial.showAd();
            console.log("Ad is ready and showing ad");
        } else {
            console.log("Ad not ready, navigating to question");
            _navToQuestion();
            store.dispatch({ type: 'LOAD_ADS' });
        }

        AdMobInterstitial.addEventListener("adClosed", () => {
            console.log("!!! Ad closed!!!");
            _navToQuestion();
            store.dispatch({ type: 'SET_AD_READY', payload: false });
            store.dispatch({ type: 'LOAD_ADS' });
        });

        AdMobInterstitial.addEventListener("adFailedToLoad", () => {
            console.log("Cannot load ads!")
            store.dispatch({ type: 'SET_AD_READY', payload: false });
            _navToQuestion();
        });
    }

    const _setQuestionParams = question => {
        // setMaxRange
        props.dispatch({ type: "SET_MAX_RANGE", payload: question.maxRange });
        // setOperations
        props.dispatch({
            type: "SET_QUESTION_SETTINGS_OPERATIONS",
            payload: {
                addition: (question.operations.includes("addition")),
                subtraction: (question.operations.includes("subtraction")),
                multiplication: (question.operations.includes("multiplication")),
                division: (question.operations.includes("division")),
            }
        });
        // setQuestionCount
        props.dispatch({ type: "SET_QUESTION_COUNT", payload: question.questionCount });
        props.dispatch({ type: "SET_OPTION_COUNT", payload: question.optionCount });
        // setQuestionTime
        props.dispatch({ type: "SET_QUESTION_TIME", payload: question.questionTime });
    }

    const _navigateToQuestion = question => {
        const keys = Object.keys(props.questionSettings.operations).filter(k => props.questionSettings.operations[k] === true);

        if (keys.length == 0) {
            alert("Please select atleast one operation");
        } else {
            if (props.API.DATA.API_TOKEN) {
                if (props.API.DATA.hasPremium) {
                    props.navigation.navigate('QuestionScreen', { question: question })

                    /*

                    store.dispatch({
                        type: 'API_LOG',
                        payload: {
                            uuid: props.reducer.deviceInfo.uuid,
                            bundleId: props.reducer.deviceInfo.bundleId,
                            ACTION: "questionsolve_start",
                            API_TOKEN: props.API.DATA.API_TOKEN,
                            ACTION_DESC: logSettings,
                        }
                    });*/

                    /* // NAVIGATE IF USER HAS PREMIUM
                    
                    props.dispatch({
                        type: 'API_LOG',
                        payload: {
                            uuid: props.reducer.deviceInfo.uuid,
                            bundleId: props.reducer.deviceInfo.bundleId,
                            ACTION: "questionsolve_start",
                            API_TOKEN: props.API.DATA.API_TOKEN,
                            hasPremium: props.API.DATA.hasPremium,
                            ACTION_DESC: question,
                        }
                    });*/
                } else {
                    _showAds(question);
                }
            } else {
                _showAds(question); // If no api token, atleast try to load an ad
            }
        }
    }

    //

    const _incrementOptions = () => {
        props.dispatch({ type: "INCREMENT_QUESTION_OPTIONS" });
    }

    const _decrementOptions = () => {
        props.dispatch({ type: "DECREMENT_QUESTION_OPTIONS" });
    }

    //

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
        props.dispatch({ type: "SET_MAX_RANGE", payload: value });
        _calcRange();
    }

    const _calcRange = () => {
        const basamak = Math.max(Math.floor(Math.log10(Math.abs(props.questionSettings.maxRange))), 0) + 1
        const rangeIncremental = (Math.pow(10, (basamak - 1)));
        const rangeDec = (Math.pow(10, (basamak - 2)));

        props.dispatch({ type: "SET_RANGE_INCREMENTAL", payload: rangeIncremental });

        if (props.questionSettings.maxRange >= 100) {
            props.dispatch({ type: "SET_RANGE_DECREMENTAL", payload: rangeDec });
        } else {
            props.dispatch({ type: "SET_RANGE_DECREMENTAL", payload: rangeIncremental });
        }
    }

    const _incrementMaxRange = () => {
        props.dispatch({ type: "INCREMENT_MAX_RANGE", payload: props.questionSettings.rangeIncremental });
        _calcRange();
    }

    const _decrementMaxRange = () => {
        props.dispatch({ type: "DECREMENT_MAX_RANGE", payload: props.questionSettings.rangeDecremental });
        _calcRange();
    }

    const _incrementQuestionTime = () => {
        props.dispatch({ type: "INCREMENT_QUESTION_TIME" });
    }

    const _decrementQuestionTime = () => {
        props.dispatch({ type: "DECREMENT_QUESTION_TIME" });
    }

    return (
        <>
            <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
                <Header backShown onBack={() => props.navigation.goBack()} />
                <View style={style.headerContainer}>
                    <View>
                        <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("question_settings")}</Text>
                    </View>
                    <View style={style.headerTextWrapperRight}>
                        <Text style={{ ...style.headerTextQuestionSettings, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question_defaults")} - {props.route.params.question.name}</Text>
                    </View>
                </View>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
                <ScrollView style={style.content}>
                    <View style={{ ...style.questionSettingsWrapper, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                        <View style={style.elementLogoWrapper}>
                            <Image
                                style={style.elementLogo}
                                source={require('../../../tc.png')}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={style.settingsWrapper}>
                            <View style={style.setting}>
                                <Text style={{ ...style.settingTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question_numberRange")}: </Text>
                                <View style={style.settingWrapper}>
                                    <View style={style.setting_incrementWrapper}>
                                        <View style={style.setting_increment}>
                                            <TouchableOpacity style={{ ...style.decrement, borderColor: Theme(props.settings.darkMode).textDefault }} onPress={() => _decrementMaxRange()}>
                                                <Text style={{ fontSize: 14, color: Theme(props.settings.darkMode).textDefault }}>-{props.questionSettings.rangeDecremental}</Text>
                                            </TouchableOpacity>
                                            <View style={{ ...style.incrementCenter_field, borderColor: Theme(props.settings.darkMode).textDefault }}>
                                                <TextInput
                                                    style={{ ...style.inputfield, color: Theme(props.settings.darkMode).textDefault }}
                                                    onChangeText={text => {
                                                        _setMaxRange(text);
                                                    }}
                                                    value={props.questionSettings.maxRange.toString()}
                                                    placeholder="0"
                                                    keyboardType="numeric"
                                                    onSubmitEditing={() => {
                                                        console.log("Submit MAXRANGE")
                                                    }}
                                                />
                                            </View>
                                            <TouchableOpacity style={{ ...style.increment, borderColor: Theme(props.settings.darkMode).textDefault }} onPress={() => _incrementMaxRange()}>
                                                <Text style={{ fontSize: 14, color: Theme(props.settings.darkMode).textDefault }}>+{props.questionSettings.rangeIncremental}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={style.setting}>
                                <Text style={{ ...style.settingTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question_count")}: </Text>
                                <View style={style.settingWrapper}>
                                    <View style={style.setting_incrementWrapper}>
                                        <View style={style.setting_increment}>
                                            <TouchableOpacity style={{ ...style.decrement, borderColor: Theme(props.settings.darkMode).textDefault }} onPress={() => _decrementQuestionCount()}>
                                                <Text style={{ fontSize: 18, color: Theme(props.settings.darkMode).textDefault }}>-</Text>
                                            </TouchableOpacity>
                                            <View style={{ ...style.incrementCenter, borderColor: Theme(props.settings.darkMode).textDefault }}>
                                                <Text style={{ fontSize: 16, color: Theme(props.settings.darkMode).textDefault }}>{props.questionSettings.questionCount}</Text>
                                            </View>
                                            <TouchableOpacity style={{ ...style.increment, borderColor: Theme(props.settings.darkMode).textDefault }} onPress={() => _incrementQuestionCount()}>
                                                <Text style={{ fontSize: 18, color: Theme(props.settings.darkMode).textDefault }}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={style.setting}>
                                <Text style={{ ...style.settingTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question_optionCount")}: </Text>
                                <View style={style.settingWrapper}>
                                    <View style={style.setting_incrementWrapper}>
                                        <View style={style.setting_increment}>
                                            <TouchableOpacity style={{ ...style.decrement, borderColor: Theme(props.settings.darkMode).textDefault }} onPress={() => _decrementOptions()}>
                                                <Text style={{ fontSize: 18, color: Theme(props.settings.darkMode).textDefault }}>-</Text>
                                            </TouchableOpacity>
                                            <View style={{ ...style.incrementCenter, borderColor: Theme(props.settings.darkMode).textDefault }}>
                                                <Text style={{ fontSize: 16, color: Theme(props.settings.darkMode).textDefault }}>{props.questionSettings.optionCount}</Text>
                                            </View>
                                            <TouchableOpacity style={{ ...style.increment, borderColor: Theme(props.settings.darkMode).textDefault }} onPress={() => _incrementOptions()}>
                                                <Text style={{ fontSize: 18, color: Theme(props.settings.darkMode).textDefault }}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={style.setting}>
                                <Text style={{ ...style.settingTitle, color: Theme(props.settings.darkMode).textDefault }}>Soru Süresi: </Text>
                                <View style={style.settingWrapper}>
                                    <View style={style.setting_incrementWrapper}>
                                        <View style={style.setting_increment}>
                                            <TouchableOpacity style={{ ...style.decrement, borderColor: Theme(props.settings.darkMode).textDefault }} onPress={() => _decrementQuestionTime()}>
                                                <Text style={{ fontSize: 18, color: Theme(props.settings.darkMode).textDefault }}>-</Text>
                                            </TouchableOpacity>
                                            <View style={{ ...style.incrementCenter, borderColor: Theme(props.settings.darkMode).textDefault }}>
                                                <Text style={{ fontSize: 16, color: Theme(props.settings.darkMode).textDefault }}>{prettyMs(props.questionSettings.perQuestionTime)}</Text>
                                            </View>
                                            <TouchableOpacity style={{ ...style.increment, borderColor: Theme(props.settings.darkMode).textDefault }} onPress={() => _incrementQuestionTime()}>
                                                <Text style={{ fontSize: 18, color: Theme(props.settings.darkMode).textDefault }}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ ...style.setting, backgroundColor: Theme(props.settings.darkMode).container, borderRadius: 4 }}>
                                <CheckBox
                                    disabled={false}
                                    value={props.questionSettings.operations.addition}
                                    onValueChange={(newValue) => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, addition: newValue } })}
                                />
                                <Text style={{ ...style.label, color: Theme(props.settings.darkMode).textDefault }}>+ {I18n.t("question_add")}</Text>
                            </View>
                            <View style={{ ...style.setting, backgroundColor: Theme(props.settings.darkMode).container, borderRadius: 4 }}>
                                <CheckBox
                                    disabled={false}
                                    value={props.questionSettings.operations.subtraction}
                                    onValueChange={(newValue) => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, subtraction: newValue } })}
                                />
                                <Text style={{ ...style.label, color: Theme(props.settings.darkMode).textDefault }}>- {I18n.t("question_sub")}</Text>
                            </View>
                            <View style={{ ...style.setting, backgroundColor: Theme(props.settings.darkMode).container, borderRadius: 4 }}>
                                <CheckBox
                                    disabled={false}
                                    value={props.questionSettings.operations.multiplication}
                                    onValueChange={(newValue) => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, multiplication: newValue } })}
                                />
                                <Text style={{ ...style.label, color: Theme(props.settings.darkMode).textDefault }}>x {I18n.t("question_mul")}</Text>
                            </View>
                            <View style={{ ...style.setting, backgroundColor: Theme(props.settings.darkMode).container, borderRadius: 4 }}>
                                <CheckBox
                                    disabled={false}
                                    value={props.questionSettings.operations.division}
                                    onValueChange={(newValue) => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, division: newValue } })}
                                />
                                <Text style={{ ...style.label, color: Theme(props.settings.darkMode).textDefault }}>/ {I18n.t("question_div")}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={style.bottomButtonWrapper}>
                    <TouchableOpacity style={style.bottomButton} activeOpacity={0.7} onPress={() => _navigateToQuestion(props.route.params.question)}>
                        <FontAwesomeIcon icon={faPlay} size={12} color={"#fff"} />
                        <Text style={{ fontSize: 15, color: "#fff", marginLeft: 8 }}>{I18n.t("question_start")}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {
                props.API.DATA.hasPremium || <View style={{ width: "100%" }}>
                    <AdMobBanner
                        adSize="smartBanner"
                        adUnitID={Config.ADMOB_QUESTION_SETTINGS}
                        testDevices={[AdMobBanner.simulatorId]}
                        onAdFailedToLoad={error => console.error(error)}
                    />
                </View>
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        questionSettings: state.questionSettings,
        API: state.API,
        settings: state.settings,
    };
};

export default connect(mapStateToProps)(QuestionSettings);
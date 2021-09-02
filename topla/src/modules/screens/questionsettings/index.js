import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, ScrollView, Image, TextInput, SafeAreaView, KeyboardAvoidingView, TouchableOpacityBase } from 'react-native';
//import CheckBox from '@react-native-community/checkbox';
import ToggleSwitch from 'toggle-switch-react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay, faCrown } from '@fortawesome/free-solid-svg-icons'
import prettyMs from 'pretty-ms';
//import Config from 'react-native-config';
import {
    AdMobInterstitial,
} from 'react-native-admob'

/*
import {
    AdMobBanner,
    //AdMobInterstitial,
} from 'react-native-admob'
*/

import I18n from "../../../utils/i18n.js";
import Header from "../../header";
import Theme from '../../../themes'
import style from './style';
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
            });
            */

            props.navigation.navigate('QuestionScreen', { question: question });

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
            props.dispatch({ type: "SET_MODAL", payload: { selectKeys: true } })
        } else {
            if (props.API.DATA.API_TOKEN) {
                if (props.API.DATA.hasPremium) {

                    props.navigation.navigate('QuestionScreen', { question: question });

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

    const _navigateToPremium = () => {
        console.log("Should navigate to Premium from questionSettings");
        props.navigation.navigate('Premium', { ref: "questionSettings" });
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

    const _render = {
        toggles: () => {
            return (
                <View>
                    <TouchableOpacity
                        style={{ ...style.setting, backgroundColor: Theme(props.settings.darkMode).container, borderRadius: 4 }}
                        onPress={() => props.dispatch({ type: "SET_RESULT_DRAG_DROP", payload: !props.questionSettings.displayResultDragDrop })}
                        activeOpacity={0.7}>
                        <ToggleSwitch
                            isOn={props.questionSettings.displayResultDragDrop}
                            style={{ marginLeft: 12, marginRight: 12 }}
                            onColor="green"
                            offColor="red"
                            size="small"
                            onToggle={isOn => props.dispatch({ type: "SET_RESULT_DRAG_DROP", payload: isOn })}
                            animationSpeed={100} />
                        <Text style={{ ...style.label, color: Theme(props.settings.darkMode).textDefault }}>Anlık Sonucu Göster</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...style.setting, backgroundColor: Theme(props.settings.darkMode).container, borderRadius: 4 }}
                        onPress={() => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, addition: !props.questionSettings.operations.addition } })}
                        activeOpacity={0.7}>
                        <ToggleSwitch
                            isOn={props.questionSettings.operations.addition}
                            style={{ marginLeft: 12, marginRight: 12 }}
                            onColor="green"
                            offColor="red"
                            size="small"
                            onToggle={isOn => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, addition: isOn } })}
                            animationSpeed={100} />
                        <Text style={{ ...style.label, color: Theme(props.settings.darkMode).textDefault }}>+ {I18n.t("question_add")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...style.setting, backgroundColor: Theme(props.settings.darkMode).container, borderRadius: 4 }}
                        onPress={() => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, subtraction: !props.questionSettings.operations.subtraction } })}
                        activeOpacity={0.7}>
                        <ToggleSwitch
                            isOn={props.questionSettings.operations.subtraction}
                            style={{ marginLeft: 12, marginRight: 12 }}
                            onColor="green"
                            offColor="red"
                            size="small"
                            onToggle={isOn => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, subtraction: isOn } })}
                            animationSpeed={100} />
                        <Text style={{ ...style.label, color: Theme(props.settings.darkMode).textDefault }}>- {I18n.t("question_sub")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...style.setting, backgroundColor: Theme(props.settings.darkMode).container, borderRadius: 4 }}
                        onPress={() => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, multiplication: !props.questionSettings.operations.multiplication } })}
                        activeOpacity={0.7}>
                        <ToggleSwitch
                            isOn={props.questionSettings.operations.multiplication}
                            style={{ marginLeft: 12, marginRight: 12 }}
                            onColor="green"
                            offColor="red"
                            size="small"
                            onToggle={isOn => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, multiplication: isOn } })}
                            animationSpeed={100} />
                        <Text style={{ ...style.label, color: Theme(props.settings.darkMode).textDefault }}>x {I18n.t("question_mul")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...style.setting, backgroundColor: Theme(props.settings.darkMode).container, borderRadius: 4 }}
                        onPress={() => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, division: !props.questionSettings.operations.division } })}
                        activeOpacity={0.7}>
                        <ToggleSwitch
                            isOn={props.questionSettings.operations.division}
                            style={{ marginLeft: 12, marginRight: 12 }}
                            onColor="green"
                            offColor="red"
                            size="small"
                            onToggle={isOn => props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...props.questionSettings.operations, division: isOn } })}
                            animationSpeed={100} />
                        <Text style={{ ...style.label, color: Theme(props.settings.darkMode).textDefault }}>÷ {I18n.t("question_div")}</Text>
                    </TouchableOpacity>
                </View>
            )
        },
        incrementals: ({ onDecrementPress, onIncrementPress, value = 0, isEditable = false, isSeconds = false, onInputChange, inputValue, incrementalValue = 0, decrementalValue = 0, darkMode = false }) => {
            return (
                <View style={style.setting_incrementWrapper}>
                    <View style={style.setting_increment}>
                        <TouchableOpacity style={{ ...style.decrement, borderColor: Theme(darkMode).textDefault }} onPress={() => onDecrementPress()}>
                            <Text style={{ fontSize: 18, color: Theme(darkMode).textDefault }}>-{decrementalValue != 0 && decrementalValue}</Text>
                        </TouchableOpacity>
                        {
                            isEditable ? <KeyboardAvoidingView style={{ ...style.incrementCenter_field, borderColor: Theme(darkMode).textDefault }} behavior="padding" enabled>
                                <TextInput
                                    style={{ ...style.inputfield, color: Theme(darkMode).textDefault }}
                                    onChangeText={text => onInputChange(text)}
                                    value={inputValue.toString()}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    onSubmitEditing={() => {
                                        console.log("Submit MAXRANGE")
                                    }}
                                /></KeyboardAvoidingView > : <View style={{ ...style.incrementCenter, borderColor: Theme(darkMode).textDefault }}>
                                <Text style={{ fontSize: 16, color: Theme(darkMode).textDefault }}>
                                    {isSeconds ? prettyMs(value) : value}
                                </Text>
                            </View>
                        }
                        <TouchableOpacity style={{ ...style.increment, borderColor: Theme(darkMode).textDefault }} onPress={() => onIncrementPress()}>
                            <Text style={{ fontSize: 18, color: Theme(darkMode).textDefault }}>+{incrementalValue != 0 && incrementalValue}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    return (
        <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            <Header backShown onBack={() => props.navigation.goBack()} />
            <View style={style.headerContainer}>
                <View>
                    <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>
                        {props.route.params.question.isVersusMode ? I18n.t("questionPlay_versus_title") : I18n.t("question_settings")}
                    </Text>
                </View>
                {
                    props.route.params.question.isVersusMode || props.route.params.question.isDragDrop || <View style={style.headerTextWrapperRight}>
                        <Text style={{
                            ...style.headerTextQuestionSettings,
                            color: Theme(props.settings.darkMode).textDefault,
                            fontWeight: "bold"
                        }}>{I18n.t("question_defaults")} - <Text style={{ color: props.route.params.question.titleColor }}>
                                {props.route.params.question.name}
                            </Text>
                        </Text>
                    </View>
                }
            </View>
            <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
            <ScrollView style={style.content}>
                {
                    props.API.DATA.hasPremium || <>
                        <TouchableOpacity style={style.premiumWrapper} onPress={() => _navigateToPremium()} activeOpacity={0.36} />
                        <TouchableOpacity style={style.premiumTextWrapper} activeOpacity={0.7} onPress={() => _navigateToPremium()}>
                            <View style={style.premiumSegmentLeft}>
                                <View style={style.premiumSegmentIconWrapper}>
                                    <FontAwesomeIcon icon={faCrown} size={14} color={"#000"} />
                                </View>
                            </View>
                            <View style={style.premiumSegmentMid}>
                                <Text style={{ fontSize: 10, fontWeight: "bold" }}>{I18n.t("buy_premium_title_qsettings")}</Text>
                                <Text style={{ fontSize: 12 }}>{I18n.t("buy_premium_desc_qsettings")}</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                }

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

                                {_render.incrementals({
                                    onDecrementPress: () => _decrementMaxRange(),
                                    onIncrementPress: () => _incrementMaxRange(),
                                    isEditable: true,
                                    onInputChange: (text) => _setMaxRange(text),
                                    inputValue: props.questionSettings.maxRange.toString(),
                                    decrementalValue: props.questionSettings.rangeDecremental,
                                    incrementalValue: props.questionSettings.rangeIncremental,
                                    darkMode: props.settings.darkMode,
                                })}

                            </View>
                        </View>
                        <View style={style.setting}>
                            <Text style={{ ...style.settingTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question_count")}: </Text>
                            <View style={style.settingWrapper}>

                                {_render.incrementals({
                                    onDecrementPress: () => _decrementQuestionCount(),
                                    onIncrementPress: () => _incrementQuestionCount(),
                                    value: props.questionSettings.questionCount,
                                    darkMode: props.settings.darkMode,
                                })}

                            </View>
                        </View>
                        {
                            props.route.params.question.isVersusMode || props.route.params.question.isDragDrop || <View style={style.setting}>
                                <Text style={{ ...style.settingTitle, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question_optionCount")}: </Text>
                                <View style={style.settingWrapper}>

                                    {_render.incrementals({
                                        onDecrementPress: () => _decrementOptions(),
                                        onIncrementPress: () => _incrementOptions(),
                                        value: props.questionSettings.optionCount,
                                        darkMode: props.settings.darkMode,
                                    })}

                                </View>
                            </View>
                        }
                        <View style={style.setting}>
                            <Text style={{ ...style.settingTitle, color: Theme(props.settings.darkMode).textDefault }}>Soru Süresi: </Text>
                            <View style={style.settingWrapper}>

                                {_render.incrementals({
                                    onDecrementPress: () => _decrementQuestionTime(),
                                    onIncrementPress: () => _incrementQuestionTime(),
                                    value: props.questionSettings.perQuestionTime,
                                    isSeconds: true,
                                    darkMode: props.settings.darkMode,
                                })}

                            </View>
                        </View>
                        {_render.toggles()}
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
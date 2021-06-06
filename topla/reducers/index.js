import { combineReducers } from 'redux';
import Config from 'react-native-config';
import {
    getBuildNumber,
} from 'react-native-device-info';
import { NativeModules, Platform } from 'react-native';
import * as RNLocalize from 'react-native-localize';
//import base64 from 'react-native-base64';

const config = {
    maxSoru: 15,
    minSoru: 2,
    maxSecenek: 7,
    minSecenek: 2,
}

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const INITIAL_STATE = {
    deviceInfo: {
        /*
            uuid: 'topla_' + getUniqueId(),
            id: getDeviceId(),
            buildNumber: getBuildNumber(),
            model: getModel(),
            bundleId: getBundleId(),
        */
    },
    connection: {},
    pauseModalShown: false,
    API: {
        register: {},
    },
    settings: {
        darkMode: false,
    },
    questionSettings: {
        questionCount: 5, // -> Şuanda çözülen sorunun max soru sayısı.
        optionCount: 4, // -> Seçenek sayısı
        perQuestionTime: 5000, // 5000 = 5 sn
        operations: {
            addition: true,
            subtraction: true,
            multiplication: false,
            division: false,
        },
        minRange: 1,
        maxRange: 20,
        rangeIncremental: 10,
    },
    currentQuestion: {
        currentStep: 0, // -> şuanda çözülen soru
        isStarted: false, // -> soru çözümü başladı mı
        isQuestionsLoaded: false, // -> tüm sorular yüklendi mi
        questions: [], // -> şimdi mesela 5 tane soru varsa 5 tane soruyu buraya pushlayacak (doğru seçeneklerle beraber)
        questionResults: [], // örn: 1. soru doğru, 2. soru yanlış, ne zaman doğru ne zaman yanlış vs.
    },
    questionTimer: {
        time: 0,
        started: false,
    }
};

const mainReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_DEVICE_INFO':
            console.log("set device info ", action.payload);
            return {
                ...state,
                deviceInfo: action.payload
            }
        case 'SET_DEVICE_CONNECTION':
            console.log("connection ", action.payload);
            return {
                ...state,
                connection: action.payload
            }
        case 'SET_PAUSE_MODAL':
            return {
                ...state,
                pauseModalShown: action.payload
            }
        case 'SET_ACTIVE_QUESTION_SOLVING':
            console.log("set active question to " + action.payload);
            return {
                ...state,
                currentQuestion: {
                    ...state.currentQuestion,
                    currentStep: action.payload
                }
            }
        case 'GOTO_NEXT_QUESTION':
            console.log("went to next question: " + (state.currentQuestion.currentStep + 1));
            return {
                ...state,
                currentQuestion: {
                    ...state.currentQuestion,
                    currentStep: state.currentQuestion.currentStep + 1
                }
            }
        case 'SET_QUESTION_SOLVING':
            console.log("question solving set: " + action.payload);
            return {
                ...state,
                currentQuestion: {
                    ...state.currentQuestion,
                    isStarted: action.payload
                }
            }
        case 'SET_ALL_QUESTIONS':
            console.log("SET ALL QUESTIONS");
            return {
                ...state,
                currentQuestion: {
                    ...state.currentQuestion,
                    questions: action.payload
                }
            }
        case 'SET_QUESTIONS_LOADED':
            console.log("questions loaded: " + action.payload)
            return {
                ...state,
                currentQuestion: {
                    ...state.currentQuestion,
                    isQuestionsLoaded: action.payload
                }
            }
        case 'PUSH_TO_QUESTION_RESULT':
            console.log("question result: ", action.payload)
            return {
                ...state,
                currentQuestion: {
                    ...state.currentQuestion,
                    questionResults: [...state.currentQuestion.questionResults, action.payload]
                }
            }
        case 'RESET_QUESTION_RESULTS':
            console.log("question results reset")
            return {
                ...state,
                currentQuestion: {
                    ...state.currentQuestion,
                    questionResults: []
                }
            }
        case 'INCREMENT_QUESTION_OPTIONS':

            let incremental_questionOptions = 0;

            if (state.questionSettings.optionCount >= config.maxSecenek) {
                incremental_questionOptions = 0;
            } else {
                incremental_questionOptions = 1;
            }

            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    optionCount: state.questionSettings.optionCount + incremental_questionOptions,
                }
            }
        case 'DECREMENT_QUESTION_OPTIONS':

            let decremental_questionOptions = 0;

            if (state.questionSettings.optionCount <= config.minSecenek) {
                decremental_questionOptions = 0;
            } else {
                decremental_questionOptions = 1;
            }

            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    optionCount: state.questionSettings.optionCount - decremental_questionOptions,
                }
            }
        case 'SET_OPTION_COUNT':
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    optionCount: action.payload,
                }
            }
        case 'INCREMENT_QUESTION_COUNT':

            let incremental_questionCount = 0;

            if (state.questionSettings.questionCount >= config.maxSoru) {
                incremental_questionCount = 0;
            } else {
                incremental_questionCount = 1;
            }

            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    questionCount: state.questionSettings.questionCount + incremental_questionCount,
                }
            }
        case 'DECREMENT_QUESTION_COUNT':

            let decremental_questionCount = 0;

            if (state.questionSettings.questionCount <= config.minSoru) {
                decremental_questionCount = 0;
            } else {
                decremental_questionCount = 1;
            }

            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    questionCount: state.questionSettings.questionCount - decremental_questionCount,
                }
            }
        case 'SET_QUESTION_COUNT':
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    questionCount: action.payload,
                }
            }
        case 'DARK_MODE':
            console.log("SET DARK MODE: ", !state.settings.darkMode);
            return {
                ...state,
                settings: {
                    ...state.settings,
                    darkMode: !state.settings.darkMode
                }
            }
        case 'SET_QUESTION_SETTINGS_OPERATIONS':
            console.log("NEW VALUE FOR SETTINGS: ", action.payload);
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    operations: action.payload,
                }
            }
        case 'SET_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", action.payload);
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    maxRange: action.payload,
                }
            }
        case 'INCREMENT_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", state.questionSettings.maxRange + action.payload);
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    maxRange: parseInt(state.questionSettings.maxRange) + action.payload,
                }
            }
        case 'DECREMENT_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", state.questionSettings.maxRange - action.payload);
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    maxRange: parseInt(state.questionSettings.maxRange) - action.payload,
                }
            }
        case 'SET_RANGE_INCREMENTAL':
            console.log("NEW VALUE FOR INCREMENTAL: ", action.payload);
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    rangeIncremental: action.payload,
                }
            }
        case 'API_REGISTER':
            console.log("@API_REGISTER");

            console.log("[!!!] USING URL: ", (Config.DEV_MODE ? Config.API_DEV_URL : Config.API_URL) + '/device');

            const registerDevice = async () => {
                const response = await fetch((Config.DEV_MODE ? Config.API_DEV_URL : Config.API_URL) + '/device', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uuid: state.deviceInfo.uuid,
                        bundle_id: state.deviceInfo.bundleId,
                        platform: Platform.OS,
                        channel: "organic",
                        language_code: deviceLanguage,
                        adjust_attr: "test aaa adjust",
                        app_version: getBuildNumber(),
                        country_code: RNLocalize.getCountry(),
                        timezone: RNLocalize.getTimeZone(),
                        model: state.deviceInfo.model,
                    }),
                }).then(response => {
                    response.json().then((data) => {
                        console.log("API_REGISTER: ", data);

                        return {
                            ...state,
                            API: {
                                ...state.API,
                                register: data,
                            }
                        }
                    })
                }).catch(function (error) {
                    throw error;
                });
                return response
            }

            registerDevice().catch(err => {
                console.log("[ERROR]: ", err);
                return {
                    ...state,
                    API: {
                        ...state.API,
                        register: "error " + err,
                    }
                }
            });
        default:
            return state
    }
};

export default combineReducers({
    reducer: mainReducer
});



import { combineReducers } from 'redux';

const INITIAL_STATE = {
    deviceInfo: {},
    connection: {},
    pauseModalShown: false,
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
        maxRange: 100,
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
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    optionCount: state.questionSettings.optionCount + 1,
                }
            }
        case 'DECREMENT_QUESTION_OPTIONS':
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    optionCount: state.questionSettings.optionCount - 1,
                }
            }
        case 'INCREMENT_QUESTION_COUNT':
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    questionCount: state.questionSettings.questionCount + 1,
                }
            }
        case 'DECREMENT_QUESTION_COUNT':
            return {
                ...state,
                questionSettings: {
                    ...state.questionSettings,
                    questionCount: state.questionSettings.questionCount - 1,
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
        default:
            return state
    }
};

export default combineReducers({
    reducer: mainReducer
});


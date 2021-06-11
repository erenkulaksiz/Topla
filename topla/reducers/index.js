import { combineReducers } from 'redux';
//import base64 from 'react-native-base64';

import API from './API'
import questionSettings from './questionSettings'
import currentQuestion from './currentQuestion'

const INITIAL_STATE = {
    deviceInfo: {},
    connection: {},
    pauseModalShown: false,
    PERFORMANCE: { // Performans ölçümü
        questions: {
            questionEnd_StartPerf: 0,
            questionEnd_EndPerf: 0,
            //questionEnd_perfBetween: 0,
        },
        questionPassPerf: [], // Sonraki soruya geçerken performansı test et
    },
    settings: {
        darkMode: false,
    },
};

const mainReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_DEVICE_INFO':
            console.log("set device info ", action.payload);
            state.deviceInfo = action.payload;
            return { ...state }

        case 'SET_DEVICE_CONNECTION':
            console.log("connection ", action.payload);
            state.connection = action.payload;
            return { ...state }

        case 'SET_PAUSE_MODAL':
            state.pauseModalShown = action.payload;
            return { ...state }

        case 'SET_PERF_QUESTION':
            console.log("NEW VALUE FOR PERF: ", action.payload);
            state.PERFORMANCE = { ...state.PERFORMANCE, ...action.payload };
            return { ...state }

        case 'DARK_MODE':
            console.log("SET DARK MODE: ", !state.settings.darkMode);
            state.settings.darkMode = !state.settings.darkMode;
            return { ...state }

        default:
            return state
    }
};

export default combineReducers({
    mainReducer,
    API,
    questionSettings,
    currentQuestion,
});


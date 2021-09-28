//import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCombineReducers } from 'redux-persist';

import API from './API';
import questionSettings from './questionSettings';
import currentQuestion from './currentQuestion';
import settings from './settings';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['settings']
};

const INITIAL_STATE = {
    deviceInfo: {},
    connection: {},
    pauseModalShown: false,
    modals: {
        initialize: true,
        backQuestion: false,
        softUpdate: false,
        hardUpdate: false,
        banned: false,
        checkConnection: false,
        maintenance: false,
        selectKeys: false,
        announcements: false,
    },
    PERFORMANCE: {
        questions: {
            questionEnd_StartPerf: 0,
            questionEnd_EndPerf: 0,
            //questionEnd_perfBetween: 0,
        },
        questionPassPerf: [],
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

        case 'SET_MODAL':
            state.modals = { ...state.modals, ...action.payload };
            console.log("MODAL SET: ", action.payload);
            return { ...state }

        case 'SET_PERF_QUESTION':
            console.log("NEW VALUE FOR PERF: ", action.payload);
            state.PERFORMANCE = { ...state.PERFORMANCE, ...action.payload };
            return { ...state }

        default:
            return state
    }
};

const reducers = {
    mainReducer,
    API,
    questionSettings,
    currentQuestion,
    settings,
}

export default persistCombineReducers(persistConfig, reducers)
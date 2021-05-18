
import { combineReducers } from 'redux';

const INITIAL_STATE = {
    value: 0,
    deviceInfo: {},
    connection: {},
    questionStarted: false,
    pauseModalShown: false,
};

const mainReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ARTTIR':
            let newStateArttir = { ...state };
            newStateArttir.value += 1;
            return newStateArttir;
        case 'AZALT':
            let newStateAzalt = { ...state };
            newStateAzalt.value -= 1;
            return newStateAzalt;
        case 'SET_DEVICE_INFO':
            let deviceInfo = { ...state };
            deviceInfo.deviceInfo = action.payload;
            console.log("action payload ", action.payload);
            return deviceInfo;
        case 'SET_DEVICE_CONNECTION':
            let deviceConnection = { ...state };
            deviceConnection.connection = action.payload;
            console.log("connection ", action.payload);
            return deviceConnection;
        case 'SET_PAUSE_MODAL':
            let modalShown = { ...state };
            modalShown.pauseModalShown = action.payload;
            return modalShown;
        default:
            return state
    }
};

export default combineReducers({
    reducer: mainReducer
});


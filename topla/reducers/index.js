
import { combineReducers } from 'redux';

const INITIAL_STATE = {
    value: 0,
    deviceInfo: {},
    connection: {},
    questionStarted: false,
    pauseModalShown: false,
    activeQuestionSolving: 0, // -> Şuanda çözülen soru
    currentlySolvingQuestion: false, // -> şuanda soru çözülüyor mu 
    questionSettings: {
        questionCount: 5,
    },
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
        case 'SET_ACTIVE_QUESTION_SOLVING':
            let activeQuestionSolving = { ...state };
            activeQuestionSolving.activeQuestionSolving = action.payload;
            console.log("set active question to " + action.payload);
            return activeQuestionSolving;
        case 'GOTO_NEXT_QUESTION':
            let nextQuestion = { ...state };
            nextQuestion.activeQuestionSolving += 1;
            console.log("went to next question: " + nextQuestion.activeQuestionSolving);
            return nextQuestion;
        case 'SET_QUESTION_SOLVING':
            let questionSolving = { ...state };
            questionSolving.currentlySolvingQuestion = action.payload;
            console.log("question solving set: " + action.payload);
            return questionSolving;
        default:
            return state
    }
};

export default combineReducers({
    reducer: mainReducer
});


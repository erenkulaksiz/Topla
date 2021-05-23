
import { combineReducers } from 'redux';

const INITIAL_STATE = {
    deviceInfo: {},
    connection: {},
    pauseModalShown: false,

    /*
    activeQuestionSolving: 0, // -> Şuanda çözülen soru -> activeQuestionSolving - currentQuestion.currentStep
    currentlySolvingQuestion: false, // -> şuanda soru çözülüyor mu  -> currentlySolvingQuestion - currentQuestion.isStarted
    */

    questionSettings: {
        questionCount: 5, // -> Şuanda çözülen sorunun max soru sayısı.
    },
    currentQuestion: {
        currentStep: 0, // -> şuanda çözülen soru
        isStarted: false, // -> soru çözümü başladı mı
        questions: [], // -> şimdi mesela 5 tane soru varsa 5 tane soruyu buraya pushlayacak (doğru seçeneklerle beraber)
        // sonra o sorunun doğru yanlış olup olmadığını da aynı şekilde pushlayacak
    }
};

const mainReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
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
            activeQuestionSolving.currentQuestion.currentStep = action.payload;
            console.log("set active question to " + action.payload);
            return activeQuestionSolving;
        case 'GOTO_NEXT_QUESTION':
            let nextQuestion = { ...state };
            nextQuestion.currentQuestion.currentStep += 1;
            console.log("went to next question: " + nextQuestion.currentQuestion.currentStep);
            return nextQuestion;
        case 'SET_QUESTION_SOLVING':
            let questionSolving = { ...state };
            questionSolving.currentQuestion.isStarted = action.payload;
            console.log("question solving set: " + action.payload);
            return questionSolving;
        default:
            return state
    }
};

export default combineReducers({
    reducer: mainReducer
});


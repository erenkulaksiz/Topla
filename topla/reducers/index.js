
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
        optionCount: 3, // -> Seçenek sayısı
    },
    currentQuestion: {
        currentStep: 0, // -> şuanda çözülen soru
        isStarted: false, // -> soru çözümü başladı mı
        isQuestionsLoaded: false, // -> tüm sorular yüklendi mi
        questions: [], // -> şimdi mesela 5 tane soru varsa 5 tane soruyu buraya pushlayacak (doğru seçeneklerle beraber)
        // sonra o sorunun doğru yanlış olup olmadığını da aynı şekilde pushlayacak
    }
};

const mainReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_DEVICE_INFO':
            let aState = { ...state };
            aState.deviceInfo = action.payload;
            console.log("set device info ", action.payload);
            return aState;
        case 'SET_DEVICE_CONNECTION':
            let bState = { ...state };
            bState.connection = action.payload;
            console.log("connection ", action.payload);
            return bState;
        case 'SET_PAUSE_MODAL':
            let cState = { ...state };
            cState.pauseModalShown = action.payload;
            return cState;
        case 'SET_ACTIVE_QUESTION_SOLVING':
            let dState = { ...state };
            dState.currentQuestion.currentStep = action.payload;
            console.log("set active question to " + action.payload);
            return dState;
        case 'GOTO_NEXT_QUESTION':
            let eState = { ...state };
            eState.currentQuestion.currentStep += 1;
            console.log("went to next question: " + state.currentQuestion.currentStep);
            return eState;
        case 'SET_QUESTION_SOLVING':
            let fState = { ...state };
            fState.currentQuestion.isStarted = action.payload;
            console.log("question solving set: " + action.payload);
            return fState;
        case 'SET_ALL_QUESTIONS':
            let gState = { ...state };
            gState.currentQuestion.questions = action.payload;
            return gState;
        case 'SET_QUESTIONS_LOADED':
            let hState = { ...state };
            hState.currentQuestion.isQuestionsLoaded = action.payload;
            console.log("questions loaded: " + action.payload)
            return hState;
        default:
            return state
    }
};

export default combineReducers({
    reducer: mainReducer
});


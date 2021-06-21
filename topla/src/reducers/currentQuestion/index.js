
const INITIAL_STATE = {
    currentStep: 0, // -> şuanda çözülen soru
    isStarted: false, // -> soru çözümü başladı mı
    isQuestionsLoaded: false, // -> tüm sorular yüklendi mi
    questions: [], // -> şimdi mesela 5 tane soru varsa 5 tane soruyu buraya pushlayacak (doğru seçeneklerle beraber)
    questionResults: [], // örn: 1. soru doğru, 2. soru yanlış, ne zaman doğru ne zaman yanlış vs.
    stats: {
        finalTime: 0,
        totalCorrect: 0,
        totalEmpty: 0,
        totalWrong: 0,
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_ACTIVE_QUESTION_SOLVING':
            console.log("set active question to " + action.payload);
            state.currentStep = action.payload;
            return { ...state }

        case 'GOTO_NEXT_QUESTION':
            console.log("went to next question: " + (state.currentStep + 1));
            state.currentStep += 1;
            return { ...state }

        case 'SET_QUESTION_SOLVING':
            console.log("question solving set: " + action.payload);
            state.isStarted = action.payload;
            return { ...state }

        case 'SET_ALL_QUESTIONS':
            console.log("SET ALL QUESTIONS");
            state.questions = action.payload;
            return { ...state }

        case 'SET_QUESTIONS_LOADED':
            console.log("questions loaded: " + action.payload)
            state.isQuestionsLoaded = action.payload;
            return { ...state }

        case 'PUSH_TO_QUESTION_RESULT':
            console.log("question result: ", action.payload)
            state.questionResults = [...state.questionResults, action.payload];
            return { ...state }

        case 'RESET_QUESTION_RESULTS':
            console.log("question results reset")
            //console.log("[!!!] QUESTION END PERFORMANCE: ", (state.PERFORMANCE.questionEnd_EndPerf - state.PERFORMANCE.questionEnd_StartPerf))
            state.questionResults = [];
            return { ...state }

        case 'SET_STATS':
            console.log("NEW VALUE FOR STATS: ", action.payload);
            state.stats = { ...action.payload };
            return { ...state }

        case 'SET_ACTIVE_QUESTION_SOLVING':
            console.log("set active question to " + action.payload);
            state.currentStep = action.payload;
            return { ...state }

        case 'GOTO_NEXT_QUESTION':
            console.log("went to next question: " + (state.currentStep + 1));
            state.currentStep += 1;
            return { ...state }

        case 'SET_QUESTION_SOLVING':
            console.log("question solving set: " + action.payload);
            state.isStarted = action.payload;
            return { ...state }

        case 'SET_ALL_QUESTIONS':
            console.log("SET ALL QUESTIONS");
            state.questions = action.payload;
            return { ...state }

        case 'SET_QUESTIONS_LOADED':
            console.log("questions loaded: " + action.payload)
            state.isQuestionsLoaded = action.payload;
            return { ...state }

        case 'PUSH_TO_QUESTION_RESULT':
            console.log("question result: ", action.payload)
            state.questionResults = [...state.questionResults, action.payload];
            return { ...state }

        case 'SET_STATS':
            console.log("NEW VALUE FOR STATS: ", action.payload);
            state.stats = action.payload;
            return { ...state }

        default:
            return state
    }
};
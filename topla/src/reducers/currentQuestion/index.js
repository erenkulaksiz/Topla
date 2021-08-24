const INITIAL_STATE = {
    currentStep: 0,
    isStarted: false,
    isQuestionsLoaded: false,
    questions: [],
    questionResults: [],
    stats: {
        finalTime: 0,
        totalCorrect: 0,
        totalEmpty: 0,
        totalWrong: 0,
    },
    versusStats: {
        p1: {
            finished: false,
            currentStep: 0,
            questionResults: [],
            finalTime: 0,
            totalCorrect: 0,
            totalEmpty: 0,
            totalWrong: 0,
        },
        p2: {
            finished: false,
            currentStep: 0,
            questionResults: [],
            finalTime: 0,
            totalCorrect: 0,
            totalEmpty: 0,
            totalWrong: 0,
        },
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
            state.stats = {
                finalTime: 0,
                totalCorrect: 0,
                totalEmpty: 0,
                totalWrong: 0,
            }
            state.versusStats.p2 = {
                finished: false,
                currentStep: 0,
                questionResults: [],
                finalTime: 0,
                totalCorrect: 0,
                totalEmpty: 0,
                totalWrong: 0,
            }
            state.versusStats.p1 = {
                finished: false,
                currentStep: 0,
                questionResults: [],
                finalTime: 0,
                totalCorrect: 0,
                totalEmpty: 0,
                totalWrong: 0,
            }
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

        case 'GOTO_NEXT_QUESTION_PLAYER1':

            console.log("went to next question, player1: " + (state.versusStats.p1.currentStep + 1));
            state.versusStats.p1.currentStep += 1;
            return { ...state }

        case 'GOTO_NEXT_QUESTION_PLAYER2':

            console.log("went to next question, player2: " + (state.versusStats.p2.currentStep + 1));
            state.versusStats.p2.currentStep += 1;
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
        /*
                case 'RESET_VERSUS_STATS':
                    console.log("VERSUS STATS: ", state.versusStats);
                    state.versusStats = {
                        p1: {
                            finished: false,
                            currentStep: 0,
                            questionResults: [],
                            finalTime: 0,
                            totalCorrect: 0,
                            totalEmpty: 0,
                            totalWrong: 0,
                        },
                        p2: {
                            finished: false,
                            currentStep: 0,
                            questionResults: [],
                            finalTime: 0,
                            totalCorrect: 0,
                            totalEmpty: 0,
                            totalWrong: 0,
                        },
                    }
                    return state
        */
        case 'PUSH_TO_PLAYER1_STAT':
            console.log("VERSUS PLAYER1 STAT: ", action.payload);
            state.versusStats.p1.questionResults = [...state.versusStats.p1.questionResults, action.payload];
            return { ...state }

        case 'PUSH_TO_PLAYER2_STAT':
            console.log("VERSUS PLAYER2 STAT: ", action.payload);
            state.versusStats.p2.questionResults = [...state.versusStats.p2.questionResults, action.payload];
            return { ...state }

        case 'SET_PLAYER1_FINISHED_SOLVING':
            console.log("FINISHED SOLVING, PLAYER 1: ", action.payload);
            return { ...state, versusStats: { ...state.versusStats, p1: { ...state.versusStats.p1, finished: action.payload } } }

        case 'SET_PLAYER2_FINISHED_SOLVING':
            console.log("FINISHED SOLVING, PLAYER 2: ", action.payload);
            return { ...state, versusStats: { ...state.versusStats, p2: { ...state.versusStats.p1, finished: action.payload } } }

        default:
            return state
    }
};
const INITIAL_STATE = {
    currentStep: 0,
    isStarted: false,
    isQuestionsLoaded: false,
    questions: [],
    questionResults: [],
    dragDropInput: [],
    dragDropCurrentResult: 0,
    dragDropNextQuestion: false, // Controls alt button on question screen
    stats: {
        finalTime: 0,
        totalCorrect: 0,
        totalEmpty: 0,
        totalWrong: 0,
    },
    versusStats: {
        gameFinished: false,
        gameStarted: false,
        winner: 0,
        p1: {
            finished: false,
            currentStep: 0,
            questionResults: [],
            finalTime: 0,
            totalCorrect: 0,
            totalEmpty: 0,
            totalWrong: 0,
            ready: false,
        },
        p2: {
            finished: false,
            currentStep: 0,
            questionResults: [],
            finalTime: 0,
            totalCorrect: 0,
            totalEmpty: 0,
            totalWrong: 0,
            ready: false,
        },
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_ACTIVE_QUESTION_SOLVING':
            console.log("set active question to " + action.payload);
            state.currentStep = action.payload;
            return { ...state }

        case 'SET_PLAYER1_READY':
            state.versusStats.p1.ready = action.payload;
            return { ...state }

        case 'SET_PLAYER2_READY':
            state.versusStats.p2.ready = action.payload;
            return { ...state }

        case 'SET_GAME_STARTED':
            state.versusStats.gameStarted = action.payload;
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
            };
            state.versusStats.winner = 0;
            state.versusStats.p2 = {
                finished: false,
                currentStep: 0,
                questionResults: [],
                finalTime: 0,
                totalCorrect: 0,
                totalEmpty: 0,
                totalWrong: 0,
            };
            state.versusStats.p1 = {
                finished: false,
                currentStep: 0,
                questionResults: [],
                finalTime: 0,
                totalCorrect: 0,
                totalEmpty: 0,
                totalWrong: 0,
            };
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

        case 'SET_VERSUS_GAME_FINISHED':
            console.log("NEW VALUE FOR GAME FINISHED: ", action.payload);
            state.versusStats.gameFinished = action.payload;
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
            return { ...state, versusStats: { ...state.versusStats, p2: { ...state.versusStats.p2, finished: action.payload } } }

        case 'SET_VERSUS_PLAYER_STATS':
            console.log("VERSUS PLAYERS STAT SET: ", action.payload);
            state.versusStats = {
                ...state.versusStats,
                winner: action.payload.results.winner,
                p1: {
                    ...state.versusStats.p1,
                    finalTime: action.payload.results.p1.finalTime,
                    totalCorrect: action.payload.results.p1.totalCorrect,
                    totalEmpty: action.payload.results.p1.totalEmpty,
                    totalWrong: action.payload.results.p1.totalWrong,
                },
                p2: {
                    ...state.versusStats.p2,
                    finalTime: action.payload.results.p2.finalTime,
                    totalCorrect: action.payload.results.p2.totalCorrect,
                    totalEmpty: action.payload.results.p2.totalEmpty,
                    totalWrong: action.payload.results.p2.totalWrong,
                },
            }
            return { ...state }

        case 'PUSH_TO_DRAG_DROP_INPUT':
            console.log("DRAG DROP PUSHED: ", action.payload);
            state.dragDropInput = [...state.dragDropInput, action.payload];
            return { ...state }

        case 'REMOVE_FROM_DRAG_DROP_INPUT':
            console.log("DRAG DROP REMOVE: ", action.payload);
            state.dragDropInput.map((element, index) => {
                if (element.draggedTo == action.payload) {
                    state.dragDropInput.splice(index, 1);
                }
            })
            return { ...state }

        case 'RESET_DRAG_DROP_INPUT':
            console.log("DRAG DROP INPUT RESET");
            state.dragDropInput = [];
            return { ...state }

        case 'SET_DRAG_DROP_CURRENT_RESULT':
            console.log("DRAG DROP CURRENT RESULT: ", action.payload);
            state.dragDropCurrentResult = action.payload;
            return { ...state }

        case 'SET_DRAG_DROP_NEXT_BUTTON':
            console.log("Set dragdrop next button: ", action.payload);
            state.dragDropNextQuestion = action.payload;
            return { ...state }

        default:
            return state
    }
};
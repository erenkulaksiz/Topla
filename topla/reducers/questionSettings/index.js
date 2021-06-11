
const INITIAL_STATE = {
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
    maxRange: 20,
    rangeIncremental: 10,
};

const config = {
    maxSoru: 15,
    minSoru: 2,
    maxSecenek: 7,
    minSecenek: 2,
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'INCREMENT_QUESTION_OPTIONS':

            let incremental_questionOptions = 0;
            if (state.optionCount >= config.maxSecenek) {
                incremental_questionOptions = 0;
            } else {
                incremental_questionOptions = 1;
            }

            state.optionCount += incremental_questionOptions;
            return { ...state }

        case 'DECREMENT_QUESTION_OPTIONS':

            let decremental_questionOptions = 0;
            if (state.optionCount <= config.minSecenek) {
                decremental_questionOptions = 0;
            } else {
                decremental_questionOptions = 1;
            }

            state.optionCount -= decremental_questionOptions
            return { ...state }

        case 'SET_OPTION_COUNT':
            state.optionCount = action.payload;
            return { ...state }

        case 'INCREMENT_QUESTION_COUNT':

            let incremental_questionCount = 0;
            if (state.questionCount >= config.maxSoru) {
                incremental_questionCount = 0;
            } else {
                incremental_questionCount = 1;
            }

            state.questionCount += incremental_questionCount;
            return { ...state }

        case 'DECREMENT_QUESTION_COUNT':

            let decremental_questionCount = 0;
            if (state.questionCount <= config.minSoru) {
                decremental_questionCount = 0;
            } else {
                decremental_questionCount = 1;
            }

            state.questionCount -= decremental_questionCount;
            return { ...state }

        case 'SET_QUESTION_COUNT':
            state.questionCount = action.payload;
            return { ...state }

        case 'SET_QUESTION_SETTINGS_OPERATIONS':
            console.log("NEW VALUE FOR SETTINGS: ", action.payload);
            state.operations = action.payload;
            return { ...state }

        case 'SET_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", action.payload);
            state.maxRange = action.payload;
            return { ...state }

        case 'INCREMENT_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", state.maxRange + action.payload);
            state.maxRange = parseInt(state.maxRange) + action.payload;
            return { ...state }

        case 'DECREMENT_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", state.maxRange - action.payload);
            state.maxRange = parseInt(state.maxRange) - action.payload;
            return { ...state }

        case 'SET_RANGE_INCREMENTAL':
            console.log("NEW VALUE FOR INCREMENTAL: ", action.payload);
            state.rangeIncremental = action.payload;
            return { ...state }

        default:
            return state
    }
};
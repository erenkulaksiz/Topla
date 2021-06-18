import I18n from "../../src/utils/i18n.js";

const INITIAL_STATE = {
    questionInitials: [
        {
            id: 1,
            name: I18n.t("question_veryeasy"),
            nameId: "ckolay",
            content: `+ ${I18n.t("question_add")}`,
            titleColor: "#6ccf11",
            digit: 1,
            maxRange: 10,
            operations: ["addition"],
            questionCount: 5,
            optionCount: 3,
        },
        {
            id: 2,
            name: I18n.t("question_easy"),
            nameId: "kolay",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")}`,
            titleColor: "#6ccf11",
            digit: 1,
            maxRange: 50,
            operations: ["addition", "subtraction"],
            questionCount: 7,
            optionCount: 3,
        },
        {
            id: 3,
            name: I18n.t("question_medium"),
            nameId: "orta",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")} x ${I18n.t("question_mul")}`,
            titleColor: "#dfe310",
            digit: 2,
            maxRange: 100,
            operations: ["addition", "subtraction", "multiplication"],
            questionCount: 10,
            optionCount: 4,
        },
        {
            id: 4,
            name: I18n.t("question_hard"),
            nameId: "zor",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")} x ${I18n.t("question_mul")} / ${I18n.t("question_div")}`,
            titleColor: "#E21717",
            digit: 3,
            maxRange: 500,
            operations: ["addition", "subtraction", "multiplication", "division"],
            questionCount: 12,
            optionCount: 5,
        },
        {
            id: 5,
            name: I18n.t("question_veryhard"),
            nameId: "zor",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")} x ${I18n.t("question_mul")} / ${I18n.t("question_div")}`,
            titleColor: "#E21717",
            digit: 4,
            maxRange: 1000,
            operations: ["addition", "subtraction", "multiplication", "division"],
            questionCount: 15,
            optionCount: 6,
        },
        /*
        {
            id: 6,
            name: "Custom",
            nameId: "custom",
            content: `${I18n.t("question_custom")}`,
            titleColor: "#000",
            digit: 1,
            maxRange: 100,
            operations: ["addition"],
            questionCount: 5,
            optionCount: 4,
        }
        */
    ],
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
    rangeDecremental: 10,
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
            if (Number.isInteger(action.payload)) {
                if (action.payload > 0) {
                    state.maxRange = action.payload;
                } else {
                    state.maxRange = 1;
                }
            }
            return { ...state }

        case 'INCREMENT_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", state.maxRange + action.payload);
            state.maxRange = parseInt(state.maxRange) + action.payload;
            return { ...state }

        case 'DECREMENT_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", state.maxRange - action.payload);
            if (!(state.maxRange <= 5)) {
                state.maxRange = parseInt(state.maxRange) - action.payload;
            }
            return { ...state }

        case 'SET_RANGE_INCREMENTAL':
            console.log("NEW VALUE FOR INCREMENTAL: ", action.payload);
            state.rangeIncremental = action.payload;
            return { ...state }

        case 'SET_RANGE_DECREMENTAL':
            console.log("NEW VALUE FOR DECREMENTAL: ", action.payload);
            state.rangeDecremental = action.payload;
            return { ...state }

        default:
            return state
    }
};
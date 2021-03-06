import I18n from "../../utils/i18n.js";

const INITIAL_STATE = {
    questionInitials: [
        {
            id: 1,
            name: I18n.t("question_veryeasy"),
            nameId: "ckolay",
            content: `+ ${I18n.t("question_add")}`,
            titleColor: "#6ccf11",
            digit: 1,
            questionDigitLength: 2, // x+y
            maxRange: 10,
            operations: ["addition"],
            questionCount: 5,
            optionCount: 3,
            questionTime: 5000,
        },
        {
            id: 2,
            name: I18n.t("question_easy"),
            nameId: "kolay",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")}`,
            titleColor: "#6ccf11",
            digit: 1,
            questionDigitLength: 3, // x+y
            maxRange: 20,
            operations: ["addition", "subtraction"],
            questionCount: 7,
            optionCount: 3,
            questionTime: 4000,
        },
        {
            id: 3,
            name: I18n.t("question_medium"),
            nameId: "orta",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")} x ${I18n.t("question_mul")}`,
            titleColor: "#dfe310",
            digit: 2,
            questionDigitLength: 3, // x+y z
            maxRange: 50,
            operations: ["addition", "subtraction", "multiplication"],
            questionCount: 10,
            optionCount: 4,
            questionTime: 8000,
        },
        {
            id: 4,
            name: I18n.t("question_hard"),
            nameId: "zor",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")} x ${I18n.t("question_mul")} / ${I18n.t("question_div")}`,
            titleColor: "#E21717",
            digit: 3,
            questionDigitLength: 3, // x+y z
            maxRange: 200,
            operations: ["addition", "subtraction", "multiplication", "division"],
            questionCount: 12,
            optionCount: 5,
            questionTime: 10000,
            requiresPremium: true,
        },
        {
            id: 5,
            name: I18n.t("question_veryhard"),
            nameId: "cokzor",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")} x ${I18n.t("question_mul")} / ${I18n.t("question_div")}`,
            titleColor: "#E21717",
            digit: 4,
            questionDigitLength: 3, // x+y
            maxRange: 500,
            operations: ["addition", "subtraction", "multiplication", "division"],
            questionCount: 15,
            optionCount: 6,
            questionTime: 10000,
            requiresPremium: true,
        },
        {
            id: 6,
            name: "versus",
            nameId: "versus",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")}`,
            titleColor: "#6ccf11",
            digit: 2,
            questionDigitLength: 2, // x+y
            maxRange: 20,
            operations: ["addition", "subtraction"],
            questionCount: 7,
            optionCount: 3,
            questionTime: 4000,
            isVersusMode: true,
        },
        {
            id: 7,
            name: "childplay",
            nameId: "childplay",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")}`,
            titleColor: "#6ccf11",
            digit: 2,
            maxRange: 20,
            operations: ["addition", "subtraction"],
            questionCount: 7,
            optionCount: 3,
            questionTime: 2000,
            isChildPlay: true,
        },
        {
            id: 8,
            name: "dragdrop",
            nameId: "dragdrop",
            content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")} x ${I18n.t("question_mul")}`,
            titleColor: "#6ccf11",
            digit: 1,
            questionDigitLength: 3, // x+y
            maxRange: 8,
            operations: ["addition", "subtraction", "multiplication"],
            questionCount: 7,
            optionCount: 4,
            questionTime: 12000,
            isDragDrop: true,
        },
    ],
    questionCount: 5,
    optionCount: 4,
    digitLength: 2,
    allowNegative: false,
    allowFloat: false,
    displayResultDragDrop: false, // For Drag&Drop Gamemode
    selectedDragDropMode: "dragdrop", // For Drag&Drop Gamemode
    perQuestionTime: 5000,
    timerEnabled: true,
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
    maxSecenek: 6,
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
            console.log("STATE.OPTION COUNT: ", state.optionCount);
            return { ...state }

        case 'DECREMENT_QUESTION_OPTIONS':

            let decremental_questionOptions = 0;
            if (state.optionCount <= config.minSecenek) {
                decremental_questionOptions = 0;
            } else {
                decremental_questionOptions = 1;
            }

            state.optionCount -= decremental_questionOptions;
            console.log("STATE.OPTION COUNT: ", state.optionCount);
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
            if (action.payload > 0) {
                state.maxRange = action.payload;
            } else {
                state.maxRange = parseInt(state.maxRange) + action.payload;
            }
            return { ...state }

        case 'INCREMENT_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", state.maxRange + action.payload);
            state.maxRange = parseInt(state.maxRange) + action.payload;
            return { ...state }

        case 'DECREMENT_MAX_RANGE':
            console.log("NEW VALUE FOR MAX RANGE: ", state.maxRange - action.payload);
            if (!(state.maxRange <= 10)) {
                state.maxRange = parseInt(state.maxRange) - action.payload;
            }
            return { ...state }

        case 'SET_QUESTION_TIME':
            state.perQuestionTime = action.payload
            return { ...state }

        case 'INCREMENT_QUESTION_TIME':
            if (!(parseInt(state.perQuestionTime + 1000) > 15000)) {
                state.perQuestionTime = parseInt(state.perQuestionTime) + 1000;
            }
            return { ...state }

        case 'DECREMENT_QUESTION_TIME':
            if (!(parseInt(state.perQuestionTime - 1000) < 1000)) {
                state.perQuestionTime = parseInt(state.perQuestionTime) - 1000;
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

        case 'SET_RESULT_DRAG_DROP':
            console.log("NEW VALUE FOR displayResultDragDrop: ", action.payload);
            state.displayResultDragDrop = action.payload;
            return { ...state }

        case 'SET_DRAG_DROP_MODE':
            console.log("NEW VALUE FOR selectedDragDropMode: ", action.payload);
            state.selectedDragDropMode = action.payload;
            return { ...state }

        case 'SET_TIMER_ENABLED':
            console.log("NEW VALUE FOR timerEnabled: ", action.payload);
            state.timerEnabled = action.payload;
            return { ...state }

        case 'SET_FLOAT':
            console.log("NEW VALUE FOR allowFloat: ", action.payload);
            state.allowFloat = action.payload;
            return { ...state }

        case 'SET_NEGATIVE':
            console.log("NEW VALUE FOR allowNegative: ", action.payload);
            state.allowNegative = action.payload;
            return { ...state }

        case 'SET_DIGIT_LENGTH':
            console.log("NEW VALUE FOR digitLength: ", action.payload);
            if (state.digitLength + action.payload >= 2 && state.digitLength + action.payload <= 4) {
                state.digitLength += action.payload;
            }

            return { ...state }

        default:
            return state
    }
};
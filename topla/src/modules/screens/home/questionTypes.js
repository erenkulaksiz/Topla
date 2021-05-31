import I18n from "../../../utils/i18n.js";

const questionTypes = [
    {
        id: 1,
        name: I18n.t("question_veryeasy"),
        nameId: "ckolay",
        content: `+ ${I18n.t("question_add")}`,
        titleColor: "#6ccf11",
        digit: 1,
        maxRange: 10,
        operations: ["addition"]
    },
    {
        id: 2,
        name: I18n.t("question_easy"),
        nameId: "kolay",
        content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")}`,
        titleColor: "#6ccf11",
        digit: 1,
        maxRange: 10,
        operations: ["addition", "subtraction"]
    },
    {
        id: 3,
        name: I18n.t("question_medium"),
        nameId: "orta",
        content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")} x ${I18n.t("question_mul")}`,
        titleColor: "#dfe310",
        digit: 2,
        maxRange: 100,
        operations: ["addition", "subtraction", "multiplication"]
    },
    {
        id: 4,
        name: I18n.t("question_hard"),
        nameId: "zor",
        content: `+ ${I18n.t("question_add")} - ${I18n.t("question_sub")} x ${I18n.t("question_mul")} / ${I18n.t("question_div")}`,
        titleColor: "#E21717",
        digit: 3,
        maxRange: 1000,
        operations: ["addition", "subtraction", "multiplication", "division"]
    },
    {
        id: 5,
        name: "Custom",
        nameId: "custom",
        content: `${I18n.t("question_custom")}`,
        titleColor: "#000",
        digit: 1,
        maxRange: 100,
        operations: ["addition"]
    }
]

export default questionTypes;
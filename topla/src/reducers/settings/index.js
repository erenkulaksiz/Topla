
const INITIAL_STATE = {
    darkMode: "light",
    lastSelectedByHand: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'DARK_MODE':
            console.log("SET DARK MODE: ", action.payload);
            //state.darkMode = action.payload;
            return { ...state, darkMode: action.payload }

        case 'LAST_DARKMODE_SELECTED_BYHAND':
            console.log("SET HAND DARKMODE MODE: ", action.payload);
            //state.lastSelectedByHand = action.payload;
            return { ...state, lastSelectedByHand: action.payload }

        default:
            return state
    }
};
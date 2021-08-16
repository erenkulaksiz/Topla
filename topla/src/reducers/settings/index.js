
const INITIAL_STATE = {
    darkMode: "light",
    lastSelectedByHand: false,
    cooldown: {
        refreshStatus: 5, // remaining refreshes
        lastRefreshed: 0, // timestamp of last refresh
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'DARK_MODE':
            console.log("SET DARK MODE: ", action.payload);
            return { ...state, darkMode: action.payload }

        case 'LAST_DARKMODE_SELECTED_BYHAND':
            console.log("SET HAND DARKMODE MODE: ", action.payload);
            return { ...state, lastSelectedByHand: action.payload }

        case 'USE_REFRESH_STATUS':
            console.log("Used one refresh status. Remaining: ", state.cooldown.refreshStatus - 1);
            return {
                ...state, cooldown: {
                    ...state.cooldown,
                    refreshStatus: state.cooldown.refreshStatus - 1,
                    lastRefreshed: action.payload,
                }
            }

        case 'RESET_REFRESH_STATUS':
            return {
                ...state, cooldown: {
                    ...state.cooldown,
                    refreshStatus: 5,
                    //lastRefreshed: 0,
                }
            }

        default:
            return state
    }
};
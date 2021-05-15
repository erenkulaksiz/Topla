
import { combineReducers } from 'redux';

const INITIAL_STATE = {
    value: 0,
};

const mainReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ARTTIR':
            let newStateArttir = { ...state };
            newStateArttir.value += 1;
            return newStateArttir;
        case 'AZALT':
            let newStateAzalt = { ...state };
            newStateAzalt.value -= 1;
            return newStateAzalt;
        default:
            return state
    }
};

export default combineReducers({
    reducer: mainReducer
});


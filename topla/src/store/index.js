import { createStore } from 'redux';
import reducer from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

const composeEnhancers = composeWithDevTools({});

const store = createStore(reducer, composeEnhancers());

export default store;
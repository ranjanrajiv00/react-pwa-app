import { combineReducers } from 'redux';
import toDo from './toDoReducer';

// Combines all reducers to a single reducer function
const rootReducer = combineReducers({
    toDo: toDo
});

export default rootReducer;
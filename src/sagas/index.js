import { all } from 'redux-saga/effects';
import toDoSaga from './toDoSaga';

export default function* rootSaga() {
   yield all([
    toDoSaga(),
   ]);
}
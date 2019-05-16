import { takeLatest, call, put } from 'redux-saga/effects';
import * as types from '../constants/actionTypes';
import API from '../utils/fetch';

function* getToDoSage() {
    try {
        const toDoList = yield call(API.fetch, 'todo', types.GET_ITEMS, {
            method: 'GET'
        });
        if (toDoList.message !== 'OFFLINE')
            yield put({ type: types.GET_ITEMS_SUCCESS, items: toDoList });
    } catch (error) {

    }
}

function* addToDoSage(payload) {
    try {
        const response = yield call(API.fetch, 'todo', types.ADD_ITEM,
            {
                method: 'POST',
                data: payload.item
            });
        yield put({ type: types.ADD_ITEM_SUCCESS, item: response });
    } catch (error) {

    }
}

function* updateToDoSage(payload) {
    try {
        const response = yield call(API.fetch, `todo/${payload.item.id}`, types.UPDATE_ITEM,
            {
                method: 'PUT',
                data: payload.item
            });
        yield put({ type: types.UPDATE_ITEM_SUCCESS, item: response });
    } catch (error) {

    }
}

// Watches for SEARCH_MEDIA_REQUEST action type asynchronously
export default function* watchToDo() {
    yield takeLatest(types.GET_ITEMS, getToDoSage);
    yield takeLatest(types.ADD_ITEM, addToDoSage);
    yield takeLatest(types.UPDATE_ITEM, updateToDoSage);
}
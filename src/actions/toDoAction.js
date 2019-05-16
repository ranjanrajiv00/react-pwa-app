import * as types from '../constants/actionTypes';

export const getItems = (data) => ({
    type: types.GET_ITEMS,
    items: data,
})

export const addItem = (item) => ({
    type: types.ADD_ITEM,
    item: item
})

export const updateItem = (item) => ({
    type: types.UPDATE_ITEM,
    item: item
})
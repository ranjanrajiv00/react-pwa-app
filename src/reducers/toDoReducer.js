import * as types from '../constants/actionTypes';

const reducer = (state = { online: true }, action) => {
    switch (action.type) {
        case types.GET_ITEMS:
            return {
                ...state,
                loading: true
            }
        case types.GET_ITEMS_SUCCESS:
            return {
                ...state,
                items: action.items,
                loading: false
            }
        case types.ADD_ITEM:
            return {
                ...state,
                loading: true
            }
        case types.ADD_ITEM_SUCCESS:
            return {
                ...state,
                items: [
                    ...state.items.splice(0, 0, action.item),
                    ...state.items
                ],
                loading: false
            }
        case types.UPDATE_ITEM:
            return {
                ...state,
                loading: true
            }
        case types.UPDATE_ITEM_SUCCESS:
            return {
                ...state,
                items: [
                    ...state.items.map((item) => {
                        if (item.id === action.item.id) {
                            return { ...action.item }
                        }
                        return item;
                    })
                ],
                loading: false
            }
        case types.YOU_ARE_ONLINE:
            return {
                ...state,
                online: true
            }
        case types.YOU_ARE_OFFLINE:
            return {
                ...state,
                online: false
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer;
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import indexedDB from '../utils/indexedDb';

const reduxStoreEnhancer = () => (createStore) => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState);
    const dispatch = async (action) => {
        if (action.type === "YOU_ARE_ONLINE") {
            indexedDB.getAll().then((pendingActions) => {
                pendingActions.forEach(task => {
                    store.dispatch({ type: task.data.action, item: task.data.data });
                });

                indexedDB.clear();
            });
            return store.dispatch({ type: 'YOU_ARE_ONLINE' });
        }
        else {
            return store.dispatch(action);
        }
    }

    store.subscribe(() => {
        localStorage.setItem('store', JSON.stringify(store.getState()));
    })

    return {
        ...store,
        dispatch
    }
}

const persistedStore = JSON.parse(localStorage.getItem('store')) || {}

const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    return {
        ...createStore(rootReducer,
            {
                ...persistedStore
            },
            composeWithDevTools(
                reduxStoreEnhancer(),
                applyMiddleware(sagaMiddleware),
            )),
        runSaga: sagaMiddleware.run(rootSaga)
    };
};

export default configureStore;
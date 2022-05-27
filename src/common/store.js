import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

const middlewares = [thunk];

/* istanbul ignore if  */
if (__DEV__) {
  const {createLogger} = require('redux-logger');

  const logger = createLogger({collapsed: true});
  middlewares.push(logger);
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  undefined,
  compose(applyMiddleware(...middlewares)),
);

export const persistor = persistStore(store);

export default store;

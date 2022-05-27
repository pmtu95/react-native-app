import {combineReducers} from 'redux';
import homeReducer from '../scenes/home/redux/reducer';
import authReducer from '../scenes/auth/redux/reducer';
import shopReducer from '../scenes/shop/redux/reducer';
import checkInReducer from '../scenes/check-in/redux/reducer';
import checkListReducer from '../scenes/check-list/redux/reducer';

// NOTE 1: DO NOT CHANGE the 'reducerMap' name and the declaration pattern.
// NOTE 2: always use the camel case of the feature folder name as the store branch name

const reducerMap = {
  home: homeReducer,
  auth: authReducer,
  shop: shopReducer,
  checkIn: checkInReducer,
  checkList: checkListReducer,
};

export default combineReducers(reducerMap);

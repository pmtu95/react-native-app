import initialState from './initialState';
import {
  GET_SHOP_REQUEST,
  GET_SHOP_SUCCESS,
  GET_SHOP_FAILURE,
} from './constants';

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_SHOP_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case GET_SHOP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shops: action.payload,
      };
    case GET_SHOP_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage:
          action.payload.error.message || action.payload.error.password[0],
      };
    default:
      return state;
  }
}

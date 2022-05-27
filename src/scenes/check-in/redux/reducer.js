import initialState from './initialState';
import {
  CHECK_IN_REQUEST,
  CHECK_IN_SUCCESS,
  CHECK_IN_FAILURE,
  CHECK_OUT_REQUEST,
  CHECK_OUT_SUCCESS,
  CHECK_OUT_FAILURE,
} from './constants';

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHECK_IN_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case CHECK_IN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isCheckIn: action.payload.isCheckIn,
        checkInData: action.payload.checkInData,
      };
    case CHECK_IN_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload.error.message,
      };
    case CHECK_OUT_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case CHECK_OUT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isCheckIn: false,
        checkInData: null,
      };
    case CHECK_OUT_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload.error.message,
      };
    default:
      return state;
  }
}

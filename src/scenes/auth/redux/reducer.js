import initialState from './initialState';
import {
  UPDATE_AUTHORIZATION,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_DISMISS_ERROR,
  AUTH_DISMISS_MESSAGE,
  AUTH_LOGOUT_FAILURE,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
} from './constants';

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_AUTHORIZATION:
      return {
        ...state,
        authorization: action.payload,
      };
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        loggedIn: false,
      };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        loggedIn: true,
        user_id: action.payload.user_id,
        account: action.payload.account,
      };
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
        errorMessage: action.payload.error.message,
      };
    case AUTH_DISMISS_ERROR:
      return {
        ...state,
        errorMessage: '',
      };
    case AUTH_DISMISS_MESSAGE:
      return {
        ...state,
        message: '',
      };
    case AUTH_LOGOUT_REQUEST:
      return {
        ...state,
        isFetching: true,
        loggedIn: false,
      };
    case AUTH_LOGOUT_SUCCESS:
      return {
        ...initialState,
        account: state.account,
      };
    case AUTH_LOGOUT_FAILURE:
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
        errorMessage:
          action.payload.error.message || action.payload.error.password[0],
      };
    default:
      return state;
  }
}

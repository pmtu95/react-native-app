import _ from 'lodash';
import http from '../../../services/http.service';
import {
  UPDATE_AUTHORIZATION,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_DISMISS_MESSAGE,
  AUTH_DISMISS_ERROR,
  AUTH_LOGOUT_FAILURE,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
} from './constants';

import {CHECK_IN_SUCCESS} from '../../check-in/redux/constants';

export const updateAuthorization = authorization => dispatch => {
  dispatch({type: UPDATE_AUTHORIZATION, payload: authorization});
};

export const login = (username, password) => dispatch => {
  dispatch({
    type: AUTH_LOGIN_REQUEST,
  });
  const request = http.post('login', {
    username,
    password,
  });
  request.then(res => {
    dispatch({
      type: AUTH_LOGIN_SUCCESS,
      payload: {user_id: res.user_id, account: {username, password}},
    });
    dispatch({
      type: CHECK_IN_SUCCESS,
      payload: {
        checkInData: {...res.last_checkin_checkout, ...res.shop},
        isCheckIn: _.isEmpty(res.last_checkin_checkout)
          ? false
          : res.last_checkin_checkout.is_checkin,
      },
    });
  });
  request.catch(err => {
    dispatch({type: AUTH_LOGIN_FAILURE, payload: {error: err}});
  });
};

export const logout = () => dispatch => {
  dispatch({type: AUTH_LOGOUT_REQUEST});
  const request = http.get('logout');
  request.then(() => {
    dispatch({type: AUTH_LOGOUT_SUCCESS});
  });
  request.catch(err => {
    dispatch({type: AUTH_LOGOUT_FAILURE, payload: err});
  });
};

export function dismissMessage() {
  return {
    type: AUTH_DISMISS_MESSAGE,
  };
}

export function dismissError() {
  return {
    type: AUTH_DISMISS_ERROR,
  };
}

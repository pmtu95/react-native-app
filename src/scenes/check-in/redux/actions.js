import moment from 'moment-timezone';
import _ from 'lodash';
import http from '../../../services/http.service';
import {
  CHECK_IN_REQUEST,
  CHECK_IN_SUCCESS,
  CHECK_IN_FAILURE,
  CHECK_OUT_REQUEST,
  CHECK_OUT_SUCCESS,
  CHECK_OUT_FAILURE,
} from './constants';

export const checkIn = data => dispatch => {
  const { photo, note, shopId, user_id, latitude, longitude, shopName } = data;
  dispatch({ type: CHECK_IN_REQUEST });

  const formData = new FormData();
  formData.append('photo', {
    uri: photo.uri,
    type: photo.type,
    name: photo.fileName,
  });
  formData.append('note', note);
  formData.append('time', moment().format('DD/MM/YYYY'));
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);
  formData.append('is_checkin', true);
  formData.append('user_id', user_id);
  formData.append('shop_id', shopId);
  const request = http.post('checkin_checkouts', formData);
  request.then(res => {
    dispatch({
      type: CHECK_IN_SUCCESS,
      payload: {
        checkInData: { ...res.last_checkin_checkout, name: shopName },
        isCheckIn: !_.isEmpty(res.last_checkin_checkout),
      },
    });
  });
  request.catch(err => {
    dispatch({ type: CHECK_IN_FAILURE, payload: { error: err } });
  });
};
export const getServerTime = data => dispatch => {

  const formData = new FormData();
  formData.append('clienttime', moment().format('DD/MM/YYYY'));
  const request = http.get('server_time', formData);
  request.then(res => {
    console.log('response1', res);
  });
  request.catch(err => {
    console.log('responseerror', err);
    return null;

  });
};

export const checkOut = data => dispatch => {
  const { note, photo, shopId, userId, latitude, longitude, incomplete } = data;
  dispatch({ type: CHECK_OUT_REQUEST });

  const formData = new FormData();
  formData.append('photo', {
    uri: photo.uri,
    type: photo.type,
    name: photo.fileName,
  });
  formData.append('note', note);
  formData.append('time', moment().format('DD/MM/YYYY'));
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);
  formData.append('incomplete', incomplete);
  formData.append('is_checkin', false);
  formData.append('user_id', userId);
  formData.append('shop_id', shopId);

  const request = http.post('checkin_checkouts', formData);
  request.then(res => {
    dispatch({ type: CHECK_OUT_SUCCESS });
  });
  request.catch(err => {
    dispatch({ type: CHECK_OUT_FAILURE, payload: { error: err } });
  });
};

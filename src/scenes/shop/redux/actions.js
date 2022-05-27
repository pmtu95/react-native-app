import http from '../../../services/http.service';
import {
  GET_SHOP_REQUEST,
  GET_SHOP_SUCCESS,
  GET_SHOP_FAILURE,
  SHOP_DISMISS_ERROR,
} from './constants';

export const getShops = user_id => dispatch => {
  dispatch({
    type: GET_SHOP_REQUEST,
  });
  const request = http.get(`shops/index_by_user?user_id=${user_id}`);
  request.then(res => {
    dispatch({type: GET_SHOP_SUCCESS, payload: res});
  });
  request.catch(err => {
    dispatch({type: GET_SHOP_FAILURE, payload: {error: err}});
  });
};

export function dismissError() {
  return {
    type: SHOP_DISMISS_ERROR,
  };
}

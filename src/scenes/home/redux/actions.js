import uuid from 'react-native-uuid';
import moment from 'moment-timezone';
import http from '../../../services/http.service';
import {
  CAPTURE_FAILURE,
  CAPTURE_REQUEST,
  CAPTURE_SUCCESS,
  UPDATE_NET_INFO,
  UPDATE_MODE,
  SYNC_DATA_FAILURE,
  SYNC_DATA_REQUEST,
  SYNC_DATA_SUCCESS,
  SYNC_DATA_DONEALL,
  RESET_STATUS_STATE,
} from './constants';
import store from '../../../common/store';

import {
  submitStock,
  resetStatusState as resetClStatusState,
} from '../../check-list/redux/actions';

export const capture = data => dispatch => {
  dispatch({type: CAPTURE_REQUEST});
  try {
    const {mode} = store.getState().home;
    const {note, photos, checkListId} = data;
    if (mode === 'online') {
      const formData = new FormData();
      for (let i = 0; i < photos.length; i++) {
        const element = photos[i];
        const photoName = uuid.v4();
        const photo = {
          uri: element.uri,
          type: 'image/jpeg',
          name: photoName,
        };
        formData.append('photos[]', photo);
      }
      formData.append('note', note);
      formData.append('time', moment().format('DD/MM/YYYY'));
      const request = http.put(`checklists/${checkListId}`, formData);
      request.then(res => {
        dispatch({
          type: CAPTURE_SUCCESS,
          payload: {checkListId: '', photos: []},
        });
      });

      request.catch(error => {
        dispatch({type: CAPTURE_FAILURE, payload: {error}});
      });
    } else {
      dispatch({type: CAPTURE_SUCCESS, payload: {checkListId, photos}});
    }
  } catch (error) {
    dispatch({type: CAPTURE_FAILURE, payload: {error}});
  }
};

export const resetStatusState = () => dispatch => {
  dispatch({type: RESET_STATUS_STATE});
};

export const updateNetInfo = isConnected => dispatch => {
  dispatch({type: UPDATE_NET_INFO, payload: isConnected});
};

export const updateMode = mode => dispatch => {
  dispatch({type: UPDATE_MODE, payload: mode});
};

export const syncData = () => dispatch => {
  dispatch({type: SYNC_DATA_REQUEST});
  try {
    const {cachePictures} = store.getState().home;
    const {checkList, isDone} = store.getState().checkList;
    const unSyncCheckList = checkList.filter(cl => cl.synced === false);
    let queues = unSyncCheckList.concat(cachePictures);
    let total = unSyncCheckList.length + cachePictures.length;
    let count = 0;
    if (queues.length > 0) {
      let main = Promise.resolve();
      main
        .then(() => {
          for (let i = 0, a = Promise.resolve(); i < queues.length; i++) {
            a = a
              .then(() => sleep(2000))
              .then(() => {
                const queue = queues[i];
                if (!queue.checklist_items) {
                  dispatch(capture({note: '', ...queue}));
                } else {
                  for (
                    let j = 0, b = Promise.resolve();
                    j < queue.checklist_items.length;
                    j++
                  ) {
                    b = b
                      .then(() => sleep(1000))
                      .then(() => {
                        const item = queue.checklist_items[j];
                        if (!item.synced) {
                          dispatch(
                            submitStock(false, queue.id, item.id, item.data),
                          );
                        }
                        if (isDone) {
                          dispatch(resetClStatusState());
                        }
                      })
                      .catch(error => {
                        dispatch({type: SYNC_DATA_FAILURE, payload: {error}});
                      });
                  }
                }
              })
              .then(() => sleep(1000))
              .then(() => {
                count++;
                dispatch({
                  type: SYNC_DATA_SUCCESS,
                  payload: ((count * 10) / total).toFixed(1),
                });
              })
              .catch(error => {
                dispatch({type: SYNC_DATA_FAILURE, payload: {error}});
              });
          }
        })
        .then(() => sleep((queues.length + 3) * 1000))
        .then(() => {
          dispatch({type: SYNC_DATA_DONEALL});
        })
        .catch(error => {
          dispatch({type: SYNC_DATA_FAILURE, payload: {error}});
        });
    } else {
      dispatch({type: SYNC_DATA_DONEALL});
    }
  } catch (error) {
    dispatch({type: SYNC_DATA_FAILURE, payload: {error}});
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

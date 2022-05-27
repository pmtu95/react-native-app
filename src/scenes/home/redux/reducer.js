import initialState from './initialState';
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

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CAPTURE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isDone: false,
      };
    case CAPTURE_SUCCESS:
      const {photos, checkListId} = action.payload;
      let existPictures = [];
      if (checkListId !== '') {
        const checkIndex = state.cachePictures.findIndex(
          item => item.checkListId === checkListId,
        );
        if (checkIndex !== -1) {
          existPictures = state.cachePictures.map(item => {
            if (item.checkListId === checkListId) {
              item.photos = [...item.photos, ...photos];
            }
            return item;
          });
        } else {
          existPictures = [...state.cachePictures, action.payload];
        }
      }

      return {
        ...state,
        isFetching: false,
        isDone: true,
        cachePictures: existPictures,
      };
    case CAPTURE_FAILURE:
      return {
        ...state,
        isFetching: false,
        isDone: false,
        errorMessage: action.payload.error.message,
      };
    case UPDATE_NET_INFO:
      return {
        ...state,
        isConnected: action.payload,
      };
    case UPDATE_MODE:
      return {
        ...state,
        mode: action.payload,
      };
    case SYNC_DATA_REQUEST:
      return {
        ...state,
        isSync: true,
      };
    case SYNC_DATA_SUCCESS:
      return {
        ...state,
        isSync: true,
        percent: action.payload,
      };
    case SYNC_DATA_DONEALL:
      return {
        ...state,
        isSync: false,
        isDone: false,
        percent: 0,
        mode: 'online',
      };
    case SYNC_DATA_FAILURE:
      return {
        ...state,
        isSync: false,
        isDone: false,
        errorMessage: action.payload.error.message,
      };
    case RESET_STATUS_STATE:
      return {
        ...state,
        isFetching: false,
        isDone: false,
      };
    default:
      return state;
  }
}

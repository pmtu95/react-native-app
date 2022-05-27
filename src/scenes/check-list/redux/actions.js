import Config from 'react-native-config';
import _ from 'lodash';
import http from '../../../services/http.service';
import {
  GET_CHECK_LIST_REQUEST,
  GET_CHECK_LIST_SUCCESS,
  GET_CHECK_LIST_FAILURE,
  GET_STOCKS_REQUEST,
  GET_STOCKS_SUCCESS,
  GET_STOCKS_FAILURE,
  SAVE_ALL_STOCKS_REQUEST,
  SAVE_ALL_STOCKS_SUCCESS,
  SAVE_ALL_STOCKS_FAILURE,
  SUBMIT_STOCK_REQUEST,
  SUBMIT_STOCK_SUCCESS,
  SUBMIT_STOCK_FAILURE,
  CLEAR_STOCKS,
  RESET_STATUS_STATE,
  SAVE_CATEGORIES_FAILURE,
  SAVE_CATEGORIES_SUCCESS,
} from './constants';
import store from '../../../common/store';

export const getCheckLists = shopId => dispatch => {
  dispatch({ type: GET_CHECK_LIST_REQUEST });
  const { checkList } = store.getState().checkList;
  const { isConnected } = store.getState().home;
  if (isConnected) {
    const request = http.get(`checklists/index_by_user_shop?shop_id=${shopId}`);
    request.then(res => {
      res = res.map(item => {
        item.checklist_items = item.checklist_items.map(clItem => {
          return {
            ...clItem,
            photos:
              clItem.photos && clItem.photos.length > 0
                ? clItem.photos.map(photo => {
                  return {
                    ...photo,
                    uri: Config.API_URL + photo.image,
                  };
                })
                : null,
            custom_attributes: {
              ...clItem.custom_attributes,
              fullscreen_photos:
                clItem.custom_attributes.fullscreen_photo_paths &&
                  clItem.custom_attributes.fullscreen_photo_paths.length > 0
                  ? clItem.custom_attributes.fullscreen_photo_paths.map(
                    photo => Config.API_URL + photo,
                  )
                  : null,
              thumbnail_uri:
                clItem.custom_attributes.thumbnail_photo_paths &&
                  clItem.custom_attributes.thumbnail_photo_paths.length > 0
                  ? Config.API_URL +
                  clItem.custom_attributes.thumbnail_photo_paths[0]
                  : null,
            },
          };
        });
        return item;
      });
      dispatch({
        type: GET_CHECK_LIST_SUCCESS,
        payload: { checkList: res },
      });
    });
    request.catch(err => {
      dispatch({ type: GET_CHECK_LIST_FAILURE, payload: { error: err } });
    });
  } else {
    const data = checkList.map(cl => {
      const filteredChecklistItems = cl.checklist_items.filter(item =>
        _.isEmpty(item.data),
      );
      return {
        ...cl,
        completed:
          filteredChecklistItems && filteredChecklistItems.length > 0
            ? false
            : true,
      };
    });
    dispatch({
      type: GET_CHECK_LIST_SUCCESS,
      payload: { checkList: data },
    });
  }
};

export const saveAllStocks =
  (checkListId, filterValue, filterDone, searchValue) => dispatch => {
    dispatch({ type: SAVE_ALL_STOCKS_REQUEST });
    new Promise(resolve => {
      const { checkList } = store.getState().checkList;
      const currentCL = checkList.filter(cl => cl.id === checkListId)[0];

      if (currentCL) {
        const { checklist_items } = currentCL;
        let filteredData = checklist_items;
        if (filterValue) {
          filteredData = filteredData.filter(
            item => item.custom_attributes.category_vn === filterValue,
          );
        }
        if (filterDone) {
          filteredData = filteredData.filter(item => _.isEmpty(item.data));
        }
        if (searchValue !== '') {
          filteredData = filteredData.filter(item => {
            return (
              item.custom_attributes.stock_name &&
              item.custom_attributes.stock_name
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            );
          });
        }
        let clItems = _.chunk(filteredData, 10);
        resolve(clItems);
      }
    })
      .then(res => {
        dispatch({
          type: SAVE_ALL_STOCKS_SUCCESS,
          payload: { allStocks: res, stocks: res[0] },
        });
      })
      .catch(() => {
        dispatch({
          type: SAVE_ALL_STOCKS_FAILURE,
          payload: { error: { message: 'Tải không thành công' } },
        });
      });
  };

export const getStocks = page => dispatch => {
  dispatch({ type: GET_STOCKS_REQUEST });
  new Promise(resolve => {
    let { allStocks } = store.getState().checkList;

    if (allStocks && allStocks.length > 0 && page < allStocks.length) {
      resolve(allStocks[page]);
    }
  })
    .then(res => {
      dispatch({ type: GET_STOCKS_SUCCESS, payload: res });
    })
    .catch(() => {
      dispatch({
        type: GET_STOCKS_FAILURE,
        payload: { error: { message: 'Tải không thành công' } },
      });
    });
};

export const saveCategories = checkListId => dispatch => {
  const { checkList } = store.getState().checkList;
  const currentCL = checkList.filter(cl => cl.id === checkListId)[0];

  if (currentCL) {
    const { checklist_items } = currentCL;
    let categories = [];
    checklist_items.forEach(function (item) {
      var existing = categories.filter(function (v, i) {
        return v === item.custom_attributes.category_vn;
      });
      if (existing.length <= 0) {
        categories.push(item.custom_attributes.category_vn);
      }
    });

    checklist_items.sort((a, b) => {
      if (a.custom_attributes.category_vn === b.custom_attributes.category_vn) {
        if (
          a.custom_attributes.sub_category === b.custom_attributes.sub_category
        ) {
          return a.custom_attributes.stock_name > b.custom_attributes.stock_name
            ? 1
            : -1;
        }
        return a.custom_attributes.sub_category >
          b.custom_attributes.sub_category
          ? 1
          : -1;
      }
      return a.custom_attributes.category_vn > b.custom_attributes.category_vn
        ? 1
        : -1;
    });

    dispatch({
      type: SAVE_CATEGORIES_SUCCESS,
      payload: { categories },
    });
  } else {
    dispatch({
      type: SAVE_CATEGORIES_FAILURE,
      payload: { error: { message: 'Tải không thành công' } },
    });
  }
};

export const submitStock =
  (isDefault = false, checkListId, stockId, data) =>
    dispatch => {
      dispatch({ type: SUBMIT_STOCK_REQUEST });
      let { photos = [], ...rest } = data;
      const { checkList, stocks } = store.getState().checkList;
      const { isConnected } = store.getState().home;
      const currentCL = checkList.filter(cl => cl.id === checkListId)[0];
      const { template, checklist_items } = currentCL;
      const formData = new FormData();

      if (isDefault) {
        rest = _.mapValues(template, o => {
          if (o.default && rest[o.default.field]) {
            return rest[o.default.field].toString();
          }
          if (o.default && rest[o.default.value]) {
            return rest[o.default.value].toString();
          }
          return '';
        });
      }

      const newStocks = stocks.map(stock => {
        if (stock.id === stockId) {
          stock = {
            ...stock,
            synced: isConnected,
            data,
          };
        }
        return stock;
      });

      const mergedStocks = _.unionBy(newStocks, checklist_items, 'id');

      const filterCompleted = mergedStocks.filter(item => {
        return _.isEmpty(item.data);
      });

      const newCheckList = checkList.map(cl => {
        if (cl.id === checkListId) {
          cl = {
            ...cl,
            checklist_items: mergedStocks,
            completed: filterCompleted.length > 0 ? false : true,
            synced: isConnected,
          };
        }
        return cl;
      });

      if (isConnected) {
        for (let i = 0; i < photos.length; i++) {
          const element = photos[i];
          const photo = {
            uri: element.uri,
            type: element.type,
            name: element.fileName,
          };
          formData.append('photos[]', photo);
        }
        // alert(JSON.stringify(rest));
        // return false;
        formData.append('data', JSON.stringify(rest));
        const request = http.post(`checklist_items/${stockId}`, formData);
        request.then(() => {
          dispatch({
            type: SUBMIT_STOCK_SUCCESS,
            payload: { checkList: newCheckList, stocks: newStocks },
          });
          return true;
        });
        request.catch(error => {
          dispatch({ type: SUBMIT_STOCK_FAILURE, payload: { error } });
          return false;
        });
      } else {
        dispatch({
          type: SUBMIT_STOCK_SUCCESS,
          payload: { checkList: newCheckList, stocks: newStocks },
        });
      }
    };

export const clearStocks = () => dispatch => {
  dispatch({ type: CLEAR_STOCKS });
};

export const resetStatusState = () => dispatch => {
  dispatch({ type: RESET_STATUS_STATE });
};

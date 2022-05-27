import initialState from './initialState';
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
  SAVE_CATEGORIES_REQUEST,
  SAVE_CATEGORIES_SUCCESS,
} from './constants';

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHECK_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case GET_CHECK_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        checkList: action.payload.checkList,
      };
    case GET_CHECK_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload.error.message,
      };
    case GET_STOCKS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_STOCKS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        stocks: [...state.stocks, ...action.payload],
      };
    case GET_STOCKS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload.error.message,
      };
    case SAVE_ALL_STOCKS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case SAVE_ALL_STOCKS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        allStocks: action.payload.allStocks,
        stocks: action.payload.stocks,
      };
    case SAVE_ALL_STOCKS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload.error.message,
      };
    case SAVE_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload.categories,
      };
    case SAVE_CATEGORIES_FAILURE:
      return {
        ...state,
        errorMessage: action.payload.error.message,
      };
    case SUBMIT_STOCK_REQUEST:
      return {
        ...state,
        isFetching: true,
        isDone: false,
      };
    case SUBMIT_STOCK_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isDone: true,
        checkList: action.payload.checkList,
        stocks: action.payload.stocks,
      };
    case SUBMIT_STOCK_FAILURE:
      return {
        ...state,
        isFetching: false,
        isDone: false,
        errorMessage: action.payload.error.message,
      };
    case CLEAR_STOCKS:
      return {
        ...state,
        allStocks: [],
        stocks: [],
        categories: [],
      };
    case RESET_STATUS_STATE:
      return {
        ...state,
        isFetching: false,
        isLoading: false,
        isDone: false,
      };
    default:
      return state;
  }
}

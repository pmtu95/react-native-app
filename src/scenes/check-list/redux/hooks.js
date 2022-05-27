import {useCallback} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  getCheckLists,
  getStocks,
  saveAllStocks,
  submitStock,
  clearStocks,
  resetStatusState,
  saveCategories,
} from './actions';

const useCheckList = () => {
  const dispatch = useDispatch();

  const {
    isFetching,
    isLoading,
    isDone,
    checkList,
    stocks,
    categories,
    allStocks,
    errorMessage,
  } = useSelector(
    state => ({
      isFetching: state.checkList.isFetching,
      isLoading: state.checkList.isLoading,
      isDone: state.checkList.isDone,
      checkList: state.checkList.checkList,
      stocks: state.checkList.stocks,
      categories: state.checkList.categories,
      allStocks: state.checkList.allStocks,
      errorMessage: state.checkList.errorMessage,
    }),
    shallowEqual,
  );

  const boundGetCheckLists = useCallback(
    shopId => {
      dispatch(getCheckLists(shopId));
    },
    [dispatch],
  );

  const boundGetTemplate = useCallback(
    checkListId => {
      return checkList.filter(item => item.id === checkListId)[0]?.template;
    },
    [checkList],
  );

  const boundSaveAllStocks = useCallback(
    (checkListId, filterValue, filterDone, searchValue) => {
      dispatch(
        saveAllStocks(checkListId, filterValue, filterDone, searchValue),
      );
    },
    [dispatch],
  );

  const boundSaveCategories = useCallback(
    checkListId => {
      dispatch(saveCategories(checkListId));
    },
    [dispatch],
  );

  const boundGetStocks = useCallback(
    page => {
      dispatch(getStocks(page));
    },
    [dispatch],
  );

  const boundSubmitStock = useCallback(
    (isDefault, checkListId, stockId, data) => {
      dispatch(submitStock(isDefault, checkListId, stockId, data));
    },
    [dispatch],
  );

  const boundClearStocks = useCallback(() => {
    dispatch(clearStocks());
  }, [dispatch]);

  const boundResetStatusState = useCallback(() => {
    dispatch(resetStatusState());
  }, [dispatch]);

  return {
    isFetching,
    isLoading,
    isDone,
    checkList,
    stocks,
    categories,
    allStocks,
    errorMessage,
    getCheckLists: boundGetCheckLists,
    getTemplate: boundGetTemplate,
    getStocks: boundGetStocks,
    saveAllStocks: boundSaveAllStocks,
    clearStocks: boundClearStocks,
    submitStock: boundSubmitStock,
    resetStatusState: boundResetStatusState,
    saveCategories: boundSaveCategories,
  };
};

export default useCheckList;

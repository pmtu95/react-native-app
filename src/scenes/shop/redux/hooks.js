import {useCallback} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {getShops, dismissError} from './actions';

const useShop = () => {
  const dispatch = useDispatch();

  const {shops, isFetching, loggedIn, message, errorMessage} = useSelector(
    state => ({
      shops: state.shop.shops,
      isFetching: state.shop.isFetching,
      errorMessage: state.shop.errorMessage,
    }),
    shallowEqual,
  );

  const boundGetShops = useCallback(
    user_id => {
      dispatch(getShops(user_id));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    dispatch(dismissError());
  }, [dispatch]);

  return {
    shops,
    isFetching,
    loggedIn,
    message,
    errorMessage,
    getShops: boundGetShops,
    dismissError: boundDismissError,
  };
};

export default useShop;

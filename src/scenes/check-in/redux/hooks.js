import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { checkIn, checkOut, getServerTime } from './actions';

const useCheckIn = () => {
  const dispatch = useDispatch();

  const { isFetching, isCheckIn, checkInData, errorMessage } = useSelector(
    state => ({
      isFetching: state.checkIn.isFetching,
      isCheckIn: state.checkIn.isCheckIn,
      checkInData: state.checkIn.checkInData,
      errorMessage: state.checkIn.errorMessage,
    }),
    shallowEqual,
  );

  const boundCheckIn = useCallback(
    data => {
      dispatch(checkIn(data));
    },
    [dispatch],
  );

  const boundCheckOut = useCallback(
    data => {
      dispatch(checkOut(data));
    },
    [dispatch],
  );
  const boundGetServerTime = useCallback(
    data => {
      dispatch(getServerTime(data));
    },
    [dispatch],
  );

  return {
    isFetching,
    isCheckIn,
    checkInData,
    errorMessage,
    checkIn: boundCheckIn,
    checkOut: boundCheckOut,
    getServerTime: boundGetServerTime,
  };
};

export default useCheckIn;

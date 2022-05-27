import {useCallback} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  capture,
  updateMode,
  updateNetInfo,
  syncData,
  resetStatusState,
} from './actions';

const useHome = () => {
  const dispatch = useDispatch();

  const {
    isFetching,
    isDone,
    mode,
    isSync,
    percent,
    cachePictures,
    isConnected,
    errorMessage,
  } = useSelector(
    state => ({
      isFetching: state.home.isFetching,
      isDone: state.home.isDone,
      mode: state.home.mode,
      isSync: state.home.isSync,
      percent: state.home.percent,
      cachePictures: state.home.cachePictures,
      isConnected: state.home.isConnected,
      errorMessage: state.home.errorMessage,
    }),
    shallowEqual,
  );

  const boundCapture = useCallback(
    data => {
      dispatch(capture(data));
    },
    [dispatch],
  );

  const boundUpdateMode = useCallback(
    modeType => {
      dispatch(updateMode(modeType));
    },
    [dispatch],
  );

  const boundUpdateNetInfo = useCallback(
    connected => {
      dispatch(updateNetInfo(connected));
    },
    [dispatch],
  );

  const boundSyncData = useCallback(() => {
    dispatch(syncData());
  }, [dispatch]);

  const boundResetStatusState = useCallback(() => {
    dispatch(resetStatusState());
  }, [dispatch]);

  return {
    isFetching,
    isDone,
    mode,
    isSync,
    percent,
    cachePictures,
    isConnected,
    errorMessage,
    capture: boundCapture,
    updateMode: boundUpdateMode,
    updateNetInfo: boundUpdateNetInfo,
    syncData: boundSyncData,
    resetStatusState: boundResetStatusState,
  };
};

export default useHome;

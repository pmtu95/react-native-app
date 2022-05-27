import {useCallback} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  dismissError,
  dismissMessage,
} from './actions';

const useAuth = () => {
  const dispatch = useDispatch();

  const {user_id, account, isFetching, loggedIn, message, errorMessage} =
    useSelector(
      state => ({
        user_id: state.auth.user_id,
        account: state.auth.account,
        isFetching: state.auth.isFetching,
        loggedIn: state.auth.loggedIn,
        message: state.auth.message,
        errorMessage: state.auth.errorMessage,
      }),
      shallowEqual,
    );

  const boundLoginAction = useCallback(
    (username, password) => {
      dispatch(login(username, password));
    },
    [dispatch],
  );

  const boundLogoutAction = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const boundForgotPasswordAction = useCallback(
    (email, captcha) => {
      dispatch(forgotPassword(email, captcha));
    },
    [dispatch],
  );

  const boundResetPasswordAction = useCallback(
    (id, password, confirmPassword, captcha) => {
      dispatch(resetPassword(id, password, confirmPassword, captcha));
    },
    [dispatch],
  );

  const boundChangePasswordAction = useCallback(
    (oldPassword, newPassword, newPasswordConfirmation, captcha) => {
      dispatch(
        changePassword(
          oldPassword,
          newPassword,
          newPasswordConfirmation,
          captcha,
        ),
      );
    },
    [dispatch],
  );

  const boundDismissMessage = useCallback(() => {
    dispatch(dismissMessage());
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    dispatch(dismissError());
  }, [dispatch]);

  return {
    user_id,
    account,
    isFetching,
    loggedIn,
    message,
    errorMessage,
    login: boundLoginAction,
    logout: boundLogoutAction,
    forgotPassword: boundForgotPasswordAction,
    resetPassword: boundResetPasswordAction,
    changePassword: boundChangePasswordAction,
    dismissMessage: boundDismissMessage,
    dismissError: boundDismissError,
  };
};

export default useAuth;

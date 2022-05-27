import Config from 'react-native-config';
import axios from 'axios';
import store from '../common/store';
import {logout, updateAuthorization} from '../scenes/auth/redux/actions';

// create an instance of axios
const instance = axios.create({
  baseURL: Config.API_URL,
  headers: {'Content-Type': 'application/json', App: 'osa2-mobile'},
});

instance.interceptors.request.use(
  config => {
    const {auth} = store.getState();
    const {authorization} = auth;
    const newConfig = config;

    if (auth && authorization !== '') {
      newConfig.headers.Authorization = authorization;
    }
    return newConfig;
  },
  error => Promise.reject(error),
);
instance.interceptors.response.use(
  response => {
    store.dispatch(updateAuthorization(response.headers.authorization));
    return new Promise(resolve => setTimeout(() => resolve(response.data), 0));
  },
  error => {
    console.log(error);
    if (error.response) {
      const {status} = error.response;
      if (status === 401 || status === 500) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  },
);

export default instance;

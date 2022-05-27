import {NativeModules} from 'react-native';

export const SplashScreen = props => {
  if (!props.loading) {
    NativeModules.SplashScreen.hide();
  }

  return null;
};

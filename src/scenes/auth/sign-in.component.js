import React from 'react';
import {View, TouchableWithoutFeedback, Image, Platform} from 'react-native';
import {
  StyleService,
  useStyleSheet,
  Button,
  Input,
  Icon,
  Spinner,
} from '@ui-kitten/components';
import Snackbar from 'react-native-snackbar';
import {KeyboardAvoidingView} from '../../components/keyboard-avoiding-view.component';
import {PersonIcon} from './extra/icons';

import useAuth from './redux/hooks';

const keyboardOffset = height =>
  Platform.select({
    android: 0,
    ios: height,
  });

export default ({navigation}) => {
  const styles = useStyleSheet(themedStyle);
  const {account, isFetching, loggedIn, login, dismissError, errorMessage} =
    useAuth();
  const [username, setUsername] = React.useState(account.username);
  const [password, setPassword] = React.useState(account.password);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  React.useEffect(() => {
    if (loggedIn) {
      navigation.replace('Home');
    }
  }, [loggedIn, navigation]);

  React.useEffect(() => {
    if (errorMessage !== '') {
      Snackbar.show({
        text: errorMessage,
        duration: Snackbar.LENGTH_LONG,
      });
      setTimeout(() => {
        dismissError();
      }, Snackbar.LENGTH_LONG);
    }
  }, [errorMessage, dismissError]);

  const onPasswordIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const renderPasswordIcon = props => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const onLogin = () => {
    login(username, password);
  };

  return (
    <KeyboardAvoidingView style={styles.container} offset={keyboardOffset}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo_rounded.png')}
          />
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.boxShadow}>
          <View style={styles.formContainer}>
            <Input
              style={styles.input}
              size="large"
              placeholder="Tài khoản"
              accessoryRight={PersonIcon}
              value={username}
              onChangeText={setUsername}
              disabled={isFetching}
            />
            <Input
              style={styles.input}
              size="large"
              placeholder="Mật khẩu"
              accessoryRight={renderPasswordIcon}
              value={password}
              secureTextEntry={!passwordVisible}
              onChangeText={setPassword}
              disabled={isFetching}
            />
          </View>
          <Button
            size="large"
            accessoryLeft={() => isFetching && <Spinner status="control" />}
            onPress={onLogin}
            disabled={isFetching}>
            ĐĂNG NHẬP
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const themedStyle = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-1',
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    height: 200,
    resizeMode: 'contain',
  },
  bodyContainer: {
    flex: 1,
    padding: 16,
    overflow: 'visible',
  },
  boxShadow: {
    flex: 1,
    backgroundColor: 'background-basic-color-1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 32,

    shadowColor: 'background-alternative-color-1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  textHeader: {
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    fontSize: 24,
    color: 'black',
  },
  formContainer: {
    flex: 1,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    marginBottom: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
});

import React from 'react';
import {
  ImageBackground,
  Platform,
  View,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import {
  StyleService,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  Input,
  Text,
  Button,
  Icon,
  Spinner,
} from '@ui-kitten/components';
import {launchCamera} from 'react-native-image-picker';
import {useForm, Controller} from 'react-hook-form';
import {getLocation} from '../../services/location.service';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {KeyboardAvoidingView} from '../../components/keyboard-avoiding-view.component';
import {TextError} from '../../components/text-error.component';
import {ArrowIosBackIcon} from '../../components/icons';

import useAuth from '../auth/redux/hooks';
import useCheckIn from './redux/hooks';

const keyboardOffset = height =>
  Platform.select({
    android: 0,
    ios: height,
  });

export default ({navigation, route}) => {
  const {shopId, shopName} = route.params;
  const styles = useStyleSheet(themedStyle);
  const {loggedIn, user_id} = useAuth();
  const {checkIn, isFetching, isCheckIn} = useCheckIn();
  const {
    control,
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: {errors},
  } = useForm();

  const [photo, setPhoto] = React.useState(null);
  const [location, setLocation] = React.useState(null);

  const getPermissionAndroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    return false;
  };

  React.useEffect(() => {
    if (!loggedIn) {
      navigation.replace('Auth');
    } else if (isCheckIn) {
      navigation.replace('CheckList');
    } else {
      register('photo', {required: true});
      getLocation().then(res => setLocation(res));
    }
  }, [loggedIn, navigation, register, isCheckIn]);

  const renderBackAction = () => (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );

  const takePhoto = async () => {
    if (Platform.OS === 'android' && !(await getPermissionAndroid())) {
      return;
    }

    launchCamera(
      {
        maxWidth: Dimensions.get('screen').width,
        maxHeight: Dimensions.get('screen').height,
        quality: Platform.OS === 'ios' ? 0.5 : 0.8,
        mediaType: 'photo',
        includeBase64: false,
      },
      res => {
        if (res.assets) {
          setPhoto(res.assets[0]);
          setValue('photo', res.assets[0], {shouldValidate: true});
          clearErrors('photo');
        }
      },
    );
  };

  const onSubmit = data => {
    checkIn({
      ...data,
      ...location,
      shopId,
      shopName,
      user_id,
    });
  };

  return (
    <SafeAreaLayout insets="top" style={styles.layout} level="3">
      <TopNavigation
        title={({style, ...evaProps}) => (
          <Text {...evaProps} style={[style, styles.title]}>
            Check in
          </Text>
        )}
        subtitle={({style, evaProps}) => (
          <Text {...evaProps} style={[style, styles.subtitle]}>
            {shopName}
          </Text>
        )}
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <KeyboardAvoidingView style={styles.container} offset={keyboardOffset}>
        <View style={styles.list}>
          <View style={styles.imageContainer}>
            {photo && (
              <ImageBackground style={styles.image} source={{uri: photo.uri}} />
            )}

            <TouchableOpacity
              style={styles.cameraContainer}
              onPress={takePhoto}
              disabled={isFetching}>
              <View style={styles.camera}>
                <Icon name="camera" fill="#E67832" style={styles.cameraIcon} />
                <Text style={styles.cameraText} category="s1">
                  Chụp hình
                </Text>
              </View>
            </TouchableOpacity>
            {errors.photo && (
              <TextError style={{padding: 8}}>Cần chụp hình!</TextError>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              rules={{required: false}}
              render={({field: {onChange, value}}) => (
                <Input
                  textStyle={styles.commentInput}
                  label={evaProps => (
                    <Text {...evaProps} style={styles.commentInputLabel}>
                      Thông tin
                    </Text>
                  )}
                  placeholder="Ghi chú"
                  multiline={true}
                  numberOfLines={5}
                  textAlignVertical="top"
                  onChangeText={onChange}
                  value={value}
                  disabled={isFetching}
                />
              )}
              name="note"
              defaultValue=""
            />
            {errors.note && <TextError>Cần nhập thông tin!</TextError>}
          </View>
          <SafeAreaLayout insets="bottom" style={styles.actionBtn}>
            <Button
              size="large"
              accessoryLeft={() => isFetching && <Spinner status="control" />}
              onPress={handleSubmit(onSubmit)}
              disabled={isFetching}>
              Gửi
            </Button>
          </SafeAreaLayout>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaLayout>
  );
};

const themedStyle = StyleService.create({
  layout: {
    flex: 1,
  },
  title: {fontWeight: 'bold', color: 'color-primary-500'},
  subtitle: {fontSize: 12},
  container: {
    backgroundColor: 'background-basic-color-3',
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  list: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: 'background-basic-color-2',
    height: 240,
    justifyContent: 'flex-end',
  },
  image: {
    flex: 1,
    resizeMode: 'center',
  },
  cameraContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  camera: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'color-basic-transparent-500',
    borderWidth: 0,
    borderRadius: 120,
    width: 120,
    height: 120,
  },
  cameraIcon: {
    alignSelf: 'center',
    width: 48,
    height: 48,
  },
  cameraText: {
    color: 'text-primary-color',
  },
  commentInputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'text-basic-color',
  },
  commentInput: {
    maxHeight: 200,
    minHeight: 130,
  },
  inputContainer: {
    flex: 1,
    marginTop: 24,
    marginBottom: 20,
  },
  actionBtn: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
});

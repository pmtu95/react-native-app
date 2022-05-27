import React from 'react';
import {
  ImageBackground,
  Platform,
  View,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  Image,
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
  Modal,
  Card,
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

import SignatureCapture from 'react-native-signature-capture';
import Marker, {Position, ImageFormat} from 'react-native-image-marker';
import base64 from 'react-native-base64';
import md5 from 'react-native-md5';
import moment from 'moment-timezone';
const {width, height} = Dimensions.get('window');

const keyboardOffset = height =>
  Platform.select({
    android: 0,
    ios: height,
  });

export default ({navigation, route}) => {
  const {shopId, shopName, type} = route.params;
  const styles = useStyleSheet(themedStyle);
  const {loggedIn, user_id, account} = useAuth();
  const {isFetching, isCheckIn, checkOut, getServerTime} = useCheckIn();
  const {
    control,
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: {errors},
  } = useForm();
  const [visible, setVisible] = React.useState(false);
  const [signature, setSignature] = React.useState(false);
  const [photo, setPhoto] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const myRef = React.createRef();
  const saveSign = () => {
    if (myRef && myRef) {
      myRef.current.saveImage();
    }
  };

  const resetSign = () => {
    myRef.current.resetImage();
  };
  const b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  };

  const _onSaveEvent = result => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    if (result.encoded) {
      let base64Image = 'data:image/png;base64,' + result.encoded;
      Marker.markImage({
        src: require('../../assets/images/mask.png'),
        markerSrc: {uri: base64Image},
        // text: base64.encode('shopId=' + shopId + '|userId=' + user_id + '|time=' + moment().format('DD/MM/YYYY HH:mm')),
        position: Position.topLeft,
        // color: '#FF0000',
        // fontName: 'Arial-BoldItalicMT',
        // fontSize: 25,
        markerScale: 0.8,
        scale: 1,
        saveFormat: ImageFormat.base64,
        quality: 100,
      })
        .then(async res => {
          Marker.markText({
            src: {uri: res},
            text:
              'Hash:' +
              md5.hex_md5(
                'shopId=' +
                  shopId +
                  '|userId=' +
                  user_id +
                  '|time=' +
                  moment().format('DD/MM/YYYY HH:mm'),
              ) +
              '\n' +
              'Shop:' +
              shopName +
              '\n' +
              'User:' +
              account.username +
              '\n' +
              'Time:' +
              moment().format('DD/MM/YYYY HH:mm'),
            X: 30,
            Y: 780,
            color: '#000',
            fontName: 'Arial-BoldItalicMT',
            fontSize: 35,
            scale: 1,
            saveFormat: ImageFormat.base64,
            quality: 100,
          })
            .then(async res => {
              console.log('res', res);
              setSignature(res);
              setVisible(false);
            })
            .catch(err => {
              console.log(err);
            });

          // this.setState({ signature: res });
        })
        .catch(err => {
          console.log(err);
        });
      // this.setState({ signature:  });
    }
    // console.log(result);
  };
  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log('dragged');
  };
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
    } else if (!isCheckIn) {
      navigation.replace('Shop');
    } else {
      register('photo', {required: true});
      getLocation().then(res => setLocation(res));
    }
  }, [loggedIn, navigation, register, isCheckIn]);
  React.useEffect(() => {
    console.log('222');
    getServerTime();
  }, []);

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
    let params = {
      ...data,
      ...location,
      incomplete: type === 'checkout' ? false : true,
      shopId,
      userId: user_id,
    };
    if (type === 'checkout') {
      params['signature'] = {
        uri: signature,
        type: 'image/png',
        name: 'signature.png',
      };
    }
    checkOut(params);
  };

  return (
    <SafeAreaLayout insets="top" style={styles.layout} level="3">
      <TopNavigation
        title={({style, ...evaProps}) => (
          <Text {...evaProps} style={[style, styles.title]}>
            {type === 'checkout' ? 'Check out' : 'Báo cáo sự cố'}
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
              rules={{required: type === 'report' ? true : false}}
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
            {/* <TextError>{user_id}</TextError>
            <TextError>{md5.hex_md5('shopId=' + shopId + '|userId=' + user_id + '|time=' + moment().format('DD/MM/YYYY HH:mm'))}</TextError> */}
            {signature ? (
              <Image
                style={{width: 0.8 * width, height: width}}
                source={{uri: signature}}
                resizeMethod="resize"
              />
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>

      {type === 'checkout' ? (
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}>
          <Card disabled={true} style={{width: 0.9 * width}} status="warning">
            <Text>Hãy ký tên trước khi checkout</Text>
            <SignatureCapture
              style={[
                {
                  width: '100%',
                  height: 0.8 * width,
                  marginVertical: 10,
                  paddingVertical: 80,
                },
              ]}
              ref={myRef}
              onSaveEvent={_onSaveEvent}
              onDragEvent={_onDragEvent}
              saveImageFileInExtStorage={true}
              showNativeButtons={false}
              showTitleLabel={false}
              backgroundColor="#fff"
              strokeColor="#000"
              minStrokeWidth={1}
              maxStrokeWidth={1}
              viewMode={'landscape'}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button size="small" status="basic" onPress={() => resetSign()}>
                Xoá
              </Button>
              <Button onPress={() => saveSign()}>Lưu</Button>
            </View>
          </Card>
        </Modal>
      ) : null}
      <SafeAreaLayout insets="bottom" style={styles.actionBtn}>
        {type === 'checkout' ? (
          <>
            {!signature ? (
              <Button size="large" onPress={() => setVisible(true)}>
                Ký tên
              </Button>
            ) : (
              <Button
                size="large"
                accessoryLeft={() => isFetching && <Spinner status="control" />}
                onPress={handleSubmit(onSubmit)}
                disabled={isFetching}>
                Gửi
              </Button>
            )}
          </>
        ) : (
          <Button
            size="large"
            accessoryLeft={() => isFetching && <Spinner status="control" />}
            onPress={handleSubmit(onSubmit)}
            disabled={isFetching}>
            Gửi
          </Button>
        )}
      </SafeAreaLayout>
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
    color: 'text-basic-color',
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

import React from 'react';
import uuid from 'react-native-uuid';
import CameraRoll from '@react-native-community/cameraroll';
import {useIsFocused} from '@react-navigation/core';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  PanResponder,
  BackHandler,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {ArrowIosBackIcon} from '../../components/icons';
import {RNCamera} from 'react-native-camera';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

class ZoomView extends React.Component {
  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      onPanResponderMove: (e, {dy}) => {
        const {height: windowHeight} = Dimensions.get('window');
        return this.props.onZoomProgress(
          Math.min(Math.max((dy * -1) / windowHeight, 0), 0.5),
        );
      },
      onMoveShouldSetPanResponder: (ev, {dx}) => {
        return dx !== 0;
      },
      onPanResponderGrant: () => {
        return this.props.onZoomStart();
      },
      onPanResponderRelease: () => {
        return this.props.onZoomEnd();
      },
    });
  }
  render() {
    return (
      <View
        style={{flex: 1, width: '100%'}}
        {...this._panResponder.panHandlers}>
        {this.props.children}
      </View>
    );
  }
}

export default ({route, navigation}) => {
  const {screen, pictures} = route.params;
  const isFocused = useIsFocused();
  const cameraRef = React.useRef(null);

  const [flash, setFlash] = React.useState('off');
  const [type, setType] = React.useState('back');
  const [zoom, setZoom] = React.useState(0);
  const [cameraState, setCameraState] = React.useState({
    photos: pictures,
    isFlicker: false,
  });

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
  }, [handleBackButtonClick]);

  const handleBackButtonClick = React.useCallback(() => {
    navigation.navigate({
      name: screen,
      params: {pictures: cameraState.photos},
      merge: true,
    });
    return true;
  }, [navigation, cameraState.photos, screen]);

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const savePicture = async (tag, options) => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.save(tag, options);
  };

  const toggleFacing = () => {
    setType(type === 'back' ? 'front' : 'back');
  };

  const toggleFlash = () => {
    setFlash(flashModeOrder[flash]);
  };

  const takePicture = async () => {
    setCameraState({...cameraState, isFlicker: true});
    if (cameraRef.current !== null) {
      const options = {
        width: Dimensions.get('screen').width,
        quality: Platform.OS === 'ios' ? 0.5 : 0.8,
      };
      const data = await cameraRef.current.takePictureAsync(options);
      data.fileName = uuid.v4();
      const photos = [...cameraState.photos, data];
      setCameraState({isFlicker: false, photos});
      await savePicture(data.uri);
    }
  };

  const renderBackAction = () => (
    <TopNavigationAction
      icon={<ArrowIosBackIcon fill="#fff" />}
      onPress={handleBackButtonClick}
      disabled={cameraState.isFlicker}
    />
  );

  const renderFlashAction = () => (
    <TopNavigationAction
      style={styles.flashBtn}
      icon={props => (
        <Icon
          {...props}
          name={
            flash === 'off' ? 'flash-off' : flash === 'torch' ? 'bulb' : 'flash'
          }
          fill="white"
          style={{flex: 1}}
        />
      )}
      onPress={toggleFlash}
      disabled={cameraState.isFlicker}
    />
  );

  const renderCamera = () => {
    // if (!isFocused) {
    //   return null;
    // }
    return (
      <RNCamera
        ref={cameraRef}
        style={{flex: 1}}
        type={type}
        flashMode={flash}
        // zoom={zoom}
        autoFocus={true}
        useNativeZoom={true}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
    );
  };

  return (
    <SafeAreaLayout insets="top" style={styles.container}>
      <StatusBar hidden />
      <TopNavigation
        alignment="center"
        style={{backgroundColor: 'black'}}
        accessoryLeft={renderBackAction}
        accessoryRight={renderFlashAction}
      />
      <View style={styles.cameraWrapper}>
        <ZoomView
          onZoomProgress={progress => {
            setZoom(progress);
          }}
          onZoomStart={() => {
            //  alert('Zoom started')
            console.log('zoom start');
          }}
          onZoomEnd={() => {
            console.log('zoom end');
          }}>
          {renderCamera()}
        </ZoomView>
        {cameraState.isFlicker && <View style={styles.flick} />}
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.left}>
          <TouchableOpacity
            style={styles.tookPictureWrapper}
            disabled={cameraState.isFlicker}>
            {cameraState.photos.length > 0 && (
              <Image
                style={styles.tookPicture}
                source={{
                  uri: cameraState.photos[cameraState.photos.length - 1].uri,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.takePictureWrapper}>
          <TouchableOpacity
            style={styles.takePictureBtn}
            onPress={takePicture}
            disabled={cameraState.isFlicker}
          />
        </View>
        <View style={styles.right}>
          <TouchableOpacity
            style={styles.flipBtn}
            onPress={toggleFacing}
            disabled={cameraState.isFlicker}>
            <Icon name="sync" fill="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraWrapper: {justifyContent: 'flex-end', flex: 1},
  topBar: {
    flex: 1,
    maxHeight: 80,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {flex: 1, justifyContent: 'center', alignItems: 'flex-end'},
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 50,
    borderWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 4,
  },
  flipBtn: {
    width: 46,
    height: 46,
    borderRadius: 50,
    borderWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
  },
  takePictureWrapper: {
    width: 74,
    height: 74,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    padding: 2,
  },
  takePictureBtn: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 0,
    backgroundColor: 'white',
  },
  bottomBar: {
    height: 160,
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  flashWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  flashBtn: {
    width: 26,
    height: 26,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
    padding: 4,
  },
  flick: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  tookPictureWrapper: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tookPicture: {width: '100%', height: '100%', borderRadius: 6},
});

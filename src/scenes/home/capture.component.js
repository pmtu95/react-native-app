import React from 'react';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import { useForm } from 'react-hook-form';
import { View, FlatList, Dimensions } from 'react-native';
import {
  StyleService,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  ListItem,
  Text,
  Button,
  Icon,
} from '@ui-kitten/components';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { TextError } from '../../components/text-error.component';
import { ArrowIosBackIcon } from '../../components/icons';

import useAuth from '../auth/redux/hooks';
import useHome from './redux/hooks';

export default ({ navigation, route }) => {
  const { pictures, checkListType, checkListId } = route.params;
  const styles = useStyleSheet(themedStyle);
  const { loggedIn } = useAuth();
  const {
    isConnected,
    mode,
    isDone,
    capture,
    updateNetInfo,
    updateMode,
    cachePictures,
    resetStatusState,
  } = useHome();
  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const unsubscribe = NetInfo.addEventListener(state => {
    if (isConnected !== state.isInternetReachable) {
      updateNetInfo(state.isInternetReachable);
    }
    if (state.isInternetReachable === false && mode === 'online') {
      updateMode('offline');
    }
  });

  const [photos, setPhotos] = React.useState([]);

  React.useEffect(() => {
    return () => unsubscribe();
  }, [unsubscribe]);

  React.useEffect(() => {
    if (!loggedIn) {
      navigation.replace('Auth');
    } else {
      register('photos', { required: true });
    }
  }, [loggedIn, navigation, register]);

  React.useEffect(() => {
    const filterPictures = cachePictures.filter(
      item => item.checkListId === checkListId,
    )[0];

    const mergePictures =
      filterPictures || pictures
        ? _.unionBy(filterPictures?.photos, pictures, 'fileName')
        : [];

    setPhotos(mergePictures);
  }, [cachePictures, checkListId, pictures]);

  React.useEffect(() => {
    if (pictures && pictures.length > 0) {
      setValue('photos', photos, { shouldValidate: true });
      clearErrors('photos');
    }
  }, [clearErrors, photos, pictures, setValue]);

  React.useEffect(() => {
    if (isDone) {
      navigation.goBack();
    }

    return () => resetStatusState();
  }, [isDone, navigation, resetStatusState]);

  const renderBackAction = () => (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );

  const renderImageItem = ({ item }) => (
    <ListItem style={styles.itemImage}>
      <FastImage
        style={{
          width: '100%',
          height: Dimensions.get('screen').width / 3 - 2,
        }}
        source={{ uri: item.uri }}
      />
      <View style={styles.removeBtnWrapper}>
        <Button
          style={styles.closeButton}
          size="large"
          appearance="ghost"
          accessoryLeft={evaProps => <Icon {...evaProps} name="close-circle" />}
          onPress={() => removeImage(item.uri)}
        />
      </View>
    </ListItem>
  );

  const removeImage = uri => {
    const newPhotos = photos.filter(photo => photo.uri !== uri);
    setPhotos(newPhotos);
  };

  const onSubmit = data => {
    capture({ ...data, note: '', checkListId });
  };

  return (
    <SafeAreaLayout insets="top" level="2" style={styles.layout}>
      <TopNavigation
        title={evaProps => (
          <Text {...evaProps} style={styles.title}>
            Chụp hình
          </Text>
        )}
        subtitle={({ style, ...evaProps }) =>
          checkListType ? (
            <Text {...evaProps} style={[style, styles.subtitle]}>
              {checkListType}
            </Text>
          ) : null
        }
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <View style={styles.container}>
        {errors.photos && (
          <View style={{ alignItems: 'center', paddingVertical: 16 }}>
            <TextError>Cần chụp hình!</TextError>
          </View>
        )}
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 4, paddingTop: 8 }}
          data={photos || []}
          renderItem={renderImageItem}
          keyExtractor={item => item.uri}
          numColumns={3}
        />
        <View style={styles.cameraWrapper}>
          <Button
            style={styles.camera}
            appearance="ghost"
            accessoryLeft={({ style, ...evaProps }) => (
              <Icon
                {...evaProps}
                name="camera"
                style={[style, { width: 32, height: 32 }]}
              />
            )}
            children="Chụp hình"
            onPress={() => {
              navigation.navigate('Camera', {
                screen: 'Capture',
                pictures: photos,
              });
            }}
          />
        </View>
      </View>
      <SafeAreaLayout insets="bottom" style={styles.actionBtn}>
        <Button onPress={handleSubmit(onSubmit)}>Gửi</Button>
      </SafeAreaLayout>
    </SafeAreaLayout>
  );
};

const themedStyle = StyleService.create({
  layout: {
    flex: 1,
  },
  title: { fontWeight: 'bold', color: 'color-primary-500' },
  subtitle: { textTransform: 'uppercase' },
  container: {
    backgroundColor: 'background-basic-color-2',
    flex: 1,
  },
  cameraWrapper: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'column',
  },
  itemImage: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    paddingVertical: 0,
    paddingHorizontal: 0,
    maxWidth: '31.3%',
  },
  removeBtnWrapper: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: 'background-basic-color-1',
    width: 15,
    height: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 30,
  },
  actionBtn: {
    margin: 8,
  },
});

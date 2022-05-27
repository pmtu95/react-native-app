import React from 'react';
import { View, FlatList, Dimensions, Platform, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import {
  StyleService,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  Text,
  ListItem,
  Modal,
  Icon,
} from '@ui-kitten/components';
import Carousel, { Pagination } from 'react-native-snap-carousel';
// import PhotoView from 'react-native-photo-view';
import FastImage from 'react-native-fast-image';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon } from '../../components/icons';
export default ({ navigation, route }) => {
  const { photos } = route.params;
  const styles = useStyleSheet(themedStyle);

  const [visible, setVisible] = React.useState(false);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [image, setImage] = React.useState(null);
  const _carousel = React.createRef();
  const { width, height } = Dimensions.get('window');
  const renderBackAction = () => (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );

  const renderImageItem = React.useCallback(
    ({ item }) => (
      <ListItem
        style={styles.itemImage}
        onPress={() => {
          setVisible(true);
          setImage(item);
        }}>
        <FastImage
          style={{
            width: '100%',
            height: Dimensions.get('screen').width / 3 - 2,
          }}
          source={{ uri: item }}
        />
      </ListItem>
    ),
    [],
  );
  _renderItem = ({ item, index }) => {
    let totalPhoto = photos.length;
    return (
      <View style={{ paddingHorizontal: 40, flex: 1 }} key={'key' + index}>

        <SafeAreaView style={{ flex: 1 }}>
          <Image source={{ uri: item }} style={{ width: width - 80, height: 2 * height / 3 }} resizeMode='contain' />
        </SafeAreaView>
        {(totalPhoto > 1) ? <TouchableOpacity style={[styles.slideButton, { left: 5, opacity: (index == 0) ? 0.3 : 1 }]} onPress={() => { _carousel.current.snapToPrev(); }}
          disabled={index == 0}
        >
          <Image source={require('../../assets/icons/arrow-ios-back-outline.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
        </TouchableOpacity> : null}
        {(totalPhoto > 1) ? <TouchableOpacity onPress={() => { _carousel.current.snapToNext(); }} style={[styles.slideButton, { opacity: (index == (totalPhoto - 1)) ? 0.3 : 1 }]}
          disabled={index == (totalPhoto - 1)}
        >
          <Image source={require('../../assets/icons/arrow-ios-forward-outline.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
        </TouchableOpacity> : null}
      </View>
    );
  }
  const dismissModal = () => {
    setImage(null);
    setVisible(false);
  };

  return (
    <SafeAreaLayout insets="top" level="2" style={styles.layout}>
      <TopNavigation
        title={evaProps => (
          <Text {...evaProps} style={styles.title}>
            Thư viện ảnh 2
          </Text>
        )}
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 4, paddingTop: 8 }}
          data={photos || []}
          renderItem={renderImageItem}
          keyExtractor={item => item}
          numColumns={3}
        />
      </View>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        style={styles.layout}>
        <View style={{ backgroundColor: '#edf2fb', flex: 1 }}>
          <TopNavigation
            style={styles.modalHeader}
            accessoryRight={() => (
              <TopNavigationAction
                icon={<Icon name="close" color="white" />}
                onPress={dismissModal}
              />
            )}
          />

          {photos && photos.length ? <Carousel
            loop={false}
            enableSnap={true}
            autoplay={false}

            // ref={c => {
            //   this._carousel = c;
            // }}
            ref={_carousel}
            data={photos}
            renderItem={_renderItem}
            sliderWidth={width}
            onSnapToItem={index => setActiveSlide(index)}
            itemWidth={width}
          /> : null}
          {/* <PhotoView
          source={{ uri: image }}
          minimumZoomScale={0.5}
          maximumZoomScale={10}
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
          }}
        /> */}
        </View>
      </Modal>
    </SafeAreaLayout>
  );
};

const themedStyle = StyleService.create({
  layout: {
    flex: 1,
    backgroundColor: 'red'
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  imageContainer: {
    marginVertical: 20, justifyContent: 'center', alignItems: 'center', alignContent: 'center'
  },
  slideButton: {
    position: 'absolute',
    top: '50%',
    right: 5
  }
});

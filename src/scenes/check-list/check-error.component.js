import React from 'react';
import _ from 'lodash';
import {useForm, Controller} from 'react-hook-form';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import {
  View,
  FlatList,
  Platform,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import {
  StyleService,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  ListItem,
  Input,
  Text,
  Toggle,
  Select,
  SelectItem,
  Button,
  ButtonGroup,
  Icon,
  Tab,
  TabView,
  Spinner,
} from '@ui-kitten/components';
import {launchCamera} from 'react-native-image-picker';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {KeyboardAvoidingView} from '../../components/keyboard-avoiding-view.component';
import {TextError} from '../../components/text-error.component';
import {ArrowIosBackIcon} from '../../components/icons';
import NoImage from '../../assets/svg/no-image';

import useAuth from '../auth/redux/hooks';
import useHome from '../home/redux/hooks';
import useCheckList from './redux/hooks';

const keyboardOffset = height =>
  Platform.select({
    android: 0,
    ios: height,
  });
import Osa from './checkListType/Osa';
import Procms from './checkListType/Procms';
import Prool from './checkListType/Prool';
import C2a from './checkListType/C2a';
export default ({navigation, route}) => {
  const {checkListId, checkListType, details} = route.params;
  const styles = useStyleSheet(themedStyle);
  const {loggedIn} = useAuth();
  const {mode, isConnected, updateNetInfo, updateMode} = useHome();
  const {isFetching, getTemplate, submitStock, isDone, resetStatusState} =
    useCheckList();
  const {
    control,
    handleSubmit,
    getValues,
    register,
    setValue,
    clearErrors,
    formState: {errors},
  } = useForm();

  const unsubscribe = NetInfo.addEventListener(state => {
    if (isConnected !== state.isInternetReachable) {
      updateNetInfo(state.isInternetReachable);
    }
    if (state.isInternetReachable === false && mode === 'online') {
      updateMode('offline');
    }
  });

  const template = getTemplate(checkListId);

  const isOsa = checkListType.toLowerCase() === 'osa';
  const isRental = checkListType.toLowerCase() === 'rental';
  const isProcms = checkListType.toLowerCase() === 'procms';
  const isNpd = checkListType.toLowerCase() === 'npd';
  const isOl = checkListType.toLowerCase() === 'ol';
  const isSos = checkListType.toLowerCase() === 'sos';
  const isProol = checkListType.toLowerCase() === 'prool';
  const isC2a = checkListType.toLowerCase() === 'c2a';

  const [formData, setFormData] = React.useState(null);
  const [photos, setPhotos] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    return () => unsubscribe();
  }, [unsubscribe]);

  React.useEffect(() => {
    if (!loggedIn) {
      navigation.replace('Auth');
    } else {
      register('photos', {required: false});
    }

    return () => {
      resetStatusState();
    };
  }, [loggedIn, navigation, register, resetStatusState]);

  React.useEffect(() => {
    if (photos.length > 0) {
      setValue('photos', photos);
      clearErrors('photos');
    }
  }, [clearErrors, photos, setValue]);

  React.useEffect(() => {
    if (isDone) {
      navigation.goBack();
    }
  }, [isDone, navigation]);

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
          const _list = [...photos, res.assets[0]];
          setPhotos(_list);
        }
      },
    );
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );

  const renderPhotoLibraries = React.useCallback(() => {
    return (
      <TopNavigationAction
        icon={<Icon name="image" />}
        onPress={() =>
          navigation.navigate('PhotoGallery', {
            photos: details.custom_attributes.fullscreen_photos,
          })
        }
      />
    );
  }, []);

  const renderImageItem = ({item}) => (
    <ListItem style={styles.itemImage}>
      <FastImage
        style={{
          width: '100%',
          height: Dimensions.get('screen').width / 3 - 2,
        }}
        source={{uri: item.uri}}
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
    alert(JSON.stringify(formData));
    return false;
    // submitStock(false, checkListId, details.id, data); //Cũ
    submitStock(false, checkListId, details.id, formData);
  };

  const filterError = Object.keys(template).filter(
    fieldName => errors[fieldName],
  );
  const oldScope = () => {
    return (
      <>
        {(isProcms || isProol) && (
          <View style={[styles.itemContainer, styles.rowItem]}>
            <Text style={styles.infoText}>Chương trình</Text>
            <Text style={styles.valueText}>{details.mechanic}</Text>
          </View>
        )}

        {(isOsa || isNpd) && (
          <View style={[styles.itemContainer, styles.rowItem]}>
            <Text style={styles.infoText}>Tồn kho tối thiểu</Text>
            <Text style={styles.valueText}>{details.quantity}</Text>
          </View>
        )}

        {(isNpd || isProcms || isOsa) && (
          <View style={[styles.itemContainer, styles.rowItem]}>
            <Text style={styles.infoText}>Barcode</Text>
            <Text style={styles.valueText}>
              {details.custom_attributes.barcode || ''}
            </Text>
          </View>
        )}
        {isOl && (
          <View style={[styles.itemContainer, styles.rowItem]}>
            <Text style={styles.infoText}>Đơn vị tính</Text>
            {/* <Text style={styles.infoText}>
                    {details.custom_attributes.sub_category_vn || ''}
                  </Text> */}
          </View>
        )}
        {(isSos || isC2a || isRental || isOl) && (
          <View
            style={[
              styles.itemContainer,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}>
            <Text style={styles.infoText}>Nhãn hiệu</Text>
            <Text style={styles.valueText}>
              {details.custom_attributes.brand || ''}
            </Text>
          </View>
        )}
        {isSos && (
          <View
            style={[styles.itemContainer, {justifyContent: 'space-between'}]}>
            <Text style={styles.infoText}>Quy tắc đo</Text>
            <Text style={[styles.valueText, {marginTop: 5}]}>
              {details.custom_attributes.measurement_instructions || ''}
            </Text>
          </View>
        )}
        {isProol && (
          <View
            style={[
              styles.itemContainer,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}>
            <Text style={styles.infoText}>Vị trí chấm điểm</Text>
            <Text style={styles.valueText}>
              {details.custom_attributes.location || ''}
            </Text>
          </View>
        )}
        {Object.keys(template).map(fieldName => {
          const label = template[fieldName].name;
          const type = template[fieldName].type;
          const required = template[fieldName].required;
          const defaultData = template[fieldName].default || '';
          let defaultValue = null;
          if (
            details &&
            details.data &&
            details.data[fieldName] &&
            details.data[fieldName] !== ''
          ) {
            defaultValue = details.data[fieldName];
          } else if (
            defaultData &&
            defaultData.field &&
            details[defaultData.field] &&
            details[defaultData.field] !== null
          ) {
            defaultValue = details[defaultData.field];
          } else if (defaultData && defaultData.defaultValue) {
            defaultValue = defaultData.defaultValue;
          } else {
            defaultValue = null;
          }

          if (type === 'number') {
            const {allow_negative} = template[fieldName];
            return (
              <View key={fieldName} style={styles.itemContainer}>
                <Text style={[styles.infoText, {marginBottom: 6}]}>
                  {label}
                </Text>
                <Controller
                  control={control}
                  rules={{required: required, min: !allow_negative && 0}}
                  render={({
                    field: {onChange, value},
                    fieldState: {invalid},
                  }) => (
                    <>
                      <Input
                        value={value}
                        keyboardType="numeric"
                        onChangeText={val => {
                          if (val.match(/^\d{0,}(\.\d{0,2})?$/)) {
                            onChange(val);
                          }
                        }}
                        status={invalid && 'danger'}
                        disabled={isFetching}
                      />
                      {invalid && <TextError>Cần nhập thông tin!</TextError>}
                    </>
                  )}
                  name={fieldName}
                  defaultValue={
                    defaultValue !== null ? defaultValue.toString() : ''
                  }
                />
              </View>
            );
          }
          if (type === 'input') {
            return (
              <View key={fieldName} style={styles.itemContainer}>
                <Text style={[styles.infoText, {marginBottom: 6}]}>
                  {label}
                </Text>
                <Controller
                  control={control}
                  rules={{required: required}}
                  render={({
                    field: {onChange, value},
                    fieldState: {invalid},
                  }) => (
                    <>
                      <Input
                        value={value}
                        onChangeText={onChange}
                        status={invalid && 'danger'}
                        disabled={isFetching}
                      />
                      {invalid && <TextError>Cần nhập thông tin!</TextError>}
                    </>
                  )}
                  name={fieldName}
                  defaultValue={
                    defaultValue !== null ? defaultValue.toString() : ''
                  }
                />
              </View>
            );
          }
          if (type === 'checkbox') {
            return (
              <View key={fieldName} style={styles.itemContainer}>
                <View style={styles.rowItem}>
                  <Text style={styles.infoText}>{label}</Text>
                  <Controller
                    control={control}
                    rules={{required: required}}
                    render={({field: {onChange, value}}) => (
                      <Toggle
                        checked={value}
                        onChange={onChange}
                        disabled={isFetching}
                      />
                    )}
                    name={fieldName}
                    defaultValue={defaultValue !== null ? defaultValue : false}
                  />
                </View>
                {errors[fieldName] && (
                  <TextError>Cần nhập thông tin!</TextError>
                )}
              </View>
            );
          }
          if (type === 'select') {
            return (
              <View key={fieldName} style={styles.itemContainer}>
                <Text style={[styles.infoText, {marginBottom: 6}]}>
                  {label}
                </Text>
                <Controller
                  control={control}
                  rules={{required: required}}
                  render={({
                    field: {onChange, value},
                    fieldState: {invalid},
                  }) => (
                    <>
                      <Select
                        selectedIndex={value}
                        onSelect={onChange}
                        disabled={isFetching}>
                        {template[fieldName].values.map(val => (
                          <SelectItem key={val} title={val} />
                        ))}
                      </Select>
                      {invalid && <TextError>Cần nhập thông tin!</TextError>}
                    </>
                  )}
                  name={fieldName}
                  defaultValue={defaultValue}
                />
              </View>
            );
          }
          if (type === 'radio') {
            return (
              <View key={fieldName} style={styles.itemContainer}>
                <View style={styles.rowItem}>
                  <Text
                    style={styles.infoText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {label}
                  </Text>
                  <Controller
                    control={control}
                    rules={{required: required}}
                    render={({field: {onChange, value}}) => (
                      <ButtonGroup size="small" status="basic">
                        {template[fieldName].values.map(val => (
                          <Button
                            key={val}
                            style={
                              (getValues(fieldName) === val || value === val) &&
                              styles.btnActive
                            }
                            onPress={() => onChange(val)}
                            disabled={isFetching}>
                            {val}
                          </Button>
                        ))}
                      </ButtonGroup>
                    )}
                    name={fieldName}
                    defaultValue={
                      defaultValue !== null ? defaultValue.toString() : ''
                    }
                  />
                </View>
                {errors[fieldName] && (
                  <TextError>Cần nhập thông tin!</TextError>
                )}
              </View>
            );
          }
          if (type === 'textarea') {
            return (
              <View key={fieldName} style={styles.itemContainer}>
                <Text style={[styles.infoText, {marginBottom: 6}]}>
                  {label}
                </Text>
                <Controller
                  control={control}
                  rules={{required: required}}
                  render={({
                    field: {onChange, value},
                    fieldState: {invalid},
                  }) => (
                    <>
                      <Input
                        value={value}
                        onChangeText={onChange}
                        status={invalid && 'danger'}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        textStyle={{minHeight: 100}}
                        disabled={isFetching}
                      />
                      {invalid && <TextError>Cần nhập thông tin!</TextError>}
                    </>
                  )}
                  name={fieldName}
                  defaultValue={
                    defaultValue !== null ? defaultValue.toString() : ''
                  }
                />
              </View>
            );
          }
        })}
      </>
    );
  };
  return (
    <SafeAreaLayout insets="top" style={styles.layout}>
      <TopNavigation
        title={({style, ...evaProps}) => (
          <Text {...evaProps} style={[style, styles.title]}>
            Kiểm tra lỗi
          </Text>
        )}
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={renderPhotoLibraries}
      />
      <TabView
        style={styles.layout}
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>
        <Tab
          style={{flexDirection: 'row-reverse'}}
          title="Thông tin"
          icon={
            filterError.length > 0 && (
              <Icon name="alert-circle" fill="#FF3D71" />
            )
          }>
          <KeyboardAvoidingView offset={keyboardOffset}>
            <View style={styles.container}>
              <View style={[styles.rowItem, styles.itemContainer]}>
                <View style={styles.imageContainer}>
                  {details.custom_attributes.thumbnail_uri ? (
                    <FastImage
                      style={styles.image}
                      source={{
                        uri: details.custom_attributes.thumbnail_uri,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  ) : (
                    <NoImage style={styles.image} />
                  )}
                </View>
              </View>
              <View style={styles.itemContainer}>
                <Text
                  style={styles.titleItem}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {details.custom_attributes.stock_name}
                </Text>
              </View>
              {/* <Text>{JSON.stringify(formData)}</Text> */}
              {isOsa ? (
                <Osa
                  styles={styles}
                  details={details}
                  control={control}
                  formData={formData}
                  setFormData={data => setFormData(data)}
                />
              ) : null}
              {isProcms ? (
                <Procms
                  styles={styles}
                  details={details}
                  control={control}
                  formData={formData}
                  setFormData={data => setFormData(data)}
                />
              ) : null}
              {isProol ? (
                <Prool
                  styles={styles}
                  details={details}
                  control={control}
                  formData={formData}
                  setFormData={data => setFormData(data)}
                />
              ) : null}
              {isC2a ? (
                <C2a
                  styles={styles}
                  details={details}
                  control={control}
                  formData={formData}
                  setFormData={data => setFormData(data)}
                />
              ) : (
                oldScope()
              )}
              {/* {oldScope()} */}
            </View>
          </KeyboardAvoidingView>
        </Tab>
        <Tab
          style={{flexDirection: 'row-reverse'}}
          title="Hình ảnh"
          icon={errors.photos && <Icon name="alert-circle" fill="#FF3D71" />}>
          <View style={styles.container}>
            {errors.photos && (
              <View style={{alignItems: 'center', paddingVertical: 16}}>
                <TextError>Cần chụp hình!</TextError>
              </View>
            )}
            <FlatList
              contentContainerStyle={{paddingHorizontal: 4, paddingTop: 8}}
              data={photos || []}
              renderItem={renderImageItem}
              keyExtractor={item => item.uri}
              numColumns={3}
            />
            <View style={styles.cameraWrapper}>
              <Button
                style={styles.camera}
                appearance="ghost"
                accessoryLeft={({style, ...evaProps}) => (
                  <Icon
                    {...evaProps}
                    name="camera"
                    style={[style, {width: 32, height: 32}]}
                  />
                )}
                children="Chụp hình"
                onPress={takePhoto}
                disabled={isFetching}
              />
            </View>
          </View>
        </Tab>
      </TabView>
      <SafeAreaLayout insets="bottom" style={styles.actionBtn}>
        <Button
          size="large"
          accessoryLeft={() => isFetching && <Spinner status="control" />}
          onPress={handleSubmit(onSubmit)}
          disabled={isFetching}>
          Gửi
        </Button>
      </SafeAreaLayout>
    </SafeAreaLayout>
  );
};

const themedStyle = StyleService.create({
  layout: {
    flex: 1,
  },
  title: {fontWeight: 'bold', color: 'color-primary-500'},
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  itemContainer: {
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: 'background-basic-color-1',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemDescription: {
    marginTop: 4,
  },
  titleItem: {
    fontWeight: 'bold',
    fontSize: 16,
    flexWrap: 'wrap',
    flex: 1,
  },
  description: {
    fontSize: 12,
  },
  detailsContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  text: {
    flex: 4,
    fontWeight: 'bold',
  },
  btnStyle: {
    backgroundColor: 'color-primary-default',
    borderColor: 'color-primary-default',
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 40,
    minWidth: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 120,
    left: 0,
  },
  btnTextStyle: {
    color: 'color-control-default',
    textAlign: 'center',
  },
  progressSteps: {
    progressBarColor: 'background-basic-color-1',
    activeStepIconBorderColor: 'color-primary-default',
    activeStepIconColor: 'background-basic-color-1',
    activeStepNumColor: 'transparent',
    activeLabelColor: 'color-primary-default',
    completedProgressBarColor: 'color-primary-default',
    completedStepIconColor: 'color-primary-default',
    completedCheckColor: 'transparent',
    completedLabelColor: 'color-primary-default',
    disabledStepIconColor: 'background-basic-color-1',
    disabledStepNumColor: 'transparent',
    topOffset: 10,
    marginBottom: 20,
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
  cameraWrapper: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'column',
  },
  infoText: {width: 'auto', height: 'auto', fontSize: 14, flex: 1},
  valueText: {width: 'auto', height: 'auto', fontSize: 14},
  wrapper: {paddingHorizontal: 4, width: 'auto', height: 'auto'},
  btnActive: {
    backgroundColor: 'color-primary-500',
  },
  actionBtn: {
    margin: 8,
  },
});

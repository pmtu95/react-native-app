import React from 'react';
import _ from 'lodash';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import {Platform, View} from 'react-native';
import {
  StyleService,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  List,
  ListItem,
  Input,
  Text,
  Icon,
  Button,
} from '@ui-kitten/components';
import ToggleSwitch from 'toggle-switch-react-native';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {ArrowIosBackIcon, SearchIcon} from '../../components/icons';
import NoImage from '../../assets/svg/no-image';

import {useDebounce} from '../../common/utils';
import useAuth from '../auth/redux/hooks';
import useHome from '../home/redux/hooks';
import useCheckList from './redux/hooks';

export default ({navigation, route}) => {
  const {checkListId, checkListType, checklist_items} = route.params;
  const styles = useStyleSheet(themedStyle);
  const {loggedIn} = useAuth();
  const {mode, isConnected, updateNetInfo, updateMode} = useHome();
  const {
    isFetching,
    isLoading,
    stocks,
    allStocks,
    categories,
    getTemplate,
    getStocks,
    saveAllStocks,
    clearStocks,
    saveCategories,
    submitStock,
  } = useCheckList();

  const unsubscribe = NetInfo.addEventListener(state => {
    if (isConnected !== state.isInternetReachable) {
      updateNetInfo(state.isInternetReachable);
    }
    if (state.isInternetReachable === false && mode === 'online') {
      updateMode('offline');
    }
  });

  const template = getTemplate(checkListId);

  const bottomSheetRef = React.useRef(null);
  const [page, setPage] = React.useState(0);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const [filterDone, setFilterDone] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');
  const debounceSearchTerm = useDebounce(searchValue, 100);

  const snapPoints = React.useMemo(() => ['50%', '75%'], []);

  React.useEffect(() => {
    return () => unsubscribe();
  }, [unsubscribe]);

  React.useEffect(() => {
    if (!loggedIn) {
      navigation.replace('Auth');
    } else {
      if (bottomSheetRef.current !== null) {
        bottomSheetRef.current.close();
      }
    }

    return () => clearStocks();
  }, [loggedIn, navigation, clearStocks]);

  React.useEffect(() => {
    if (checkListId || isRefresh) {
      saveAllStocks(checkListId, filterValue, filterDone, debounceSearchTerm);
      setPage(0);
      setIsRefresh(false);
    }
  }, [
    checkListId,
    saveAllStocks,
    isRefresh,
    filterValue,
    filterDone,
    debounceSearchTerm,
  ]);

  React.useEffect(() => {
    saveCategories(checkListId);
  }, [saveCategories, checkListId]);

  const renderBackAction = () => (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );

  const renderItem = React.useCallback(
    ({item}) => {
      return !isFetching ? (
        <ListItem
          style={styles.itemContainer}
          title={({style, ...evaProps}) => (
            <Text
              {...evaProps}
              style={[style, styles.titleItem]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {item.custom_attributes.stock_name}
            </Text>
          )}
          description={({style, ...evaProps}) => (
            <View style={style} {...evaProps}>
              {checkListType === 'osa' && item.data && item.data !== null && (
                <Text style={styles.description}>{`Barcode: ${
                  item.custom_attributes.barcode || ''
                }`}</Text>
              )}

              {checkListType === 'sos' && (
                <Text style={styles.description}>{`Ngành hàng: ${
                  item.custom_attributes.sub_category_vn || ''
                }`}</Text>
              )}
            </View>
          )}
          accessoryLeft={() => (
            <View style={styles.imageContainer}>
              {item.custom_attributes.thumbnail_uri !== null &&
              item.custom_attributes.thumbnail_uri !== '' ? (
                <FastImage
                  style={styles.image}
                  source={{
                    uri: item.custom_attributes.thumbnail_uri,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              ) : (
                <NoImage width={60} height={60} />
              )}
            </View>
          )}
          accessoryRight={props =>
            !_.isEmpty(item.data) ? (
              <Button
                style={{width: 30, backgroundColor: 'transparent'}}
                appearance="ghost"
                status="success"
                accessoryRight={evaProps => (
                  <Icon {...evaProps} name="checkmark-circle" />
                )}
              />
            ) : checkListType === 'osa' ? (
              <Button
                {...props}
                appearance="ghost"
                accessoryLeft={evaProps => (
                  <Icon {...evaProps} name="cloud-upload-outline" />
                )}
                onPress={() =>
                  submitStock(true, checkListId, item.id, item.data)
                }
              />
            ) : (
              <Button
                style={{width: 30, backgroundColor: 'transparent'}}
                appearance="ghost"
                status="basic"
                accessoryRight={evaProps => (
                  <Icon {...evaProps} name="edit-2-outline" />
                )}
              />
            )
          }
          onPress={() =>
            navigation.navigate('CheckError', {
              checkListId,
              checkListType,
              details: item,
            })
          }
        />
      ) : (
        <ListItem
          style={[styles.itemContainer, {paddingHorizontal: 0}]}
          title={({style, ...evaProps}) => (
            <View {...evaProps} style={[style, {marginBottom: 8}]}>
              <SkeletonPlaceholder {...styles.skeletonPlaceholder}>
                <SkeletonPlaceholder.Item height={12} />
              </SkeletonPlaceholder>
            </View>
          )}
          description={({style, ...evaProps}) => (
            <View style={style} {...evaProps}>
              <SkeletonPlaceholder {...styles.skeletonPlaceholder}>
                <SkeletonPlaceholder.Item
                  height={8}
                  width={150}
                  marginBottom={8}
                />
                <SkeletonPlaceholder.Item height={8} width={150} />
              </SkeletonPlaceholder>
            </View>
          )}
          accessoryLeft={({style, ...evaProps}) => (
            <View
              {...evaProps}
              style={[{width: 80, height: 80, marginHorizontal: 0}]}>
              <SkeletonPlaceholder {...styles.skeletonPlaceholder}>
                <SkeletonPlaceholder.Item height={80} width={80} />
              </SkeletonPlaceholder>
            </View>
          )}
        />
      );
    },
    [
      isFetching,
      styles,
      checkListType,
      template,
      submitStock,
      checkListId,
      navigation,
    ],
  );

  const keyExtractor = React.useCallback(item => item.id.toString(), []);

  const getItemLayout = React.useCallback(
    (data, index) => ({
      length: 80,
      offset: 80 * index,
      index,
    }),
    [],
  );

  const renderFooter = React.useCallback(
    () =>
      isLoading ? (
        <ListItem
          style={[styles.itemContainer, {paddingHorizontal: 0}]}
          title={({style, ...evaProps}) => (
            <View {...evaProps} style={[style, {marginBottom: 8}]}>
              <SkeletonPlaceholder {...styles.skeletonPlaceholder}>
                <SkeletonPlaceholder.Item height={12} />
              </SkeletonPlaceholder>
            </View>
          )}
          description={({style, ...evaProps}) => (
            <View style={style} {...evaProps}>
              <SkeletonPlaceholder {...styles.skeletonPlaceholder}>
                <SkeletonPlaceholder.Item
                  height={8}
                  width={150}
                  marginBottom={8}
                />
                <SkeletonPlaceholder.Item height={8} width={150} />
              </SkeletonPlaceholder>
            </View>
          )}
          accessoryLeft={({style, ...evaProps}) => (
            <View
              {...evaProps}
              style={[{width: 80, height: 80, marginHorizontal: 0}]}>
              <SkeletonPlaceholder {...styles.skeletonPlaceholder}>
                <SkeletonPlaceholder.Item height={80} width={80} />
              </SkeletonPlaceholder>
            </View>
          )}
        />
      ) : null,
    [isLoading, styles],
  );

  const renderListCategories = ({item}) => {
    return (
      <ListItem
        title={item}
        accessoryRight={evaProps =>
          item === filterValue ? (
            <Icon {...evaProps} name="radio-button-on" />
          ) : (
            <Icon {...evaProps} name="radio-button-off" />
          )
        }
        onPress={() => {
          setFilterValue(item);
          bottomSheetRef.current.close();
        }}
      />
    );
  };

  const renderBackdrop = React.useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleOpenPress = () => bottomSheetRef.current.snapToIndex(0);

  const handleLoadMore = () => {
    const increasePage = page + 1;
    if (increasePage < allStocks.length) {
      getStocks(increasePage);
      setPage(increasePage);
    }
  };

  return (
    <SafeAreaLayout insets="top" style={styles.layout}>
      <TopNavigation
        title={({style, ...evaProps}) => (
          <Text {...evaProps} style={[style, styles.title]}>
            Danh mục kiểm tra
          </Text>
        )}
        subtitle={({style, ...evaProps}) =>
          checkListType ? (
            <Text {...evaProps} style={[style, styles.subtitle]}>
              {checkListType}
            </Text>
          ) : null
        }
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={() => (
          <TopNavigationAction
            icon={<Icon name="camera" />}
            onPress={() =>
              navigation.navigate('Capture', {
                picture: [],
                checkListType,
                checkListId,
              })
            }
          />
        )}
      />
      <View style={styles.inputContainer}>
        <Input
          style={{flex: 1}}
          size="large"
          placeholder="Tìm kiếm"
          accessoryLeft={SearchIcon}
          onChangeText={value => setSearchValue(value)}
        />
        <View style={{paddingLeft: 8, justifyContent: 'center'}}>
          <ToggleSwitch
            {...styles.toggle}
            isOn={filterDone}
            onToggle={() => setFilterDone(!filterDone)}
            size="small"
          />
        </View>
        <Button
          style={{paddingHorizontal: 0, paddingVertical: 0}}
          size="large"
          appearance="ghost"
          status="basic"
          accessoryLeft={evaProps => <Icon {...evaProps} name="funnel" />}
          onPress={handleOpenPress}
        />
      </View>
      <List
        contentContainerStyle={styles.container}
        data={stocks?.length <= 0 ? checklist_items : stocks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={isRefresh}
        onRefresh={() => setIsRefresh(true)}
        getItemLayout={getItemLayout}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.2}
        onEndReached={handleLoadMore}
        windowSize={10}
        maxToRenderPerBatch={5}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={styles.bottomSheetIndicator}>
        <BottomSheetFlatList
          data={categories}
          renderItem={renderListCategories}
          keyExtractor={item => item}
        />
        <View
          style={{
            padding: 8,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Button
            status="danger"
            onPress={() => {
              setFilterValue('');
              bottomSheetRef.current.close();
            }}>
            Huỷ bộ lọc
          </Button>
        </View>
      </BottomSheet>
    </SafeAreaLayout>
  );
};

const themedStyle = StyleService.create({
  layout: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: 'color-primary-500',
  },
  subtitle: {
    textTransform: 'uppercase',
  },
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  itemContainer: {
    marginBottom: 8,
    minHeight: 80,
  },
  itemDescription: {
    marginTop: 4,
  },
  inputContainer: {
    borderWidth: 0,
    padding: 8,
    flexDirection: 'row',
  },
  titleItem: {
    fontWeight: 'bold',
    color: 'color-primary-500',
  },
  description: {
    fontSize: 12,
  },
  imageContainer: {
    width: 60,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  loadingWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  skeletonPlaceholder: {
    backgroundColor: 'background-basic-color-3',
    highlightColor: 'background-basic-color-1',
  },
  toggle: {
    onColor: 'color-success-default',
    offColor: 'color-basic-transparent-default-border',
  },
  bottomSheet: {
    backgroundColor: 'background-basic-color-1',
  },
  bottomSheetIndicator: {
    backgroundColor: 'background-alternative-color-1',
  },
});

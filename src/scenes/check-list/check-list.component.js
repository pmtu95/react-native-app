import React from 'react';
import _ from 'lodash';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NetInfo from '@react-native-community/netinfo';
import {View, Alert} from 'react-native';
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
  Modal,
  Card,
} from '@ui-kitten/components';
import * as Progress from 'react-native-progress';

import ActionButton from '../../components/action-button';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {ArrowIosBackIcon, SearchIcon} from '../../components/icons';

import {useDebounce} from '../../common/utils';
import useAuth from '../auth/redux/hooks';
import useHome from '../home/redux/hooks';
import useCheckIn from '../check-in/redux/hooks';
import useCheckList from './redux/hooks';

export default ({navigation}) => {
  const styles = useStyleSheet(themedStyle);
  const {loggedIn} = useAuth();
  const {
    mode,
    isConnected,
    updateNetInfo,
    updateMode,
    isSync,
    percent,
    syncData,
  } = useHome();
  const {checkInData} = useCheckIn();
  const {getCheckLists, isFetching, checkList} = useCheckList();

  const checkListNotSynced = checkList.filter(cl => cl.synced === false);
  const checkListNotCompleted = checkList.filter(cl => cl.completed === false);

  const unsubscribe = NetInfo.addEventListener(state => {
    if (isConnected !== state.isInternetReachable) {
      updateNetInfo(state.isInternetReachable);
    }
    if (state.isInternetReachable === false && mode === 'online') {
      updateMode('offline');
    }
  });

  const [isRefresh, setIsRefresh] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const debounceSearchTerm = useDebounce(searchValue, 1000);
  const lowercasedFilter = debounceSearchTerm.toLowerCase();
  const filteredData =
    checkList.length > 0 && lowercasedFilter !== ''
      ? checkList.filter(item => {
          return item.checklist_type.toLowerCase().includes(lowercasedFilter);
        })
      : checkList;

  React.useEffect(() => {
    return () => unsubscribe();
  }, [unsubscribe]);

  React.useEffect(() => {
    if (!loggedIn) {
      navigation.replace('Auth');
    } else if (checkInData && !isSync) {
      getCheckLists(checkInData?.shop_id);
    }
  }, [loggedIn, navigation, getCheckLists, checkInData, isSync]);

  React.useEffect(() => {
    if (isRefresh && checkInData) {
      getCheckLists(checkInData?.shop_id);
      setIsRefresh(false);
    }
  }, [isRefresh, getCheckLists, checkInData]);

  const renderBackAction = () => (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );

  const renderSyncAction = () => (
    <TopNavigationAction
      icon={<Icon name="cloud-upload-outline" />}
      onPress={() => syncData()}
    />
  );

  const renderItem = ({item}) =>
    !isFetching ? (
      <ListItem
        style={styles.itemContainer}
        title={({style, ...evaProps}) => (
          <Text {...evaProps} style={[style, styles.title, styles.titleItem]}>
            {item.checklist_type}
          </Text>
        )}
        description={item.description}
        accessoryRight={() =>
          item.completed && (
            <Button
              style={{width: 30, backgroundColor: 'transparent'}}
              appearance="ghost"
              status="success"
              accessoryRight={evaProps => (
                <Icon {...evaProps} name="done-all" />
              )}
            />
          )
        }
        onPress={() => {
          navigation.navigate('Stock', {
            checkListId: item.id,
            checkListType: item.checklist_type,
            checklist_items: _.chunk(item.checklist_items, 10)[0],
          });
        }}
      />
    ) : (
      <ListItem
        style={styles.itemContainer}
        title={({style, ...evaProps}) => (
          <View {...evaProps} style={[style, {marginBottom: 8}]}>
            <SkeletonPlaceholder {...styles.skeletonPlaceholder}>
              <SkeletonPlaceholder.Item height={12} width={80} />
            </SkeletonPlaceholder>
          </View>
        )}
        description={({style, ...evaProps}) => (
          <View style={style} {...evaProps}>
            <SkeletonPlaceholder {...styles.skeletonPlaceholder}>
              <SkeletonPlaceholder.Item
                height={8}
                width={200}
                marginBottom={8}
              />
            </SkeletonPlaceholder>
          </View>
        )}
      />
    );

  const checkNavigation = type => {
    if (isConnected) {
      if (type === 'checkout' && checkListNotSynced.length > 0) {
        Alert.alert(
          'Đồng bộ dữ liệu',
          'Bạn chưa đồng bộ dữ liệu. Hãy đồng bộ để hoàn tất công việc',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => syncData(),
            },
          ],
        );
      }
      navigation.navigate('CheckOut', {
        shopId: checkInData?.shop_id,
        shopName: checkInData?.name,
        type: type,
      });
    } else {
      Alert.alert('Mất kết nối mạng', 'Cần kết nối mạng để tiếp tục', [
        {
          text: 'OK',
        },
      ]);
    }
  };

  return (
    <>
      <SafeAreaLayout insets="top" style={styles.layout}>
        <TopNavigation
          title={({style, ...evaProps}) => (
            <Text {...evaProps} style={[style, styles.title]}>
              Danh mục
            </Text>
          )}
          subtitle={({style, ...evaProps}) =>
            checkInData?.name ? (
              <Text {...evaProps} style={style}>
                {checkInData?.name}
              </Text>
            ) : null
          }
          alignment="center"
          accessoryLeft={!checkInData?.shop_id && renderBackAction}
          accessoryRight={mode === 'offline' && renderSyncAction}
        />
        <View style={styles.inputContainer}>
          <Input
            size="large"
            placeholder="Tìm kiếm"
            accessoryLeft={SearchIcon}
            onChangeText={value => setSearchValue(value)}
          />
        </View>
        <List
          contentContainerStyle={styles.container}
          data={filteredData}
          renderItem={renderItem}
          refreshing={isRefresh}
          onRefresh={() => setIsRefresh(true)}
        />
        <ActionButton
          {...styles.actionButton}
          useNativeFeedback={true}
          fixNativeFeedbackRadius={true}
          backdrop={<View style={styles.backdrop} />}>
          {checkListNotCompleted.length <= 0 && (
            <ActionButton.Item
              {...styles.actionButtonItem}
              useNativeFeedback={false}
              title="Check out"
              onPress={() => checkNavigation('checkout')}>
              <Icon
                name="log-out-outline"
                fill="#fff"
                style={{width: 16, height: 16}}
              />
            </ActionButton.Item>
          )}
          <ActionButton.Item
            {...styles.actionButtonItem}
            useNativeFeedback={false}
            title="Báo cáo sự cố"
            onPress={() => checkNavigation('report')}>
            <Icon
              name="alert-circle-outline"
              fill="#fff"
              style={{width: 16, height: 16}}
            />
          </ActionButton.Item>
        </ActionButton>
      </SafeAreaLayout>
      <Modal visible={false} backdropStyle={styles.backdrop}>
        <Card disabled={true}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <Progress.Circle
              size={60}
              indeterminate={Number(percent) === 0}
              progress={Number(percent)}
              color="#E67832"
              direction="counter-clockwise"
              showsText
            />
          </View>
          <Text>Đang đồng bộ dữ liệu...</Text>
        </Card>
      </Modal>
    </>
  );
};

const themedStyle = StyleService.create({
  layout: {
    flex: 1,
  },
  title: {fontWeight: 'bold', color: 'color-primary-500'},
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  itemContainer: {
    marginBottom: 8,
    height: 64,
  },
  itemDescription: {
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: 'background-basic-color-1',
    borderWidth: 0,
    padding: 8,
  },
  titleItem: {
    textTransform: 'uppercase',
    color: 'color-primary-500',
    fontWeight: 'bold',
  },
  skeletonPlaceholder: {
    backgroundColor: 'background-basic-color-3',
    highlightColor: 'background-basic-color-1',
  },
  actionButton: {
    hideShadow: false,
    buttonColor: 'color-primary-500',
  },
  actionButtonItem: {
    size: 40,
    buttonColor: 'color-primary-600',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
  },
});

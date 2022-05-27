import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import {
  StyleService,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  List,
  ListItem,
  Input,
  Text,
} from '@ui-kitten/components';

import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {MenuIcon, SearchIcon} from '../../components/icons';

import useAuth from '../auth/redux/hooks';
import useShop from './redux/hooks';

export default ({navigation}) => {
  const styles = useStyleSheet(themedStyle);
  const {loggedIn, user_id} = useAuth();
  const {isFetching, shops, getShops} = useShop();

  const [isRefresh, setIsRefresh] = React.useState(false);

  React.useEffect(() => {
    if (!loggedIn) {
      navigation.replace('Auth');
    } else {
      getShops(user_id);
    }
  }, [loggedIn, navigation, getShops, user_id]);

  React.useEffect(() => {
    if (isRefresh) {
      getShops(user_id);
      setIsRefresh(false);
    }
  }, [isRefresh, getShops, user_id]);

  const renderDrawerAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={navigation.toggleDrawer} />
  );

  const renderItem = ({item}) =>
    !isFetching ? (
      <ListItem
        style={styles.itemContainer}
        title={({style, ...evaProps}) => (
          <Text {...evaProps} style={[style, styles.titleItem]}>
            {item.name}
          </Text>
        )}
        description={item.full_address}
        onPress={() =>
          navigation.navigate('CheckIn', {shopId: item.id, shopName: item.name})
        }
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

  return (
    <SafeAreaLayout insets="top" style={styles.layout}>
      <TopNavigation
        title={evaProps => (
          <Text {...evaProps} style={styles.title}>
            Cửa hàng
          </Text>
        )}
        alignment="center"
        accessoryLeft={renderDrawerAction}
      />
      <View style={styles.inputContainer}>
        <Input size="large" placeholder="Tìm kiếm" accessoryLeft={SearchIcon} />
      </View>
      <List
        contentContainerStyle={styles.contentStyle}
        data={shops}
        renderItem={renderItem}
        refreshing={isRefresh}
        onRefresh={() => setIsRefresh(true)}
      />
    </SafeAreaLayout>
  );
};

const themedStyle = StyleService.create({
  layout: {
    flex: 1,
  },
  title: {fontWeight: 'bold', color: 'color-primary-500'},
  contentStyle: {
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
  titleItem: {
    color: 'color-primary-500',
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: 'background-basic-color-1',
    borderWidth: 0,
    padding: 8,
  },
  skeletonPlaceholder: {
    backgroundColor: 'background-basic-color-3',
    highlightColor: 'background-basic-color-1',
  },
});

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Avatar,
  Divider,
  Drawer,
  DrawerItem,
  Layout,
  Text,
  Icon,
} from '@ui-kitten/components';
import {SettingsIcon} from '../../../components/icons';
import {SafeAreaLayout} from '../../../components/safe-area-layout.component';
import {AppInfoService} from '../../../services/app-info.service';
import useAuth from '../../auth/redux/hooks';

const version = AppInfoService.getVersion();
const build = AppInfoService.getBuildNumber();

export const HomeDrawer = ({navigation}) => {
  const {logout} = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const DATA = [
    {
      title: 'Cài đặt',
      icon: SettingsIcon,
      onPress: async () => {
        await navigation.toggleDrawer();
        await navigation.navigate('Settings');
      },
    },
    {
      title: 'Đăng xuất',
      icon: <Icon name="power-outline" />,
      onPress: async () => {
        await navigation.toggleDrawer();
        await logout();
      },
    },
  ];

  const renderHeader = () => (
    <SafeAreaLayout insets="top" level="2">
      <Layout style={styles.header} level="2">
        <View style={styles.profileContainer}>
          <Avatar
            shape="square"
            size="giant"
            source={require('../../../assets/images/logo_rounded.png')}
          />
          <Text style={styles.profileName} category="h6">
            Arthome OSA
          </Text>
        </View>
      </Layout>
    </SafeAreaLayout>
  );

  const renderFooter = () => (
    <SafeAreaLayout insets="bottom">
      <React.Fragment>
        <Divider />
        <View style={styles.footer}>
          <Text category="p2">{`Phiên bản ${version}.${build}`}</Text>
        </View>
      </React.Fragment>
    </SafeAreaLayout>
  );

  return (
    <Drawer
      header={renderHeader}
      footer={renderFooter}
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}>
      {DATA.map((el, index) => (
        <DrawerItem
          key={index}
          title={el.title}
          onPress={el.onPress}
          accessoryLeft={el.icon}
        />
      ))}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    marginHorizontal: 16,
  },
});

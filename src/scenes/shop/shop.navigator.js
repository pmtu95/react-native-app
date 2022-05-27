import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {HomeDrawer} from './extra/home-drawer.component';
import ShopScreen from './shop.component';

const Drawer = createDrawerNavigator();

const ShopNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false, gestureEnabled: true}}
      drawerContent={props => <HomeDrawer {...props} />}>
      <Drawer.Screen name="ShopDrawer" component={ShopScreen} />
    </Drawer.Navigator>
  );
};

export default ShopNavigator;

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ShopNavigator from '../shop/shop.navigator';
import CheckInScreen from '../check-in/check-in.component';
import CheckOutScreen from '../check-in/check-out.component';
import CheckListScreen from '../check-list/check-list.component';
import StockScreen from '../check-list/stock.component';
import CheckErrorScreen from '../check-list/check-error.component';
import CameraScreen from '../camera/camera.component';
import CaptureScreen from './capture.component';

import useCheckIn from '../check-in/redux/hooks';
import PhotoGalleryScreen from '../check-list/photo-gallery.component';

const Stack = createStackNavigator();

const HomeNavigator = () => {
  const {isCheckIn} = useCheckIn();
  const initialRouteName = isCheckIn ? 'CheckList' : 'Shop';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}>
      <Stack.Screen name="Shop" component={ShopNavigator} />
      <Stack.Screen name="CheckIn" component={CheckInScreen} />
      <Stack.Screen name="CheckOut" component={CheckOutScreen} />
      <Stack.Screen name="CheckList" component={CheckListScreen} />
      <Stack.Screen name="Stock" component={StockScreen} />
      <Stack.Screen name="CheckError" component={CheckErrorScreen} />
      <Stack.Screen name="Capture" component={CaptureScreen} />
      <Stack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

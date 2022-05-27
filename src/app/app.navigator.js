import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeNavigator from '../scenes/home/home.navigator';
import AuthNavigator from '../scenes/auth/auth.navigator';

import useAuth from '../scenes/auth/redux/hooks';

const Stack = createStackNavigator();

/*
 * Navigation theming: https://reactnavigation.org/docs/en/next/themes.html
 */

export const AppNavigator = ({colorScheme}) => {
  const {loggedIn} = useAuth();
  const initialRouteName = loggedIn ? 'Home' : 'Auth';

  const navigatorTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // prevent layout blinking when performing navigation
      background: colorScheme === 'light' ? 'transparent' : '#222B45',
    },
  };

  return (
    <NavigationContainer theme={navigatorTheme}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={initialRouteName}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Home" component={HomeNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

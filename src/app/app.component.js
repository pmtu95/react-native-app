import React from 'react';
import {AppearanceProvider, Appearance} from 'react-native-appearance';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {AppLoading} from './app-loading.component';
import {appMappings, appThemes} from './app-theming';
import {StatusBar} from '../components/status-bar.component';
import {SplashScreen} from '../scenes/home/splash.component';
import {AppNavigator} from './app.navigator';
import {getMapping, getTheme} from '../services/app-storage.service';
import {
  MappingContext,
  ThemeContext,
  useMapping,
  useTheming,
} from '../services/theme.service';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from '../common/store';

const loadingTasks = [
  () => getMapping(defaultConfig.mapping).then(result => ['mapping', result]),
  () => getTheme(defaultConfig.theme).then(result => ['theme', result]),
];
console.log(Appearance.getColorScheme());
const defaultConfig = {
  mapping: 'eva',
  theme:
    Appearance.getColorScheme() === 'no-preference'
      ? 'light'
      : Appearance.getColorScheme(),
};

const App = ({mapping, theme}) => {
  const colorScheme = Appearance.getColorScheme();
  const [mappingContext, currentMapping] = useMapping(appMappings, mapping);
  const [themeContext, currentTheme] = useTheming(appThemes, mapping, theme);
  const [barStyle, setBarStyle] = React.useState('default');

  React.useEffect(() => {
    setBarStyle(
      colorScheme === 'light' || colorScheme === 'no-preference'
        ? 'dark-content'
        : 'light-content',
    );
  }, [colorScheme]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IconRegistry icons={[EvaIconsPack]} />
        <AppearanceProvider>
          <ApplicationProvider {...currentMapping} theme={currentTheme}>
            <MappingContext.Provider value={mappingContext}>
              <ThemeContext.Provider value={themeContext}>
                <SafeAreaProvider>
                  <StatusBar barStyle={barStyle} />
                  <AppNavigator colorScheme={colorScheme} />
                </SafeAreaProvider>
              </ThemeContext.Provider>
            </MappingContext.Provider>
          </ApplicationProvider>
        </AppearanceProvider>
      </PersistGate>
    </Provider>
  );
};

const Splash = ({loading}) => <SplashScreen loading={loading} />;

export default () => (
  <AppLoading
    tasks={loadingTasks}
    initialConfig={defaultConfig}
    placeholder={Splash}>
    {props => <App {...props} />}
  </AppLoading>
);

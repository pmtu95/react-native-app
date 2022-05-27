import * as eva from '@eva-design/eva';
import {default as customEva} from './app-mapping-eva.json';
import {default as appTheme} from './app-theme.json';

export const appMappings = {
  eva: {
    mapping: eva.mapping,
    customMapping: customEva,
  },
};

export const appThemes = {
  eva: {
    light: {...eva.light, ...appTheme},
    dark: {...eva.dark, ...appTheme},
    brand: {
      light: appTheme,
      dark: appTheme,
    },
  },
};

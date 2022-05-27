import AsyncStorage from '@react-native-async-storage/async-storage';

const MAPPING_KEY = 'mapping';
const THEME_KEY = 'theme';

export const getMapping = async fallback => {
  return await AsyncStorage.getItem(MAPPING_KEY).then(mapping => {
    return mapping || fallback;
  });
};

export const getTheme = async fallback => {
  return await AsyncStorage.getItem(THEME_KEY).then(theme => {
    return theme || fallback;
  });
};

export const setMapping = mapping => {
  return AsyncStorage.setItem(MAPPING_KEY, mapping);
};

export const setTheme = theme => {
  return AsyncStorage.setItem(THEME_KEY, theme);
};

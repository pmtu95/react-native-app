import React from 'react';
import {Appearance} from 'react-native-appearance';
import {AppStorage} from './app-storage.service';

export const MappingContext = React.createContext(null);
export const ThemeContext = React.createContext(null);

export const useMapping = (mappings, mapping) => {
  const setCurrentMapping = nextMapping => {
    AppStorage.setMapping(nextMapping);
  };

  const isEva = () => {
    return mapping === 'eva';
  };

  const mappingContext = {
    currentMapping: mapping,
    setCurrentMapping,
    isEva,
  };

  return [mappingContext, mappings[mapping]];
};

export const useTheming = (themes, mapping, theme) => {
  const [currentTheme, setCurrentTheme] = React.useState(theme);

  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(preferences => {
      const appearanceTheme = createAppearanceTheme(
        preferences.colorScheme,
        theme,
      );
      setCurrentTheme(appearanceTheme);
    });

    return () => subscription.remove();
  }, [theme]);

  const isDarkMode = () => {
    return currentTheme === 'dark';
  };

  const createTheme = upstreamTheme => {
    return {
      ...themes[mapping][currentTheme],
      ...themes[mapping][upstreamTheme][currentTheme],
    };
  };

  const themeContext = {
    currentTheme,
    setCurrentTheme: nextTheme => {
      AppStorage.setTheme(nextTheme);
      setCurrentTheme(nextTheme);
    },
    isDarkMode,
    createTheme,
  };

  return [themeContext, themes[mapping][currentTheme]];
};

export const useTheme = upstreamTheme => {
  const themeContext = React.useContext(ThemeContext);
  return themeContext.createTheme(upstreamTheme);
};

const createAppearanceTheme = (appearance, preferredTheme) => {
  if (appearance === 'no-preference') {
    return preferredTheme;
  }
  return appearance;
};

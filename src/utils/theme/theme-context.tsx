import React from 'react';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useColorScheme} from 'react-native';
import {ThemeColors, getThemeColors} from './theme';
import {vars} from 'nativewind';
import {colorsToCssVars} from './css-vars';

const DEFAULT_SCHEME = 'dark';
const DEFAULT_THEME_COLORS = getThemeColors(DEFAULT_SCHEME);
const DEFAUL_CSS_VARS = vars(colorsToCssVars(DEFAULT_THEME_COLORS));

export const ThemeContext = createContext<{
  colors: ThemeColors;
  scheme: 'light' | 'dark';
  toggle: () => void;
}>({
  colors: DEFAULT_THEME_COLORS,
  scheme: DEFAULT_SCHEME,
  toggle: () => {},
});

export function ThemeProvider({children}: PropsWithChildren) {
  // TODO: store preferences.
  // Support for system, light and dark
  // Use a store slice (localPreferences or preferences.local) to store this in unsecureStorage
  const initialScheme = useColorScheme() || 'dark';
  const [scheme, setScheme] = useState<'light' | 'dark'>(initialScheme);

  const toggle = useCallback(() => {
    setScheme(scheme === 'light' ? 'dark' : 'light');
  }, [scheme]);

  const colors = useMemo(() => {
    return getThemeColors(scheme);
  }, [scheme]);

  useEffect(() => {
    NativeWindStyleSheet.setVariables(colorsToCssVars(colors));
  }, [colors]);

  return (
    <ThemeContext.Provider value={{colors, scheme, toggle}}>
      {children}
    </ThemeContext.Provider>
  );
}

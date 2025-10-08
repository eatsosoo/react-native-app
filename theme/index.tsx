import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors, { AppTheme } from '@/constants/Colors';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  colorScheme: ColorSchemeName;
  theme: AppTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'light',
  theme: Colors.light,
  themeMode: 'system',
  setThemeMode: async () => {}
});

const STORAGE_KEY = 'app_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Load saved theme mode on app start
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
          setThemeModeState(saved as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme mode:', error);
      }
    };
    loadThemeMode();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  };

  const colorScheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemScheme ?? 'light';
    }
    return themeMode;
  }, [themeMode, systemScheme]);

  const theme = useMemo(() => (colorScheme === 'dark' ? Colors.dark : Colors.light), [colorScheme]);

  return (
    <ThemeContext.Provider value={{ colorScheme, theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}



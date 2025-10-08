import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // For web, we'll use localStorage instead of AsyncStorage
  useEffect(() => {
    const loadThemeMode = () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const saved = window.localStorage.getItem('app_theme_mode');
          if (saved && ['light', 'dark', 'system'].includes(saved)) {
            setThemeModeState(saved as ThemeMode);
          }
        }
      } catch (error) {
        console.error('Failed to load theme mode:', error);
      }
    };
    loadThemeMode();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('app_theme_mode', mode);
      }
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

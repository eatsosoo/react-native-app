import React, { createContext, useContext, useMemo } from 'react';
import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';
import Colors, { AppTheme } from '@/constants/Colors';

type ThemeContextValue = {
  colorScheme: ColorSchemeName;
  theme: AppTheme;
};

const ThemeContext = createContext<ThemeContextValue>({ colorScheme: 'light', theme: Colors.light });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const colorScheme = systemScheme ?? 'light';
  const theme = useMemo(() => (colorScheme === 'dark' ? Colors.dark : Colors.light), [colorScheme]);

  return (
    <ThemeContext.Provider value={{ colorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}



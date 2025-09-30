import React from 'react';
import { SafeAreaView, ViewStyle } from 'react-native';
import { useAppTheme } from '@/theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function Screen({ children, style }: Props) {
  const { theme } = useAppTheme();
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: theme.background, padding: 16 }, style]}>
      {children}
    </SafeAreaView>
  );
}



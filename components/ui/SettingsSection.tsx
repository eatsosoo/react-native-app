import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: theme.muted }]}>{title}</Text>
      )}
      <View style={[styles.content, { backgroundColor: theme.surface }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  content: {
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
});

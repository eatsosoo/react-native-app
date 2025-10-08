import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/theme';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
}

export function SettingsItem({
  title,
  subtitle,
  onPress,
  rightElement,
  showArrow = true
}: SettingsItemProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text>
          )}
        </View>
        <View style={styles.rightContainer}>
          {rightElement}
          {showArrow && onPress && (
            <Text style={[styles.arrow, { color: theme.muted }]}>›</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    marginLeft: 8,
  },
});

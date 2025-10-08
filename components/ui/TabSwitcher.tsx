import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/theme';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function TabSwitcher({ tabs, activeTab, onTabChange }: TabSwitcherProps) {
  const { theme } = useAppTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.surface, borderColor: theme.border }
  ];

  return (
    <View style={containerStyle}>
      {tabs.map((tab, index) => {
        const tabStyle = [
          styles.tab,
          activeTab === index && { backgroundColor: theme.primary }
        ];

        const tabTextStyle = [
          styles.tabText,
          {
            color: activeTab === index ? theme.primaryForeground : theme.text
          }
        ];

        return (
          <TouchableOpacity
            key={index}
            style={tabStyle}
            onPress={() => onTabChange(index)}
            activeOpacity={0.7}
          >
            <Text style={tabTextStyle}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

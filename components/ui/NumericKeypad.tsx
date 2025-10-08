import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/theme';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
}

export function NumericKeypad({ onKeyPress }: NumericKeypadProps) {
  const { theme } = useAppTheme();

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['AC', '0', ''],
  ];

  const renderKey = (key: string, index: number) => {
    if (key === '') {
      return <View key={index} style={styles.keyContainer} />;
    }

    const keyButtonStyle = [
      styles.keyContainer,
      styles.keyButton,
      { backgroundColor: theme.surface, borderColor: theme.border }
    ];

    const keyTextStyle = [
      styles.keyText,
      {
        color: key === 'AC' ? theme.danger : theme.text,
        fontWeight: key === 'AC' ? '600' as const : '500' as const
      }
    ];

    return (
      <TouchableOpacity
        key={index}
        style={keyButtonStyle}
        onPress={() => onKeyPress(key)}
        activeOpacity={0.7}
      >
        <Text style={keyTextStyle}>
          {key}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => renderKey(key, keyIndex))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  keyContainer: {
    width: 80,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyButton: {
    borderWidth: 1,
    // Removed elevation and shadow properties for web compatibility
  },
  keyText: {
    fontSize: 24,
    fontWeight: '500',
  },
});

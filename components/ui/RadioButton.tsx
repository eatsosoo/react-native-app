import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/theme';

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
}

export function RadioButton({ selected, onPress }: RadioButtonProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.outerCircle, { borderColor: theme.border }]}>
        {selected && (
          <View style={[styles.innerCircle, { backgroundColor: theme.primary }]} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

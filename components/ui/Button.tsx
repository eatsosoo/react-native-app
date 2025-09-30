import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Button({ title, onPress, disabled, variant = 'primary', style, textStyle }: Props) {
  const { theme } = useAppTheme();

  const backgroundColor =
    variant === 'primary' ? theme.primary : variant === 'secondary' ? theme.secondary : 'transparent';
  const color =
    variant === 'ghost' ? theme.text : variant === 'secondary' ? theme.secondaryForeground : theme.primaryForeground;
  const borderColor = variant === 'ghost' ? theme.border : backgroundColor;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor,
          opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={[{ color, fontWeight: '600' }, textStyle]}>{title}</Text>
    </Pressable>
  );
}



import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useAppTheme } from '@/theme';

export default function Input(props: TextInputProps) {
  const { theme } = useAppTheme();
  return (
    <TextInput
      placeholderTextColor={theme.muted}
      style={{
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: theme.text,
        backgroundColor: theme.surface,
      }}
      {...props}
    />
  );
}



import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppTheme } from '@/theme';

type Props = {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  size?: number;
  color?: string;
};

export default function Icon({ name, size = 24, color }: Props) {
  const { theme } = useAppTheme();
  return <FontAwesome name={name} size={size} color={color ?? theme.text} />;
}



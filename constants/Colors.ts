const base = {
  white: '#ffffff',
  black: '#000000',
  grey100: '#f5f5f5',
  grey200: '#e5e7eb',
  grey400: '#9ca3af',
  grey700: '#374151',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  green500: '#22c55e',
  red500: '#ef4444',
  yellow500: '#eab308',
};

const light = {
  text: base.black,
  background: base.white,
  surface: base.white,
  border: base.grey200,
  muted: base.grey700,
  primary: base.black,
  primaryForeground: base.white,
  secondary: base.grey700,
  secondaryForeground: base.white,
  success: base.green500,
  danger: base.red500,
  warning: base.yellow500,
  tint: base.black,
  tabIconDefault: base.grey400,
  tabIconSelected: base.black,
  onDanger: base.white,
};

const dark = {
  text: base.white,
  background: '#0b0f16',
  surface: '#111827',
  border: '#1f2937',
  muted: base.grey400,
  primary: base.white,
  primaryForeground: base.black,
  secondary: base.grey400,
  secondaryForeground: base.black,
  success: base.green500,
  danger: base.red500,
  warning: base.yellow500,
  tint: base.white,
  tabIconDefault: base.grey400,
  tabIconSelected: base.white,
  onDanger: base.white,
};

export type AppTheme = typeof light;

const Colors = { light, dark } as const;

export default Colors;

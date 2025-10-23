import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useAppTheme } from '@/theme';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'small' | 'medium' | 'large';

export type OptionValue = string | number;
export type Option = {
  label: string;
  value: OptionValue;
  disabled?: boolean;
};

type Props = {
  options: Option[];
  value?: OptionValue | null;
  onChange: (value: OptionValue) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: Variant;
  // allow either "style" (common) or "styles" (you asked for it) — both merged
  style?: ViewStyle;
  styles?: ViewStyle;
  textStyle?: TextStyle;
  size?: Size;
  // optional prop to control if modal should close on select (default true)
  closeOnSelect?: boolean;
  // optional max height for options list
  maxOptionsHeight?: number;
};

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select',
  disabled = false,
  variant = 'ghost',
  style,
  styles: stylesProp,
  textStyle,
  size = 'medium',
  closeOnSelect = true,
  maxOptionsHeight = 320,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  );

  const backgroundColor =
    variant === 'primary' ? theme.primary : variant === 'secondary' ? theme.secondary : theme.surface;
  const color =
    variant === 'ghost' ? theme.text : variant === 'secondary' ? theme.secondaryForeground : theme.primaryForeground;
  const borderColor = variant === 'ghost' ? theme.border : backgroundColor;

  const paddingSize =
    size === 'small'
      ? { paddingHorizontal: 10, paddingVertical: 6, fontSize: 13 }
      : size === 'large'
      ? { paddingHorizontal: 18, paddingVertical: 14, fontSize: 17 }
      : { paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 };

  const openModal = () => {
    if (!disabled) setOpen(true);
  };
  const closeModal = () => setOpen(false);

  const handleSelect = (opt: Option) => {
    if (opt.disabled) return;
    onChange(opt.value);
    if (closeOnSelect) closeModal();
  };

  return (
    <>
      <Pressable
        onPress={openModal}
        disabled={disabled}
        style={({ pressed }) => [
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor,
            borderRadius: 8,
            borderWidth: 1,
            borderColor,
            paddingHorizontal: paddingSize.paddingHorizontal,
            paddingVertical: paddingSize.paddingVertical,
            opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
          },
          style,
          stylesProp,
        ]}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            { color: selectedOption ? color : theme.muted, fontSize: paddingSize.fontSize },
            textStyle,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>

        <Ionicons name={open ? 'chevron-up-outline' : 'chevron-down-outline' } />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={closeModal}>
        <TouchableOpacity
          activeOpacity={1}
          style={modalStyles.overlay}
          onPressOut={closeModal}
        >
          <View style={[modalStyles.modal, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={modalStyles.headerRow}>
              <Text style={[modalStyles.headerTitle, { color: theme.text }]}>{t('common.category')}</Text>
              <Pressable onPress={closeModal} style={modalStyles.closeBtn}>
                {/* <Text style={{ color: theme.muted }}>{t('common.close')}</Text> */}
                <Ionicons name='close' size={24} />
              </Pressable>
            </View>

            <FlatList
              style={{ maxHeight: maxOptionsHeight }}
              data={options}
              keyExtractor={(i) => String(i.value)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = selectedOption?.value === item.value;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    disabled={item.disabled}
                    style={({ pressed }) => [
                      modalStyles.optionRow,
                      {
                        backgroundColor: isSelected ? theme.primary : 'transparent',
                        opacity: item.disabled ? 0.5 : pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={[{ color: isSelected ? theme.primaryForeground : theme.text }]}>{item.label}</Text>
                    {isSelected ? <Text style={{ color: isSelected ? theme.primaryForeground : theme.muted }}>✓</Text> : null}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 6 }} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 640,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  optionRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '@/theme';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '../DatePicker';
import Separator from '../Separator';

export type Category = 'shopping' | 'healthcare' | 'foods' | 'entertainment';

export type TransactionTypeFilter = 'all' | 'income' | 'expense';

export interface TransactionFilters {
  startDate?: Date | null;
  endDate?: Date | null;
  categories: Category[]; // empty = all
  type: TransactionTypeFilter;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  initialFilters?: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
}

const ALL_CATEGORIES: { key: Category; label: string }[] = [
  { key: 'shopping', label: 'Shopping' },
  { key: 'healthcare', label: 'Health' },
  { key: 'foods', label: 'Foods' },
  { key: 'entertainment', label: 'Entertainment' },
];

const ALL_TYPES: TransactionTypeFilter[] = ['all', 'income', 'expense'];

export default function TransactionFilterModal({
  visible,
  onClose,
  initialFilters,
  onApply,
}: Props) {
  const { theme } = useAppTheme();

  const [startDate, setStartDate] = useState<Date>(initialFilters?.startDate ?? new Date());
  const [endDate, setEndDate] = useState<Date>(initialFilters?.endDate ?? new Date());
  const [categories, setCategories] = useState<Category[]>(initialFilters?.categories ?? []);
  const [type, setType] = useState<TransactionTypeFilter>(initialFilters?.type ?? 'all');

  const { t } = useTranslation();

  const toggleCategory = (c: Category) => {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const clearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setCategories([]);
    setType('all');
  };

  const apply = () => {
    onApply({
      startDate,
      endDate,
      categories,
      type,
    });
    onClose();
  };

  const formatDateTime = (d?: Date | null) => {
    if (!d) return '—';
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{t('common.filter')}</Text>

          {/* Date range */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>{t('common.start')}</Text>
            <DatePicker date={startDate} onDateChange={setStartDate} />

            <Text style={[styles.sectionLabel, { color: theme.text, marginTop: 12 }]}>{t('common.end')}</Text>
            <DatePicker date={endDate} onDateChange={setEndDate} />
          </View>

          {/* Category multi-select */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>{t('common.category')}</Text>
            <View style={styles.categoriesRow}>
              {ALL_CATEGORIES.map((c) => {
                const selected = categories.includes(c.key);
                return (
                  <Pressable
                    key={c.key}
                    onPress={() => toggleCategory(c.key)}
                    style={[
                      styles.catPill,
                      {
                        backgroundColor: selected ? theme.secondary : theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={{ color: selected ? theme.secondaryForeground : theme.text }}>
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Type */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>{t('common.type')}</Text>
            <View style={styles.typeRow}>
              {(['all', 'income', 'expense'] as TransactionTypeFilter[]).map((tt) => {
                const selected = tt === type;
                return (
                  <Pressable
                    key={tt}
                    onPress={() => setType(tt)}
                    style={[
                      styles.typeBtn,
                      {
                        backgroundColor: selected ? theme.secondary : theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={{ color: selected ? theme.secondaryForeground : theme.text }}>
                      {t('common.' + tt)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Separator />

          {/* Buttons */}
          <View style={styles.actionsRow}>
            <Button onPress={clearFilters} variant="ghost" title={t('common.clear')} />
            <Button onPress={onClose} variant="ghost" title={t('common.cancel')} />
            <Button onPress={apply} title={t('common.apply')} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 700,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
  },
  typeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8 as any,
    marginTop: 8,
  },
  ghostBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  applyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

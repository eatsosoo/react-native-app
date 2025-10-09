import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/theme';
import { useTransactions } from '@/contexts/TransactionContext';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { NumericKeypad } from '@/components/ui/NumericKeypad';
import { DatePicker } from '@/components/ui/DatePicker';
import { CategorySelector, Category } from '@/components/ui/CategorySelector';

type TransactionType = 'income' | 'expense';

export default function AddTransactionScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { addTransaction } = useTransactions();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(0);
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const transactionType: TransactionType = activeTab === 0 ? 'income' : 'expense';
  const tabs = [t('transaction.income'), t('transaction.expense')];

  const categories = [
    { key: 'shopping' as Category, label: t('categories.shopping') },
    { key: 'healthcare' as Category, label: t('categories.healthcare') },
    { key: 'foods' as Category, label: t('categories.foods') },
    { key: 'entertainment' as Category, label: t('categories.entertainment') },
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'AC') {
      setAmount('0');
      return;
    }

    if (amount === '0' && key !== '0') {
      setAmount(key);
    } else if (amount !== '0') {
      setAmount(prev => prev + key);
    }
  };

  const formatAmount = (value: string) => {
    const numValue = parseInt(value) || 0;
    return numValue.toLocaleString('vi-VN');
  };

  const getAmountColor = () => {
    if (transactionType === 'income') {
      return theme.success;
    }
    return theme.danger;
  };

  const getAmountPrefix = () => {
    return transactionType === 'income' ? '+' : '-';
  };

  const handleSave = () => {
    const amountValue = parseInt(amount) || 0;

    if (amountValue === 0) {
      Alert.alert('Error', 'Please enter an amount greater than 0');
      return;
    }

    addTransaction({
      type: transactionType,
      amount: amountValue,
      note: note.trim(),
      date: selectedDate,
      category: selectedCategory,
    });

    // Reset form
    setAmount('0');
    setNote('');
    setSelectedDate(new Date());
    setSelectedCategory(null);
    setActiveTab(0);

    // Navigate back
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Tab Switcher */}
        <TabSwitcher
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, { color: getAmountColor() }]}>
            {getAmountPrefix()}{formatAmount(amount)}
          </Text>
        </View>

        {/* Note Input */}
        <View style={styles.noteContainer}>
          <Text style={[styles.noteLabel, { color: theme.text }]}>
            {t('transaction.note')}
          </Text>
          <TextInput
            style={[
              styles.noteInput,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }
            ]}
            value={note}
            onChangeText={setNote}
            placeholder={t('transaction.note') + '...'}
            placeholderTextColor={theme.muted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Date Picker */}
        {/* <View style={styles.dateContainer}>
          <Text style={[styles.dateLabel, { color: theme.text }]}>
            {t('transaction.date')}
          </Text>
          <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
        </View> */}

        {/* Category Selector */}
        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryLabel, { color: theme.text }]}>
            {t('transaction.category')}
          </Text>
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            categories={categories}
          />
        </View>

        {/* Numeric Keypad */}
        <NumericKeypad onKeyPress={handleKeyPress} />

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={[styles.saveButtonText, { color: theme.primaryForeground }]}>
              {t('common.ok')}
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  amountContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noteContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  dateContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 10,
    marginHorizontal: 20,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  saveContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    // Removed elevation and shadow properties for web compatibility
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

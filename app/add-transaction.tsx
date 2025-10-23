import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/theme';
import { useTransactions } from '@/contexts/TransactionContext';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { NumericKeypad } from '@/components/ui/NumericKeypad';
import { DatePicker } from '@/components/ui/DatePicker';
import { CategorySelector, Category } from '@/components/ui/CategorySelector';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

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
    { value: 'shopping' as Category, label: t('categories.shopping') },
    { value: 'healthcare' as Category, label: t('categories.healthcare') },
    { value: 'foods' as Category, label: t('categories.foods') },
    { value: 'entertainment' as Category, label: t('categories.entertainment') },
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'AC') {
      setAmount('0');
      return;
    }

    if (amount === '0' && key !== '0') {
      setAmount(key);
    } else if (amount !== '0') {
      setAmount((prev) => prev + key);
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
      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amountText, { color: getAmountColor() }]}>
          {getAmountPrefix()}
          {formatAmount(amount)}
        </Text>
      </View>

      {/* Note Input */}
      <View style={styles.noteContainer}>
        <TextInput
          style={[
            styles.noteInput,
            {
              backgroundColor: theme.background,
              borderColor: theme.background,
              color: theme.text,
            },
          ]}
          value={note}
          onChangeText={setNote}
          placeholder={t('transaction.note') + '...'}
          placeholderTextColor={theme.muted}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, gap: 8 }}>
        {/* Date Picker */}
        <View style={styles.dateContainer}>
          {/* <Text style={[styles.dateLabel, { color: theme.text }]}>{t('transaction.date')}</Text> */}
          <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
        </View>

        {/* Category Selector */}
        <View style={styles.categoryContainer}>
          {/* <Text style={[styles.categoryLabel, { color: theme.text }]}>
            {t('transaction.category')}
          </Text> */}
          <Select
            options={categories}
            value={selectedCategory}
            placeholder={t('common.category')}
            onChange={(v) => setSelectedCategory(v)}
          />
        </View>
      </View>

      {/* Numeric Keypad */}
      <NumericKeypad onKeyPress={handleKeyPress} />

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <Button title={t('common.ok')} onPress={handleSave} />
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
    flex: 1,
    // marginHorizontal: 20,
    // marginBottom: 10,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryContainer: {
    flex: 1,
    // marginBottom: 10,
    // marginHorizontal: 20,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  saveContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
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

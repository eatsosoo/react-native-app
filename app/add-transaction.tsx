import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/theme';
import { useTransactions } from '@/contexts/TransactionContext';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { NumericKeypad } from '@/components/ui/NumericKeypad';

type TransactionType = 'income' | 'expense';

export default function AddTransactionScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { addTransaction } = useTransactions();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(0);
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');

  const transactionType: TransactionType = activeTab === 0 ? 'income' : 'expense';
  const tabs = [t('transaction.income'), t('transaction.expense')];

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
    });

    // Reset form
    setAmount('0');
    setNote('');
    setActiveTab(0);

    // Navigate back
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={[styles.title, { color: theme.text }]}>
          {t('transaction.add')}
        </Text>

        {/* Tab Switcher */}
        <TabSwitcher
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, { color: getAmountColor() }]}>
            {getAmountPrefix()}{formatAmount(amount)}đ
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
            placeholder={t('transaction.note')}
            placeholderTextColor={theme.muted}
            multiline
            numberOfLines={3}
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
      </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  amountContainer: {
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noteContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
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
  saveContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    // Removed elevation and shadow properties for web compatibility
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

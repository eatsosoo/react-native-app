import Button from '@/components/ui/Button';
import { Category, CategorySelector } from '@/components/ui/CategorySelector';
import { useAppTheme } from '@/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';

interface AddBudgetModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave?: (data: BudgetData) => void;
}

interface BudgetData {
  month: number; // 1-12
  year: number;
  amount: number;
  category: Category;
}



const currentDate = new Date();

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ visible, onCancel, onSave }) => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<Category>('shopping');

  const categories = [
    { key: 'shopping' as Category, label: t('transaction.categories.shopping') },
    { key: 'healthcare' as Category, label: t('transaction.categories.healthcare') },
    { key: 'foods' as Category, label: t('transaction.categories.foods') },
    { key: 'entertainment' as Category, label: t('transaction.categories.entertainment') },
  ];

  // For year picker: allow current year +/- 2 years
  const years = [
    currentDate.getFullYear() - 2,
    currentDate.getFullYear() - 1,
    currentDate.getFullYear(),
    currentDate.getFullYear() + 1,
    currentDate.getFullYear() + 2,
  ];

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleSave = () => {
    const data: BudgetData = {
      month,
      year,
      amount: Number(amount),
      category,
    };
    console.log('Budget Data:', data);
    if (onSave) onSave(data);
    onCancel(); // Close modal after saving
  };

  return (
    <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>

      {/* Month/Year Picker */}
      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Month</Text>
          <View style={styles.picker}>
            {months.map((m, idx) => (
              <Pressable
                key={m}
                style={[styles.pickerItem, {
                  backgroundColor: month === idx + 1 ? theme.primary : theme.surface,
                  borderColor: theme.border,
                }]}
                onPress={() => setMonth(idx + 1)}
              >
                <Text style={[{ color: month === idx + 1 ? theme.primaryForeground : theme.secondary }]}>{m}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Year</Text>
          <View style={styles.picker}>
            {years.map((y) => (
              <Pressable
                key={y}
                style={[styles.pickerItem, {
                  backgroundColor: year === y ? theme.primary : theme.surface,
                  borderColor: theme.border,
                }]}
                onPress={() => setYear(y)}
              >
                <Text style={[{ color: year === y ? theme.primaryForeground : theme.secondary }]}>{y}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          }]}
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      {/* Category Selector */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Category</Text>
        <CategorySelector
          selectedCategory={category}
          onCategorySelect={setCategory}
          categories={categories}
        />
      </View>


      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button title='Cancel' style={styles.buttonItem} variant='ghost' onPress={onCancel} />
        <Button
          title='Save'
          style={styles.buttonItem}
          onPress={handleSave}
          disabled={!amount || isNaN(Number(amount))}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,

  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  pickerItem: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    margin: 2,
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: '#2e86de',
  },
  selectedText: {
    fontWeight: '700',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 6,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 30,
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  buttonItem: {
    flex: 1,
  }
});

export default AddBudgetModal;

import React, { useState } from 'react';
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

type Category = 'Shopping' | 'Health' | 'Foods' | 'Entertainment';

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

const categories: Category[] = ['Shopping', 'Health', 'Foods', 'Entertainment'];

const currentDate = new Date();

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ visible, onCancel, onSave }) => {
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<Category>('Shopping');

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
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Add New Budget</Text>

        {/* Month/Year Picker */}
        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Month</Text>
            <View style={styles.picker}>
              {months.map((m, idx) => (
                <Pressable
                  key={m}
                  style={[styles.pickerItem, month === idx + 1 && styles.pickerItemSelected]}
                  onPress={() => setMonth(idx + 1)}
                >
                  <Text style={month === idx + 1 ? styles.selectedText : undefined}>{m}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Year</Text>
            <View style={styles.picker}>
              {years.map((y) => (
                <Pressable
                  key={y}
                  style={[styles.pickerItem, year === y && styles.pickerItemSelected]}
                  onPress={() => setYear(y)}
                >
                  <Text style={year === y ? styles.selectedText : undefined}>{y}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {/* Category Selector */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.picker}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.pickerItem, category === cat && styles.pickerItemSelected]}
                onPress={() => setCategory(cat)}
              >
                <Text style={category === cat ? styles.selectedText : undefined}>{cat}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={!amount || isNaN(Number(amount))}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
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
    margin: 2,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  pickerItemSelected: {
    backgroundColor: '#2e86de',
  },
  selectedText: {
    color: 'white',
    fontWeight: '700',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 18,
  },
  input: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 6,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#b2bec3',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#44bd32',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default AddBudgetModal;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '@/theme';
import { useTranslation } from 'react-i18next';
import Button from './Button';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'ios') {
      // On iOS, DateTimePicker stays open, so only close on cancel
      if (event.type === 'set' && selectedDate) {
        // setShowPicker(false);
        onDateChange(selectedDate);
      }
      if (event.type === 'dismissed') {
        setShowPicker(false);
      }
    } else {
      // setShowPicker(false);
      if (selectedDate) {
        onDateChange(selectedDate);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }
        ]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dateText, { color: theme.text }]}>
          {formatDate(date)}
        </Text>
        <Text style={[styles.calendarIcon, { color: theme.muted }]}>
          📅
        </Text>
      </TouchableOpacity>

      {/* Modal for picker */}
      {showPicker && (
        <Modal
          transparent
          animationType="fade"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                style={styles.picker}
              />
              <Button title={t('common.close')} onPress={() => setShowPicker(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calendarIcon: {
    fontSize: 18,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
  },
  picker: {
    width: '100%',
  },
  closeBtn: {
    marginTop: 18,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});

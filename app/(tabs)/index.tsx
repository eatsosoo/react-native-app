import { Pressable, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAppTheme } from '@/theme';
import { useTransactions } from '@/contexts/TransactionContext';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function TabOneScreen() {
  const { theme } = useAppTheme();
  const colorScheme = useColorScheme();

  const { getBalance, getTotalIncome, getTotalExpense } = useTransactions();

  const balance = getBalance();
  const income = getTotalIncome();
  const expense = getTotalExpense();

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('vi-VN');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance Tracker</Text>

      <View style={[styles.balanceContainer, { backgroundColor: theme.surface }]}>
        <Text style={[styles.balanceLabel, { color: theme.muted }]}>Balance</Text>
        <Text style={[styles.balanceAmount, { color: balance >= 0 ? theme.success : theme.danger }]}>
          {balance >= 0 ? '+' : ''}{formatAmount(balance)}đ
        </Text>
      </View>

      {/* Income/Expense Summary */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryItem, { backgroundColor: theme.surface }]}>
          <Text style={[styles.summaryLabel, { color: theme.muted }]}>Income</Text>
          <Text style={[styles.summaryAmount, { color: theme.success }]}>
            +{formatAmount(income)}đ
          </Text>
        </View>
        <View style={[styles.summaryItem, { backgroundColor: theme.surface }]}>
          <Text style={[styles.summaryLabel, { color: theme.muted }]}>Expense</Text>
          <Text style={[styles.summaryAmount, { color: theme.danger }]}>
            -{formatAmount(expense)}đ
          </Text>
        </View>
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}

      {/* Floating Action Button */}
      <Link href="/add-transaction" asChild>
        <Pressable style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.5 : 1 }
        ]}>
          {/* <Ionicons name="add" size={22} color="#000" style={styles.icon} /> */}
          <Text style={styles.label}>New Transaction</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  balanceContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    // Removed elevation and shadow properties for web compatibility
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    // Removed elevation and shadow properties for web compatibility
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    // Removed elevation and shadow properties for web compatibility
  },
  button: {
    flexDirection: 'row',          // 🔹 Icon + Text cùng hàng
    alignItems: 'center',          // 🔹 Căn giữa theo chiều dọc
    justifyContent: 'center',      // 🔹 (tuỳ chọn) căn giữa ngang
    borderWidth: 1,                // 🔹 Viền
    borderColor: '#ccc',           // 🔹 Màu viền
    borderRadius: 8,               // 🔹 Bo góc
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
});

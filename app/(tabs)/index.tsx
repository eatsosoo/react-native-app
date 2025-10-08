import { Pressable, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAppTheme } from '@/theme';
import { useTransactions } from '@/contexts/TransactionContext';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primary }]}>Finance Tracker</Text>

      <View style={[styles.balanceContainer, { backgroundColor: theme.surface }]}>
        <Text style={[styles.balanceLabel, { color: theme.muted }]}>Balance</Text>
        <Text
          style={[styles.balanceAmount, { color: balance >= 0 ? theme.success : theme.danger }]}
        >
          {balance >= 0 ? '+' : ''}
          {formatAmount(balance)}đ
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
      <View style={[styles.actionContainer, { backgroundColor: theme.background }]}>
        <Link href="/add-transaction" asChild style={styles.actionItem}>
          <Button title="New Transaction" variant="ghost" />
        </Link>
        <Button title="New Budget" variant="ghost" style={styles.actionItem} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  balanceContainer: {
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
    // paddingHorizontal: 20,
    justifyContent: 'space-between',
    // marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
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
    width: '90%',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '90%',
    gap: 12,
  },
  actionItem: {
    // width: '50%'
  },
});

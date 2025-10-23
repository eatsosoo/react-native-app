import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { useAppTheme } from '@/theme';
import TransactionFilterModal, {
  Category,
  TransactionFilters,
  TransactionTypeFilter,
} from '@/components/ui/modal/TransactionFilterModal';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

type Transaction = {
  id: string;
  createdAt: Date;
  transactionDate: Date;
  category: Category;
  title: string;
  amount: number; // positive numbers; type determines sign in UI
  type: 'income' | 'expense';
};

const FAKE_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    createdAt: new Date(2025, 9, 18, 9, 15),
    transactionDate: new Date(2025, 9, 17),
    category: 'shopping',
    title: 'Buy shoes',
    amount: 1200000,
    type: 'expense',
  },
  {
    id: 't2',
    createdAt: new Date(2025, 9, 18, 10, 0),
    transactionDate: new Date(2025, 9, 18),
    category: 'foods',
    title: 'Grocery',
    amount: 450000,
    type: 'expense',
  },
  {
    id: 't3',
    createdAt: new Date(2025, 9, 19, 8, 30),
    transactionDate: new Date(2025, 9, 19),
    category: 'healthcare',
    title: 'Pharmacy refund',
    amount: 200000,
    type: 'income',
  },
  {
    id: 't4',
    createdAt: new Date(2025, 9, 20, 14, 45),
    transactionDate: new Date(2025, 9, 20),
    category: 'entertainment',
    title: 'Movie night Movie night Movie night Movie night',
    amount: 180000,
    type: 'expense',
  },
];

export default function TransactionsScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    startDate: undefined,
    endDate: undefined,
    categories: [],
    type: 'all',
  });

  const flatListRef = useRef<FlatList>(null);

  const filtered = useMemo(() => {
    return FAKE_TRANSACTIONS.filter((tx) => {
      // date filter based on transactionDate
      if (filters.startDate && tx.transactionDate < filters.startDate) return false;
      if (filters.endDate && tx.transactionDate > filters.endDate) return false;

      // category filter
      if (
        filters.categories &&
        filters.categories.length > 0 &&
        !filters.categories.includes(tx.category)
      ) {
        return false;
      }

      // type filter
      if (filters.type === 'income' && tx.type !== 'income') return false;
      if (filters.type === 'expense' && tx.type !== 'expense') return false;

      return true;
    });
  }, [filters]);

  const formatDateTime = (d: Date) =>
    d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const applyFilters = (f: TransactionFilters) => {
    console.log('Applying filters:', f);
    setFilters(f);
    setFilterVisible(false);

    // scroll to top of list when filters change
    setTimeout(() => {
      flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true });
    }, 50);
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'income';
    const amountText = `${isIncome ? '+' : '-'}${item.amount.toLocaleString()}`;
    return (
      <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.left}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.meta, { color: theme.muted }]}>
            Date: {item.transactionDate.toLocaleDateString('vi-VN')}
          </Text>
          <Text style={[styles.meta, { color: theme.muted }]}>
            Category: {t(`categories.${item.category}`) ?? item.category}
          </Text>

          <Text style={[styles.meta, { color: theme.muted, marginTop: 8 }]}>
            {formatDateTime(item.createdAt)}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.amount, { color: isIncome ? '#2ecc71' : '#e74c3c' }]}>
            {amountText}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          style={[styles.filterBtn, { borderColor: theme.border }]}
        >
          {/* <Text style={{ color: theme.text }}>Filter</Text> */}
          <Ionicons name="options-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={{ color: theme.muted }}>No transactions</Text>
          </View>
        )}
      />

      <TransactionFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        initialFilters={filters}
        onApply={(f) => applyFilters(f)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  row: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flex: 1, paddingRight: 12 },
  right: { width: 110, alignItems: 'flex-end' },
  title: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  meta: { fontSize: 12 },
  amount: { fontSize: 16, fontWeight: '600' },
  empty: { padding: 24, alignItems: 'center' },
});

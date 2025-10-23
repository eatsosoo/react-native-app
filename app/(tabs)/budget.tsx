import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useAppTheme } from '@/theme';
import { Category } from '@/components/ui/CategorySelector';
import { useTranslation } from 'react-i18next';
import Collapse from '@/components/ui/Collapse';
import Separator from '@/components/ui/Separator';
import Button from '@/components/ui/Button';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fakeBudgets: { category: Category; initialAmount: number; usedAmount: number }[] = [
  { category: 'shopping', initialAmount: 3000000, usedAmount: 1800000 },
  { category: 'foods', initialAmount: 3500000, usedAmount: 3700000 },
  { category: 'healthcare', initialAmount: 1000000, usedAmount: 500000 },
  { category: 'entertainment', initialAmount: 2000000, usedAmount: 2200000 },
  { category: 'travel', initialAmount: 2000000, usedAmount: 65000 },
  { category: 'learning', initialAmount: 2000000, usedAmount: 500000 },
  { category: 'house', initialAmount: 2000000, usedAmount: 10000 },
];

const getMonthYearOptions = () => {
  const now = new Date();
  const year = now.getFullYear();
  const options = [];
  for (let month = 1; month <= 12; month++) {
    options.push({ month, year });
  }
  return options;
};

const MonthlyBudgetScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  const monthYearOptions = getMonthYearOptions();
  const currentIdx = monthYearOptions.findIndex(
    (m) => m.month === new Date().getMonth() + 1 && m.year === new Date().getFullYear(),
  );
  const [selectedIdx, setSelectedIdx] = useState(currentIdx);

  // For demo, budgets are fixed
  const budgets = fakeBudgets;

  const getCategoryLabel = (cat: Category) => cat.charAt(0).toUpperCase() + cat.slice(1);

  const selMonth = monthYearOptions[selectedIdx].month;
  const selYear = monthYearOptions[selectedIdx].year;

  const ITEM_WIDTH = 100; // Ước lượng width của mỗi month item, hoặc lấy giá trị thực tế nếu bạn biết

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: ITEM_WIDTH * selectedIdx, animated: true });
    }
  }, [selectedIdx]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Month Picker */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.monthPicker}
        contentContainerStyle={styles.monthPickerContent}
      >
        {monthYearOptions.map((m, idx) => (
          <Pressable
            key={`${m.year}-${m.month}`}
            style={[
              styles.monthPickerItem,
              idx === selectedIdx && { backgroundColor: theme.primary },
            ]}
            onPress={() => setSelectedIdx(idx)}
          >
            <Text
              style={{ color: idx === selectedIdx ? theme.primaryForeground : theme.secondary }}
            >
              {months[m.month - 1]} {m.year}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Budget Blocks */}
      <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={styles.budgetList}>
        {budgets.map((item) => {
          const percent = Math.min(item.usedAmount / item.initialAmount, 1);
          const overLimit = item.usedAmount > item.initialAmount;
          return (
            <View
              key={item.category}
              style={[styles.budgetBlock, overLimit && styles.budgetBlockOver]}
            >
              <Collapse
                title={getCategoryLabel(item.category)}
                defaultExpanded={true}
                borderColor={overLimit ? theme.danger : theme.border}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <View>
                    <Text style={[styles.budgetAmount, { color: theme.secondary }]}>
                      {t('budget.initial')}: {item.initialAmount.toLocaleString()}
                    </Text>
                    <Text style={[styles.budgetAmount, { color: theme.secondary }]}>
                      {t('budget.used')}: {item.usedAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.percentText,
                        { color: overLimit ? theme.danger : theme.muted },
                      ]}
                    >
                      {((item.usedAmount / item.initialAmount) * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${percent * 100}%`,
                        backgroundColor: overLimit ? theme.danger : theme.warning,
                      },
                    ]}
                  />
                  <View style={styles.progressBarBg} />
                </View>

                {overLimit ? (
                  <View>
                    <Separator />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <Button
                        title={t('common.edit')}
                        variant="ghost"
                        size="small"
                        onPress={() => console.log('Edit')}
                        style={{ width: 70, backgroundColor: theme.danger }}
                        textStyle={{ color: theme.onDanger }}
                      />
                    </View>
                  </View>
                ) : null}
              </Collapse>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthPicker: {
    paddingHorizontal: 8,
    flexGrow: 0,
  },
  monthPickerContent: {
    marginVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  monthPickerItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginHorizontal: 2,
    height: 32,
    backgroundColor: '#f0f0f0',
  },
  budgetList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    justifyContent: 'flex-start',
  },
  budgetBlock: {
    // borderWidth: 2,
    borderRadius: 14,
    marginBottom: 14,
  },
  budgetBlockOver: {
    borderColor: '#e74c3c', // fallback red if theme.danger not present
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  budgetAmount: {
    fontSize: 14,
    marginBottom: 2,
  },
  progressBarContainer: {
    height: 12,
    width: '100%',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 12,
    borderRadius: 8,
    zIndex: 1,
  },
  progressBarBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 12,
    backgroundColor: '#e1e1e1',
    borderRadius: 8,
    zIndex: 0,
  },
  percentText: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default MonthlyBudgetScreen;

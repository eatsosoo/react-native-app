import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '@/theme';

export type Category = 'shopping' | 'healthcare' | 'foods' | 'entertainment';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
  categories: { key: Category; label: string }[];
}

export function CategorySelector({ selectedCategory, onCategorySelect, categories }: CategorySelectorProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key;

          return (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: isSelected ? theme.primary : theme.surface,
                  borderColor: theme.border,
                }
              ]}
              onPress={() => onCategorySelect(category.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: isSelected ? theme.primaryForeground : theme.secondary
                  }
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 20,
    // marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    // minWidth: 80,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

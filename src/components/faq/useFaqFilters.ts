import { useMemo, useState } from 'react';
import { FAQCategoryCount, FAQItem } from './types';

export const useFaqFilters = (
  items: FAQItem[],
  defaultCategory: string = 'all'
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const categoryCount: FAQCategoryCount = useMemo(
    () =>
      items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as FAQCategoryCount),
    [items]
  );

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => matchesFilters(item, searchQuery, selectedCategory))
        .sort((a, b) => a.question.localeCompare(b.question)),
    [items, searchQuery, selectedCategory]
  );

  const toggleItem = (itemId: string) => {
    setActiveItemId((prev) => (prev === itemId ? null : itemId));
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeItemId,
    setActiveItemId,
    filteredItems,
    categoryCount,
    toggleItem,
  };
};

const matchesFilters = (
  item: FAQItem,
  searchQuery: string,
  selectedCategory: string
) => {
  const normalizedQuery = searchQuery.toLowerCase();
  const matchesSearch =
    normalizedQuery.length === 0 ||
    item.question.toLowerCase().includes(normalizedQuery) ||
    item.answer.toLowerCase().includes(normalizedQuery) ||
    item.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery));

  const matchesCategory =
    selectedCategory === 'all' || item.category === selectedCategory;

  return matchesSearch && matchesCategory;
};

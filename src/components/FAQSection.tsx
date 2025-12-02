import React from 'react';
import { FaqHeader } from './faq/FaqHeader';
import { FaqSearch } from './faq/FaqSearch';
import { FaqCategoryTabs } from './faq/FaqCategoryTabs';
import { FaqEmptyState } from './faq/FaqEmptyState';
import { FaqSupport } from './faq/FaqSupport';
import { FaqList } from './faq/FaqList';
import { useFaqFilters } from './faq/useFaqFilters';
import { FAQSectionProps } from './faq/types';

const FAQSection: React.FC<FAQSectionProps> = ({
  items,
  categories,
  defaultCategory = 'all',
  onContactSupport,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeItemId,
    filteredItems,
    categoryCount,
    toggleItem,
  } = useFaqFilters(items, defaultCategory);

  const hasResults = filteredItems.length > 0;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <FaqHeader />

        <FaqSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <FaqCategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalItems={items.length}
          categoryCount={categoryCount}
        />

        {hasResults ? (
          <FaqList
            items={filteredItems}
            activeItemId={activeItemId}
            onToggle={toggleItem}
          />
        ) : (
          <FaqEmptyState
            searchQuery={searchQuery}
            onContactSupport={onContactSupport}
          />
        )}

        {onContactSupport && hasResults && (
          <FaqSupport onContactSupport={onContactSupport} />
        )}
      </div>
    </div>
  );
};

export default FAQSection;

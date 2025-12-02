type Props = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  totalItems: number;
  categoryCount: Record<string, number>;
};

export const FaqCategoryTabs = ({
  categories,
  selectedCategory,
  onSelectCategory,
  totalItems,
  categoryCount,
}: Props) => (
  <div className="mb-8 overflow-x-auto">
    <div className="flex space-x-2 min-w-max">
      <CategoryTab
        label="Todas"
        count={totalItems}
        active={selectedCategory === 'all'}
        onClick={() => onSelectCategory('all')}
      />
      {categories.map((category) => (
        <CategoryTab
          key={category}
          label={category}
          count={categoryCount[category] || 0}
          active={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
        />
      ))}
    </div>
  </div>
);

const CategoryTab = ({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      active
        ? 'bg-green-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label} ({count})
  </button>
);

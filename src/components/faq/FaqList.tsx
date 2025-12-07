// Use simple CSS show/hide for FAQ items, avoid framer-motion
import { FAQItem } from './types';

type Props = {
  items: FAQItem[];
  activeItemId: string | null;
  onToggle: (id: string) => void;
};

export const FaqList = ({ items, activeItemId, onToggle }: Props) => (
  <div className="space-y-4">
    {items.map((item) => (
      <FaqItem
        key={item.id}
        item={item}
        active={activeItemId === item.id}
        onToggle={onToggle}
      />
    ))}
  </div>
);

const FaqItem = ({
  item,
  active,
  onToggle,
}: {
  item: FAQItem;
  active: boolean;
  onToggle: (id: string) => void;
}) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <button
      onClick={() => onToggle(item.id)}
      className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <span className="font-medium text-gray-900">{item.question}</span>
      <svg
        className={`w-5 h-5 text-gray-500 transition-transform ${
          active ? 'transform rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    {active && (
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

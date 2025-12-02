export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}

export interface FAQCategoryCount {
  [key: string]: number;
}

export interface FAQSectionProps {
  items: FAQItem[];
  categories: string[];
  defaultCategory?: string;
  onContactSupport?: () => void;
}

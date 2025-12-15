import React, { useMemo } from 'react';
// Use CSS for breadcrumb appearance instead of framer-motion
import { BreadcrumbItem, BreadcrumbSeparator } from './Breadcrumbs.helpers';
import BreadcrumbStructuredData from './product/BreadcrumbStructuredData';

interface BreadcrumbItemData {
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItemData[];
  className?: string;
  separator?: React.ReactNode;
  structured?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  separator = (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
  structured = true,
}) => {
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: { '@id': item.path, name: item.label },
      })),
    }),
    [items]
  );

  return (
    <>
      {structured && <BreadcrumbStructuredData data={jsonLd} />}
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex items-center flex-wrap">
          {items.map((item, index) => (
            <React.Fragment key={item.path}>
              <BreadcrumbItem
                label={item.label}
                path={item.path}
                isCurrentPage={item.isCurrentPage}
              />
              {index < items.length - 1 && (
                <BreadcrumbSeparator separator={separator} />
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;

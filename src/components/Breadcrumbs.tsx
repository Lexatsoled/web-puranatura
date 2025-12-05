import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { sanitizeHtml } from '../utils/sanitizer';
import { BreadcrumbItem, BreadcrumbSeparator } from './Breadcrumbs.helpers';

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
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.1 },
    },
  };

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

  const structuredData = useMemo(
    () => sanitizeHtml(JSON.stringify(jsonLd)),
    [jsonLd]
  );

  return (
    <>
      {structured && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}
      <nav aria-label="Breadcrumb" className={className}>
        <motion.ol
          className="flex items-center flex-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
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
        </motion.ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;

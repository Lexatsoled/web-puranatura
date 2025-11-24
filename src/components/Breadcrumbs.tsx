import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sanitizeHtml } from '../utils/sanitizer';

interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  structured?: boolean; // Para datos estructurados de Schema.org
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
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': item.path,
          name: item.label,
        },
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
              <motion.li variants={itemVariants} className="flex items-center">
                {item.isCurrentPage ? (
                  <span
                    className="text-gray-500 font-medium"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-green-600 hover:text-green-700 hover:underline font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </motion.li>
              {index < items.length - 1 && (
                <motion.li
                  variants={itemVariants}
                  className="mx-2 text-gray-400"
                  aria-hidden="true"
                >
                  {separator}
                </motion.li>
              )}
            </React.Fragment>
          ))}
        </motion.ol>
      </nav>

      {/* Breadcrumbs movil */}
      <nav aria-label="Breadcrumb" className={`md:hidden mt-2 ${className}`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center"
        >
          {items.length > 2 ? (
            <>
              <Link
                to={items[0].path}
                className="text-green-600 hover:text-green-700 hover:underline font-medium transition-colors"
              >
                {items[0].label}
              </Link>
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
              <span className="text-gray-500">...</span>
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
              <span className="text-gray-500 font-medium" aria-current="page">
                {items[items.length - 1].label}
              </span>
            </>
          ) : (
            items.map((item, index) => (
              <React.Fragment key={item.path}>
                {item.isCurrentPage ? (
                  <span
                    className="text-gray-500 font-medium"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-green-600 hover:text-green-700 hover:underline font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
                {index < items.length - 1 && (
                  <span className="mx-2 text-gray-400" aria-hidden="true">
                    {separator}
                  </span>
                )}
              </React.Fragment>
            ))
          )}
        </motion.div>
      </nav>
    </>
  );
};

export default Breadcrumbs;

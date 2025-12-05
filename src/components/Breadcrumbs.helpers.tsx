import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface BreadcrumbItemProps {
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  label,
  path,
  isCurrentPage,
}) => (
  <motion.li variants={itemVariants} className="flex items-center">
    {isCurrentPage ? (
      <span className="text-gray-500 font-medium" aria-current="page">
        {label}
      </span>
    ) : (
      <Link
        to={path}
        className="text-green-600 hover:text-green-700 hover:underline font-medium transition-colors"
      >
        {label}
      </Link>
    )}
  </motion.li>
);

export const BreadcrumbSeparator: React.FC<{
  separator: React.ReactNode;
}> = ({ separator }) => (
  <motion.li
    variants={itemVariants}
    className="mx-2 text-gray-400"
    aria-hidden="true"
  >
    {separator}
  </motion.li>
);

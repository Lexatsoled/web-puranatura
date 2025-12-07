import React from 'react';
import { Link } from 'react-router-dom';
// Using CSS/Tailwind transitions instead of framer-motion for simple breadcrumb

export interface BreadcrumbItemProps {
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

// Keep markup simple — CSS handles hover/appearance animations.

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  label,
  path,
  isCurrentPage,
}) => (
  <li className="flex items-center transition-all duration-150 ease-out transform -translate-x-1 opacity-0 animate-breadcrumb-in">
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
  </li>
);

export const BreadcrumbSeparator: React.FC<{
  separator: React.ReactNode;
}> = ({ separator }) => (
  <li className="mx-2 text-gray-400" aria-hidden="true">
    {separator}
  </li>
);

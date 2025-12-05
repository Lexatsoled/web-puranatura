import React from 'react';

interface BreadcrumbStructuredDataProps {
  sanitizedJson: string;
}

const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({
  sanitizedJson,
}) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: sanitizedJson }}
  />
);

export default BreadcrumbStructuredData;

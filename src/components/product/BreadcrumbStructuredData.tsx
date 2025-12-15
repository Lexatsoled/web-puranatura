import React from 'react';
import { safeJSONLDSerialization } from '../../utils/security';

interface BreadcrumbStructuredDataProps {
  data: any;
}

const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({
  data,
}) => (
  <script
    type="application/ld+json"
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: safeJSONLDSerialization(data) }}
  />
);

export default BreadcrumbStructuredData;

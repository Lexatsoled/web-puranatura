import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface WithAnalyticsProps {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  metadata?: Record<string, any>;
}

export function withAnalytics<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  analyticsProps: WithAnalyticsProps | ((props: P) => WithAnalyticsProps)
) {
  return function WithAnalyticsWrapper(props: P) {
    const { trackEvent } = useAnalytics();

    const handleAnalytics = () => {
      const eventProps = typeof analyticsProps === 'function' 
        ? analyticsProps(props) 
        : analyticsProps;

      trackEvent({
        category: eventProps.eventCategory,
        action: eventProps.eventAction,
        label: eventProps.eventLabel,
        value: eventProps.eventValue,
        metadata: eventProps.metadata,
      });
    };

    return (
      <WrappedComponent
        {...props}
        onAnalytics={handleAnalytics}
      />
    );
  };
}

// HOC específico para productos
export function withProductAnalytics<P extends { product: { id: string; name: string; price: number } }>(
  WrappedComponent: React.ComponentType<P>
) {
  return withAnalytics(WrappedComponent, (props: P) => ({
    eventCategory: 'product',
    eventAction: 'view',
    eventLabel: props.product.name,
    eventValue: props.product.price,
    metadata: {
      productId: props.product.id,
      productPrice: props.product.price,
    },
  }));
}

// HOC específico para páginas
export function withPageAnalytics<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  pageName: string
) {
  return withAnalytics(WrappedComponent, {
    eventCategory: 'page_view',
    eventAction: 'view',
    eventLabel: pageName,
  });
}

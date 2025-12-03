import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { OptimizedImage } from '../OptimizedImage';

type Props = {
  product: Product;
  index: number;
  showDifferences: boolean;
  differentFeatures: string[];
  onRemove: (id: string) => void;
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export const ProductCardCompare: React.FC<Props> = ({
  product,
  index,
  showDifferences,
  differentFeatures,
  onRemove,
}) => (
  <motion.div
    key={product.id}
    className="w-72 flex-shrink-0"
    initial="enter"
    animate="center"
    exit="exit"
    variants={slideVariants}
    custom={index}
    transition={{
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    }}
  >
    <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
      <OptimizedImage
        src={product.images[0].full}
        alt={product.name}
        className="object-cover w-full h-full"
        aspectRatio={1}
      />
      <button
        onClick={() => onRemove(product.id)}
        className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
        aria-label="Eliminar de la comparación"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
    <div className="text-xl font-bold text-green-600 mb-4">
      DOP ${product.price.toFixed(2)}
    </div>

    <div className="space-y-3">
      {!showDifferences &&
        product.benefits?.map((benefit) => (
          <BenefitRow key={benefit} icon="check" text={benefit} />
        ))}

      {showDifferences &&
        differentFeatures.map((feature) => {
          const hasFeature = product.benefits?.includes(feature);
          return (
            <BenefitRow
              key={feature}
              icon={hasFeature ? 'check' : 'x'}
              text={feature}
              highlight={!hasFeature}
            />
          );
        })}
    </div>
  </motion.div>
);

const BenefitRow = ({
  icon,
  text,
  highlight = false,
}: {
  icon: 'check' | 'x';
  text: string;
  highlight?: boolean;
}) => (
  <div
    className={`flex items-start text-sm ${
      highlight ? 'text-red-600' : 'text-gray-600'
    }`}
  >
    {icon === 'check' ? (
      <svg
        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ) : (
      <svg
        className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    )}
    <span>{text}</span>
  </div>
);

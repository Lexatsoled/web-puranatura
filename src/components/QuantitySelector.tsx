import React, { useState } from 'react';

interface QuantitySelectorProps {
  min?: number;
  max?: number;
  value?: number;
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white';
  disabled?: boolean;
}

/**
 * QuantitySelector component for selecting product quantity with accessibility and best practices.
 *
 * @component
 * @param {QuantitySelectorProps} props - Props for QuantitySelector
 * @returns {JSX.Element}
 */
const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  min = 1,
  max = 3,
  value = 1,
  onChange,
  size = 'sm',
  variant = 'default',
  disabled = false,
}) => {
  const [quantity, setQuantity] = useState(value);

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-8',
          button: 'w-6 h-6 text-xs',
          input: 'w-8 h-6 text-xs',
        };
      case 'md':
        return {
          container: 'h-10',
          button: 'w-8 h-8 text-sm',
          input: 'w-10 h-8 text-sm',
        };
      case 'lg':
        return {
          container: 'h-12',
          button: 'w-10 h-10 text-base',
          input: 'w-12 h-10 text-base',
        };
      default:
        return {
          container: 'h-8',
          button: 'w-6 h-6 text-xs',
          input: 'w-8 h-6 text-xs',
        };
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'white':
        return {
          container: 'bg-white border-gray-300 shadow-sm',
          button: 'text-gray-700 hover:bg-gray-50 border-gray-300',
          input: 'text-gray-900 bg-white',
        };
      case 'default':
      default:
        return {
          container: 'bg-transparent border-gray-300',
          button: 'text-gray-600 hover:bg-gray-50 border-gray-300',
          input: 'text-gray-700 bg-transparent',
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  return (
    <div
      className={`flex items-center border rounded-lg ${sizeClasses.container} ${variantClasses.container} ${disabled ? 'opacity-50' : ''}`}
      role="group"
      aria-label="Selector de cantidad"
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className={`${sizeClasses.button} flex items-center justify-center border-r ${variantClasses.button} disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors`}
        aria-label="Disminuir cantidad"
        title="Disminuir cantidad"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </button>

      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const newValue = parseInt(e.target.value) || min;
          const clampedValue = Math.max(min, Math.min(max, newValue));
          setQuantity(clampedValue);
          onChange(clampedValue);
        }}
        min={min}
        max={max}
        disabled={disabled}
        aria-label="Cantidad"
        aria-live="polite"
        className={`${sizeClasses.input} text-center border-0 focus:outline-none focus:ring-0 font-medium ${variantClasses.input}`}
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className={`${sizeClasses.button} flex items-center justify-center border-l ${variantClasses.button} disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors`}
        aria-label="Aumentar cantidad"
        title="Aumentar cantidad"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
    </div>
  );
};

export default QuantitySelector;

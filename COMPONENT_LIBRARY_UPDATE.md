# Component Library Update with Modern Design Patterns

## Overview

This document outlines the comprehensive update to the Pureza Naturalis component library, implementing modern design patterns, improved accessibility, and enhanced user experience.

## Design System Integration

### CSS Custom Properties (Design Tokens)

```css
/* Design Tokens - Add to index.css */
:root {
  /* Colors */
  --color-primary-50: #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e;
  --color-primary-600: #16a34a;
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;

  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;

  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:
    0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:
    0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}
```

## Updated Button Component

### Enhanced Button Variants

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-sm hover:shadow-md',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-green-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5 min-h-[36px]',
    md: 'px-4 py-2 text-base rounded-md gap-2 min-h-[44px]',
    lg: 'px-6 py-3 text-lg rounded-lg gap-2 min-h-[52px]',
    xl: 'px-8 py-4 text-xl rounded-lg gap-3 min-h-[60px]'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    loading && 'cursor-wait',
    className
  );

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className={`animate-spin ${iconSizes[size]}`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className={iconSizes[size]}>{icon}</span>
      )}
      <span className={loading ? 'ml-2' : ''}>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className={iconSizes[size]}>{icon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
```

## Card Component with Modern Design

### Enhanced Card Component

```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'default',
  size = 'md',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'bg-white rounded-lg transition-all duration-200';

  const variantClasses = {
    default: 'border border-gray-200 shadow-sm',
    elevated: 'shadow-lg border border-gray-100',
    outlined: 'border-2 border-gray-300',
    filled: 'bg-gray-50 border border-gray-200'
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    paddingClasses[padding],
    hoverClasses,
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';
```

### Card Subcomponents

```typescript
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`pb-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`py-4 ${className}`}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

// Export subcomponents
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
```

## Form Components with Better UX

### Enhanced Input Component

```typescript
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  size = 'md',
  fullWidth = false,
  variant = 'default',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'transition-all duration-200 focus:outline-none';

  const variantClasses = {
    default: 'border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
    filled: 'bg-gray-100 border border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
    outlined: 'border-2 border-gray-300 focus:border-green-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-3 text-base rounded-md',
    lg: 'px-4 py-3 text-lg rounded-lg'
  };

  const iconPadding = startIcon || endIcon ? {
    sm: startIcon && endIcon ? 'pl-9 pr-9' : startIcon ? 'pl-9' : 'pr-9',
    md: startIcon && endIcon ? 'pl-11 pr-11' : startIcon ? 'pl-11' : 'pr-11',
    lg: startIcon && endIcon ? 'pl-11 pr-11' : startIcon ? 'pl-11' : 'pr-11'
  } : '';

  const inputClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    iconPadding[size],
    fullWidth && 'w-full',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    className
  );

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {startIcon}
            </span>
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />

        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {endIcon}
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
```

### Select Component

```typescript
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  size = 'md',
  fullWidth = false,
  variant = 'default',
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'transition-all duration-200 focus:outline-none appearance-none bg-no-repeat';

  const variantClasses = {
    default: 'border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
    filled: 'bg-gray-100 border border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
    outlined: 'border-2 border-gray-300 focus:border-green-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 pr-8 text-sm rounded-md',
    md: 'px-4 py-3 pr-10 text-base rounded-md',
    lg: 'px-4 py-3 pr-10 text-lg rounded-lg'
  };

  const selectClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    className
  );

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
```

## Modal Component with Better UX

### Enhanced Modal Component

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'bottom-sheet';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };

  const variantClasses = {
    default: 'mx-4 my-6',
    'bottom-sheet': 'mx-0 mb-0 mt-16 rounded-t-2xl rounded-b-none'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <motion.div
          ref={modalRef}
          initial={variant === 'bottom-sheet' ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
          animate={variant === 'bottom-sheet' ? { y: 0 } : { scale: 1, opacity: 1 }}
          exit={variant === 'bottom-sheet' ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${variantClasses[variant]}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
                {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
```

## Loading and Skeleton Components

### Loading Spinner

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-green-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
```

### Skeleton Loader

```typescript
interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = ''
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Skeleton components for common patterns
const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = ''
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '60%' : '100%'}
      />
    ))}
  </div>
);

const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Card className={className}>
    <div className="space-y-4">
      <Skeleton variant="rectangular" height={200} />
      <div className="space-y-2">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={60} height={32} />
      </div>
    </div>
  </Card>
);

Skeleton.Text = SkeletonText;
Skeleton.Card = SkeletonCard;
```

## Toast/Notification Component

### Enhanced Toast Component

```typescript
interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'info',
  duration = 5000,
  action,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration, id, onClose]);

  const variantStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      description: 'text-green-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      description: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      description: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      description: 'text-blue-700'
    }
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`max-w-sm w-full ${variantStyles[variant].bg} border ${variantStyles[variant].border} rounded-lg shadow-lg pointer-events-auto`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${variantStyles[variant].icon}`}>
            {icons[variant]}
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={`text-sm font-medium ${variantStyles[variant].title}`}>
                {title}
              </p>
            )}
            {description && (
              <p className={`mt-1 text-sm ${variantStyles[variant].description}`}>
                {description}
              </p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`text-sm font-medium ${variantStyles[variant].title} hover:underline`}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 300);
              }}
              className={`inline-flex ${variantStyles[variant].description} hover:${variantStyles[variant].title} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <motion.div
            className={`h-full ${variant === 'success' ? 'bg-green-500' :
                              variant === 'error' ? 'bg-red-500' :
                              variant === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}
    </motion.div>
  );
};
```

## Implementation Strategy

### Component Organization

```
src/components/
   ui/                    # Base UI components
      Button/
         Button.tsx
         Button.stories.tsx
         index.ts
      Card/
      Input/
      Modal/
      Spinner/
      Skeleton/
      Toast/
   forms/                 # Form components
   feedback/              # User feedback components
   layout/                # Layout components
```

### Storybook Integration

```typescript
// Button.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Save',
    icon: <SaveIcon className="w-4 h-4" />,
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Saving...',
    loading: true,
  },
};
```

### Testing Strategy

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('is accessible', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
```

## Migration Strategy

### Phase 1: Foundation (Week 1-2)

- [ ] Update CSS custom properties and design tokens
- [ ] Create base Button, Card, and Input components
- [ ] Update existing components to use new design system
- [ ] Add Storybook stories for new components

### Phase 2: Enhancement (Week 3-4)

- [ ] Implement Modal, Select, and form components
- [ ] Add loading states and skeleton components
- [ ] Create Toast notification system
- [ ] Update component documentation

### Phase 3: Integration (Week 5-6)

- [ ] Replace old components with new ones across the app
- [ ] Update styling and theming
- [ ] Add accessibility improvements
- [ ] Performance optimizations

### Phase 4: Testing & Polish (Week 7-8)

- [ ] Comprehensive testing of all components
- [ ] Cross-browser compatibility testing
- [ ] Accessibility audit and fixes
- [ ] Performance monitoring and optimization

## Success Metrics

### Developer Experience

- **Component Usage**: Percentage of components using the new design system
- **Development Speed**: Time to create new UI components
- **Code Consistency**: Reduction in styling inconsistencies
- **Maintenance Cost**: Ease of updating component styles

### User Experience

- **Visual Consistency**: Improved perceived quality
- **Interaction Feedback**: Better user feedback on interactions
- **Accessibility Score**: WCAG compliance improvements
- **Performance**: Reduced bundle size and improved loading times

### Business Impact

- **Conversion Rate**: Impact on user actions and conversions
- **User Satisfaction**: Improved user feedback scores
- **Development Velocity**: Faster feature development
- **Maintenance Savings**: Reduced technical debt

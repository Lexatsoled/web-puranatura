import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useCheckoutStore } from '../store/checkoutStore';
import ShippingForm from '../components/ShippingForm';
import { useNavigate } from 'react-router-dom';
import { OptimizedImage } from '../components/OptimizedImage';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { currentStep, orderSummary, calculateOrderSummary } =
    useCheckoutStore();

  const resolveProductImage = (
    product: (typeof cart.items)[number]['product'],
  ) => {
    const [primary] = product.images ?? [];
    return (
      primary?.full ||
      primary?.thumbnail ||
      '/placeholder-product.jpg'
    );
  };

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.items.length === 0) {
      navigate('/tienda');
      return;
    }

    // Calculate order summary
    calculateOrderSummary(cart);
  }, [cart, navigate, calculateOrderSummary]);

  const stepTitles = ['Envío', 'Pago', 'Revisión', 'Confirmación'];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingForm />;

      case 2:
        return <PaymentForm />;

      case 3:
        return <OrderReview />;

      case 4:
        return <OrderConfirmation />;

      default:
        return <ShippingForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div key={stepNumber} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isActive
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isCompleted ? '✓' : stepNumber}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        isActive ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div
                      className={`ml-4 mr-4 w-8 h-0.5 ${
                        stepNumber < currentStep
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">{renderStepContent()}</div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen del Pedido
              </h3>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-3"
                  >
                    <OptimizedImage
                      src={resolveProductImage(item.product)}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-md"
                      sizes="48px"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      DOP ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    DOP ${orderSummary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-gray-900">
                    {orderSummary.shipping === 0
                      ? 'Gratis'
                      : `DOP ${orderSummary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ITBIS (18%)</span>
                  <span className="text-gray-900">
                    DOP ${orderSummary.tax.toFixed(2)}
                  </span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Descuento</span>
                    <span className="text-green-600">
                      -DOP ${orderSummary.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      DOP ${orderSummary.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Banner */}
              {orderSummary.subtotal < 3000 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    Añade DOP ${(3000 - orderSummary.subtotal).toFixed(2)} más
                    para envío gratis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Form Component
const PaymentForm: React.FC = () => {
  const { nextStep, previousStep, setPaymentMethod } = useCheckoutStore();
  const [selectedMethod, setSelectedMethod] = React.useState<string>('');

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Tarjeta de Crédito',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
    },
    {
      id: 'debit_card',
      name: 'Tarjeta de Débito',
      description: 'Tarjetas de débito locales',
      icon: '💳',
    },
    {
      id: 'bank_transfer',
      name: 'Transferencia Bancaria',
      description: 'Transferencia a nuestra cuenta',
      icon: '🏦',
    },
    {
      id: 'cash_on_delivery',
      name: 'Pago Contra Entrega',
      description: 'Paga cuando recibas tu pedido',
      icon: '💵',
    },
  ];

  const handleSubmit = () => {
    if (!selectedMethod) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    const method = paymentMethods.find((m) => m.id === selectedMethod);
    if (method) {
      setPaymentMethod({
        id: `payment_${Date.now()}`,
        type: selectedMethod as 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash_on_delivery',
        isDefault: false,
      });
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pago</h2>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`block p-4 border rounded-lg cursor-pointer transition-all ${
              selectedMethod === method.id
                ? 'border-green-500 bg-green-100'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="mr-3 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={previousStep}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Volver a envío
        </button>

        <button
          onClick={handleSubmit}
          disabled={!selectedMethod}
          className={`px-8 py-3 font-semibold rounded-md transition-colors ${
            selectedMethod
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Revisar pedido →
        </button>
      </div>
    </motion.div>
  );
};

// Order Review Component
const OrderReview: React.FC = () => {
  const {
    shippingAddress,
    paymentMethod,
    orderNotes,
    agreedToTerms,
    setOrderNotes,
    setAgreedToTerms,
    nextStep,
    previousStep,
  } = useCheckoutStore();

  const handleSubmit = () => {
    if (!agreedToTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Revisar Pedido</h2>

      <div className="space-y-6">
        {/* Shipping Address */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Dirección de Envío
          </h3>
          {shippingAddress && (
            <div className="text-sm text-gray-600">
              <p>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              {shippingAddress.company && <p>{shippingAddress.company}</p>}
              <p>{shippingAddress.street}</p>
              {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state}{' '}
                {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              <p>{shippingAddress.phone}</p>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Método de Pago
          </h3>
          {paymentMethod && (
            <p className="text-sm text-gray-600">
              {paymentMethod.type === 'credit_card' && 'Tarjeta de Crédito'}
              {paymentMethod.type === 'debit_card' && 'Tarjeta de Débito'}
              {paymentMethod.type === 'bank_transfer' &&
                'Transferencia Bancaria'}
              {paymentMethod.type === 'cash_on_delivery' &&
                'Pago Contra Entrega'}
            </p>
          )}
        </div>

        {/* Order Notes */}
        <div>
          <label
            htmlFor="orderNotes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Notas del Pedido (opcional)
          </label>
          <textarea
            id="orderNotes"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="Instrucciones especiales para la entrega..."
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreedToTerms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="agreedToTerms" className="ml-2 text-sm text-gray-600">
            He leído y acepto los{' '}
            <a
              href="/terminos"
              className="text-green-600 hover:text-green-800 underline"
            >
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a
              href="/privacidad"
              className="text-green-600 hover:text-green-800 underline"
            >
              política de privacidad
            </a>
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={previousStep}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Volver al pago
        </button>

        <button
          onClick={handleSubmit}
          disabled={!agreedToTerms}
          className={`px-8 py-3 font-semibold rounded-md transition-colors ${
            agreedToTerms
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Realizar pedido →
        </button>
      </div>
    </motion.div>
  );
};

// Order Confirmation Component
const OrderConfirmation: React.FC = () => {
  const { processOrder, isProcessing } = useCheckoutStore();
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleFinalizeOrder = async () => {
    const result = await processOrder(cart);
    if (result.success) {
      navigate(`/pedido-confirmado/${result.orderId}`);
      setTimeout(() => {
        clearCart();
      }, 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
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
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Todo listo!</h2>
        <p className="text-gray-600">
          Confirma tu pedido para completar la compra
        </p>
      </div>

      <button
        onClick={handleFinalizeOrder}
        disabled={isProcessing}
        className={`w-full py-4 px-8 font-semibold rounded-md transition-colors ${
          isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Procesando pedido...
          </div>
        ) : (
          'Confirmar Pedido'
        )}
      </button>

      <p className="text-xs text-gray-500 mt-4">
        Al hacer clic en "Confirmar Pedido" aceptas nuestros términos y
        condiciones
      </p>
    </motion.div>
  );
};

export default CheckoutPage;

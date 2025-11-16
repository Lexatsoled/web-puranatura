import i18next from 'i18next';

await i18next.init({
  lng: 'es',
  fallbackLng: 'es',
  resources: {
    es: {
      translation: {
        email: {
          orderConfirmation: {
            subject: 'Confirmación de pedido #{{orderId}}',
            greeting: 'Hola {{name}},',
            body: 'Gracias por tu pedido. Total: {{total}}',
          },
        },
      },
    },
    en: {
      translation: {
        email: {
          orderConfirmation: {
            subject: 'Order confirmation #{{orderId}}',
            greeting: 'Hello {{name}},',
            body: 'Thank you for your order. Total: {{total}}',
          },
        },
      },
    },
  },
});

export function t(key: string, options?: any) {
  return i18next.t(key, options);
}
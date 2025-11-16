import React, { useState } from 'react';
import { useSanitizedInput } from '@/hooks/useSanitizedInput';
import { sanitizeFormValues } from '@/utils/sanitizer';

const ContactPage: React.FC = () => {
  const nameInput = useSanitizedInput('');
  const emailInput = useSanitizedInput('', 'email');
  const messageInput = useSanitizedInput('', 'text');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = sanitizeFormValues({
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value,
    });

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('Por favor completa todos los campos con información válida.');
      return;
    }

    // Aquí iría la lógica de envío del formulario (ej. llamada a API)
    setStatus('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
    nameInput.reset();
    emailInput.reset();
    messageInput.reset();
  };

  return (
    <div className="bg-emerald-100 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-green-800">
            Hablemos sobre tu bienestar
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Podemos orientarte en persona en Cotuí, por videollamada o mediante WhatsApp. Elige el canal que prefieras y
            diseñemos juntos un plan natural que se adapte a tu día a día.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold font-display text-green-700 mb-6">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={nameInput.value}
                  onChange={nameInput.onChange}
                  className="mt-1 block w-full px-3 py-2 bg-white/80 border border-green-200 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={emailInput.value}
                  onChange={emailInput.onChange}
                  className="mt-1 block w-full px-3 py-2 bg-white/80 border border-green-200 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Cuéntanos cómo podemos ayudarte
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  required
                  value={messageInput.value}
                  onChange={messageInput.onChange}
                  className="mt-1 block w-full px-3 py-2 bg-white/80 border border-green-200 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-500"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Enviar Mensaje
                </button>
              </div>
              {status && <p className="text-center text-green-600 mt-4">{status}</p>}
            </form>
          </div>

          <div>
            <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.993473550348!2d-69.93881358510795!3d18.4838018874309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f11c752c3f%3A0x862f3a618481434c!2sSanto%20Domingo!5e0!3m2!1ses!2sdo!4v1678886445566!5m2!1ses!2sdo"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación"
              ></iframe>
            </div>
            <h3 className="text-xl font-bold text-green-700">Datos de contacto directo</h3>
            <p className="text-gray-600 mt-2">Tel: +1 849 243 4010</p>
            <p className="text-gray-600">Email: lexatsoled@gmail.com</p>
            <p className="text-gray-600">
              Consultorio ubicado en las afueras de Cotuí, provincia Sánchez Ramírez, República Dominicana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

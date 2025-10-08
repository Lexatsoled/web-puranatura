import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Service } from '../types/services';
import { services } from '../data/services';

const ServicePage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);

  useEffect(() => {
    if (serviceId) {
      const foundService = services.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
        
        // Set SEO metadata
        document.title = `${foundService.title} | Pureza Naturalis Servicios`;
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', foundService.description);
        }

        // Get related services (same category or similar services)
        const related = services
          .filter(s => s.id !== serviceId && (s.category === foundService.category || s.category !== foundService.category))
          .slice(0, 3);
        setRelatedServices(related);
      } else {
        navigate('/servicios');
      }
    }
    setIsLoading(false);
  }, [serviceId, navigate]);

  if (isLoading) {
    return (
      <div className="bg-emerald-100 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del servicio...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-emerald-100 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Servicio no encontrado</h1>
          <Link 
            to="/servicios" 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Volver a Servicios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-6">
        <nav className="text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-green-600">Inicio</Link>
          <span className="mx-2">›</span>
          <Link to="/servicios" className="hover:text-green-600">Servicios</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">{service.title}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Hero Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {service.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <header className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-green-800 font-display mb-4 leading-tight">
                    {service.title}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  {/* Service Info */}
                  <div className="grid grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-500 block">Duración</span>
                      <span className="text-lg font-semibold text-green-700">{service.duration} minutos</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Precio</span>
                      <span className="text-lg font-semibold text-green-700">DOP ${service.price.toFixed(2)}</span>
                    </div>
                  </div>
                </header>

                {/* Detailed Content */}
                {service.detailedContent && (
                  <div 
                    className="prose prose-lg max-w-none prose-green prose-headings:text-green-800 prose-a:text-green-600 prose-strong:text-green-700 mb-8"
                    dangerouslySetInnerHTML={{ __html: service.detailedContent }}
                  />
                )}

                {/* Benefits */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-green-800 mb-4">🌟 Beneficios Principales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What to Expect */}
                {service.whatToExpect && (
                  <div className="mb-8 bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">💡 ¿Qué Esperar?</h3>
                    <p className="text-blue-700">{service.whatToExpect}</p>
                  </div>
                )}

                {/* Preparation */}
                {service.preparation && (
                  <div className="mb-8 bg-amber-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-amber-800 mb-3">📋 Preparación</h3>
                    <p className="text-amber-700">{service.preparation}</p>
                  </div>
                )}

                {/* Contraindications */}
                {service.contraindications && service.contraindications.length > 0 && (
                  <div className="mb-8 bg-red-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-red-800 mb-3">⚠️ Contraindicaciones</h3>
                    <ul className="space-y-2">
                      {service.contraindications.map((contraindication, index) => (
                        <li key={index} className="flex items-start gap-2 text-red-700">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{contraindication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contacto"
                    className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    📅 Reservar Cita
                  </Link>
                  <Link
                    to="/servicios"
                    className="inline-flex items-center justify-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    ← Volver a Servicios
                  </Link>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center justify-center bg-emerald-200 text-emerald-700 px-6 py-3 rounded-lg hover:bg-emerald-300 transition-colors"
                  >
                    ↑ Ir al inicio
                  </button>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-8">
              {/* Quick Contact */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  📞 Reserva tu Cita
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Duración: {service.duration} min</p>
                    <p className="text-2xl font-bold text-green-700">DOP ${service.price.toFixed(2)}</p>
                  </div>
                  <Link
                    to="/contacto"
                    className="block w-full text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Contactar Ahora
                  </Link>
                  <p className="text-xs text-gray-500 text-center">
                    Respuesta en menos de 24 horas
                  </p>
                </div>
              </motion.div>

              {/* Related Services */}
              {relatedServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-green-800 mb-6">
                    🔗 Servicios Relacionados
                  </h3>
                  <div className="space-y-4">
                    {relatedServices.map((relatedService) => (
                      <Link
                        key={relatedService.id}
                        to={`/servicios/${relatedService.id}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <img
                            src={relatedService.imageUrl}
                            alt={relatedService.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                              {relatedService.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {relatedService.category} • {relatedService.duration} min
                            </p>
                            <p className="text-xs font-semibold text-green-600 mt-1">
                              DOP ${relatedService.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* FAQ */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white"
              >
                <h3 className="text-xl font-bold mb-3">
                  ❓ ¿Tienes Preguntas?
                </h3>
                <p className="text-green-100 mb-4 text-sm">
                  Nuestro equipo está aquí para resolver todas tus dudas sobre nuestros servicios y terapias.
                </p>
                <Link
                  to="/contacto"
                  className="inline-block w-full text-center bg-white text-green-700 font-semibold py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Consultar Experto
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;

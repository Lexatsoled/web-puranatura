import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SistemasSinergicosPage: React.FC = () => {
  const navigate = useNavigate();

  const systems = [
    {
      id: 'energia',
      title: 'Sistema Energía Natural',
      icon: '⚡',
      description:
        'Protocolo científico para combatir fatiga crónica y optimizar energía celular',
      benefits: [
        'Incremento sostenido de energía sin estimulantes',
        'Mejora de la función mitocondrial',
        'Reducción de fatiga mental y física',
        'Optimización del metabolismo energético',
      ],
      components: [
        { name: 'CoQ10 100mg', role: 'Energía mitocondrial', productId: '102' },
        {
          name: 'Ashwagandha Complex',
          role: 'Adaptógeno energético',
          productId: 'pr-ashwa-melatonin',
        },
        {
          name: 'Magnesio Citrato 400mg',
          role: 'Cofactor enzimático',
          productId: '105',
        },
        {
          name: 'Vitamina C 1000mg',
          role: 'Soporte antioxidante',
          productId: '1',
        },
      ],
      color: 'from-red-500 to-orange-500',
      timeline:
        '2-4 semanas: Primeros efectos | 6-8 semanas: Energía estable | 12+ semanas: Optimización completa',
    },
    {
      id: 'antioxidante',
      title: 'Sistema Anti-Edad Puranatura',
      icon: '🌿',
      description:
        'Protocolo integral para regeneración celular y rejuvenecimiento natural',
      benefits: [
        'Mejora visible de elasticidad cutánea',
        'Reducción de líneas finas y arrugas',
        'Hidratación profunda y duradera',
        'Protección antioxidante avanzada',
      ],
      components: [
        {
          name: 'Colágeno Péptidos Grass-Fed',
          role: 'Regeneración estructural',
          productId: 'pr-collagen-peptides',
        },
        {
          name: 'Vitamina C 1000mg',
          role: 'Síntesis de colágeno',
          productId: '1',
        },
        {
          name: 'Extracto de Bambú',
          role: 'Arquitecto estructural',
          productId: 'pr-bamboo-extract',
        },
        {
          name: 'Ácido Hialurónico',
          role: 'Hidratación maestro',
          productId: '9',
        },
        {
          name: 'Vitamina E Natural',
          role: 'Guardián antioxidante',
          productId: 'pr-vitamin-e',
        },
      ],
      color: 'from-green-500 to-emerald-500',
      timeline:
        '4-6 semanas: Hidratación visible | 8-12 semanas: Elasticidad mejorada | 12-16 semanas: Reducción líneas finas',
    },
    {
      id: 'articulaciones',
      title: 'Sistema Articular Avanzado',
      icon: '🏗️',
      description:
        'Protocolo completo para regeneración articular y movilidad óptima',
      benefits: [
        'Regeneración del cartílago articular',
        'Reducción de inflamación crónica',
        'Mejora de flexibilidad y movilidad',
        'Fortalecimiento de matriz estructural',
      ],
      components: [
        {
          name: 'Glucosamina + Condroitina',
          role: 'Base estructural',
          productId: '5',
        },
        {
          name: 'Colágeno Péptidos',
          role: 'Soporte matriz',
          productId: 'pr-collagen-peptides',
        },
        {
          name: 'Extracto de Bambú',
          role: 'Ingeniero estructural',
          productId: 'pr-bamboo-extract',
        },
        {
          name: 'Cúrcuma Avanzada',
          role: 'Protector antiinflamatorio',
          productId: 'pr-turmeric-advanced',
        },
      ],
      color: 'from-blue-500 to-cyan-500',
      timeline:
        '2-4 semanas: Reducción inflamación | 8-12 semanas: Regeneración estructural | 16-24 semanas: Fortalecimiento completo',
    },
    {
      id: 'inmunidad',
      title: 'Sistema Inmunológico Avanzado',
      icon: '🛡️',
      description:
        'Protocolo integral para fortalecer las defensas naturales y resistencia inmunitaria',
      benefits: [
        'Fortalecimiento del sistema inmunitario',
        'Mayor resistencia a infecciones',
        'Equilibrio de la microbiota intestinal',
        'Protección antioxidante sistémica',
      ],
      components: [
        {
          name: 'Vitamina C 1000mg',
          role: 'Antioxidante maestro',
          productId: '1',
        },
        {
          name: 'Vitamina D3 2000 UI',
          role: 'Modulador inmune',
          productId: '4',
        },
        {
          name: 'Triple Extracto de Hongos',
          role: 'Adaptógeno inmune',
          productId: '10',
        },
        { name: 'Ultimate Flora', role: 'Guardian intestinal', productId: '6' },
      ],
      color: 'from-purple-500 to-indigo-500',
      timeline:
        '1-2 semanas: Activación antioxidante | 4-6 semanas: Modulación inmune | 8-12 semanas: Fortalecimiento completo',
    },
    {
      id: 'corazon',
      title: 'Sistema Cardiovascular Integral',
      icon: '❤️',
      description:
        'Protocolo avanzado para salud cardíaca, circulación y protección vascular',
      benefits: [
        'Optimización de la función cardíaca',
        'Mejora de la circulación sanguínea',
        'Protección arterial y vascular',
        'Regulación de la presión arterial',
      ],
      components: [
        { name: 'CoQ10 Ubiquinol', role: 'Energía cardíaca', productId: '102' },
        {
          name: 'Magnesio Citrato',
          role: 'Relajante vascular',
          productId: '105',
        },
        {
          name: 'Vitamina K2 MK-7',
          role: 'Protector arterial',
          productId: '3',
        },
        {
          name: 'Ajo Inodoro',
          role: 'Circulación óptima',
          productId: 'pr-iodine',
        },
      ],
      color: 'from-red-500 to-pink-500',
      timeline:
        '2-3 semanas: Mejora energética | 6-8 semanas: Optimización circulatoria | 12-16 semanas: Protección vascular completa',
    },
    {
      id: 'huesos',
      title: 'Sistema Óseo Mineral',
      icon: '🦴',
      description:
        'Protocolo completo para densidad ósea, absorción mineral y matrix estructural',
      benefits: [
        'Fortalecimiento de la densidad ósea',
        'Optimización de absorción mineral',
        'Construcción de matrix estructural',
        'Prevención de pérdida ósea',
      ],
      components: [
        { name: 'Calcio + Magnesio 2:1', role: 'Base mineral', productId: '8' },
        {
          name: 'Vitamina D3 2000 UI',
          role: 'Absorción óptima',
          productId: '4',
        },
        {
          name: 'Vitamina K2 MK-7',
          role: 'Dirección del calcio',
          productId: '3',
        },
        {
          name: 'Colágeno Péptidos',
          role: 'Matrix orgánica',
          productId: 'pr-collagen-peptides',
        },
      ],
      color: 'from-amber-500 to-orange-500',
      timeline:
        '4-6 semanas: Absorción mejorada | 8-12 semanas: Mineralización activa | 16-24 semanas: Densidad óptima',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-green-700">Sistemas Sinérgicos</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              La nueva frontera en suplementación inteligente. Protocolos
              científicos donde cada componente potencia al siguiente, creando
              resultados exponencialmente superiores a la suma de las partes.
            </p>
            <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-2xl">🧬</span>
              <span className="font-semibold text-gray-700">
                1 + 1 + 1 = 5 (Sinergia Científica)
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Synergistic Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              ¿Por qué Sistemas Sinérgicos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="text-4xl mb-4">🧪</div>
                <h3 className="text-xl font-semibold mb-2">Ciencia Avanzada</h3>
                <p className="text-gray-600">
                  Cada sistema está respaldado por investigación científica que
                  demuestra sinergia molecular
                </p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Máximo Valor</h3>
                <p className="text-gray-600">
                  Resultados 300% superiores vs componentes individuales, con
                  ahorro económico significativo
                </p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-xl font-semibold mb-2">
                  Resultados Rápidos
                </h3>
                <p className="text-gray-600">
                  Protocolos optimizados para acelerar beneficios mediante
                  timing y dosificación precisa
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Systems Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            {systems.map((system, index) => (
              <motion.div
                key={system.id}
                variants={itemVariants}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                } md:flex`}
              >
                {/* System Info */}
                <div className="md:w-1/2 p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <span className="text-4xl mr-4">{system.icon}</span>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {system.title}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-600 mb-8">
                    {system.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">
                      Beneficios Clave:
                    </h4>
                    <ul className="space-y-2">
                      {system.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">
                      Cronología de Resultados:
                    </h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                      {system.timeline}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/tienda?sistema=${system.id}`)}
                    className={`w-full bg-gradient-to-r ${system.color} text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                  >
                    Ver Sistema Completo
                  </button>
                </div>

                {/* Components */}
                <div
                  className={`md:w-1/2 bg-gradient-to-br ${system.color} p-8 lg:p-12 text-white`}
                >
                  <h4 className="text-2xl font-bold mb-8">
                    Componentes Sinérgicos:
                  </h4>
                  <div className="space-y-6">
                    {system.components.map((component, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          navigate(`/tienda/producto/${component.productId}`)
                        }
                        className="w-full bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300 text-left"
                      >
                        <h5 className="font-semibold text-lg mb-2">
                          {component.name}
                        </h5>
                        <p className="text-white/90 text-sm">
                          {component.role}
                        </p>
                        <div className="mt-2 text-xs text-white/70">
                          ← Click para ver producto individual
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-white/10 rounded-lg">
                    <p className="text-sm text-white/90">
                      <strong>Sinergia Científica:</strong> Cada componente está
                      cronometrado y dosificado para maximizar la absorción y
                      efectividad del conjunto.
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para experimentar la diferencia?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a miles de clientes que han transformado su salud con
              nuestros sistemas sinérgicos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/tienda')}
                className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Explorar Todos los Sistemas
              </button>
              <button
                onClick={() => navigate('/contacto')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                Consulta Personalizada
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SistemasSinergicosPage;

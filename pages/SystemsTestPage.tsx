import React from 'react';
import { systems, getFeaturedSystems, getProductsBySystem } from '../src/data/products';

export const SystemsTestPage: React.FC = () => {
  const featuredSystems = getFeaturedSystems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🌿 Sistemas Sinérgicos Puranatura
        </h1>
        
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre nuestros 6 sistemas sinérgicos diseñados para optimizar tu salud integral.
            Cada sistema combina ingredientes científicamente respaldados para resultados máximos.
          </p>
        </div>

        {/* Sistemas Destacados */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            ⭐ Sistemas Destacados
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredSystems.map((system) => (
              <div
                key={system.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                style={{ backgroundColor: system.color }}
              >
                <div className="p-8">
                  <div className="text-4xl mb-4 text-center">{system.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
                    {system.name}
                  </h3>
                  <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                    {system.description}
                  </p>
                  
                  {/* Audiencia Objetivo */}
                  {system.targetAudience && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2 text-gray-800">Ideal para:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {system.targetAudience.map((audience, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {audience}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Beneficios Clave */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-gray-800">Beneficios principales:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {system.benefits.slice(0, 4).map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-500 mr-2">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ingredientes Clave */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-gray-800">Ingredientes estrella:</h4>
                    <div className="flex flex-wrap gap-2">
                      {system.keyIngredients.slice(0, 3).map((ingredient, idx) => (
                        <span
                          key={idx}
                          className="bg-white/50 px-3 py-1 rounded-full text-xs font-medium text-gray-700"
                        >
                          {ingredient.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Productos del Sistema */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-gray-800">
                      Productos incluidos: {system.products.length}
                    </h4>
                    <div className="text-sm text-gray-600">
                      {getProductsBySystem(system.id).length} productos disponibles
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Todos los Sistemas */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            🔬 Todos los Sistemas Sinérgicos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((system) => (
              <div
                key={system.id}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ${
                  system.featured ? 'ring-2 ring-green-400' : ''
                }`}
                style={{ backgroundColor: system.color }}
              >
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{system.icon}</span>
                  <h3 className="text-lg font-bold text-gray-800">
                    {system.name}
                  </h3>
                  {system.featured && (
                    <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Destacado
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {system.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      Beneficios: {system.benefits.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      Ingredientes: {system.keyIngredients.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      Productos: {system.products.length}
                    </span>
                  </div>
                </div>

                {/* Sistemas Relacionados */}
                {system.relatedSystems && system.relatedSystems.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-xs text-gray-600">
                      Sinergía con: {system.relatedSystems.length} sistemas
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Estadísticas Generales */}
        <section className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            📊 Estadísticas de Implementación
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600">{systems.length}</div>
              <div className="text-sm text-gray-600">Sistemas Totales</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-600">{featuredSystems.length}</div>
              <div className="text-sm text-gray-600">Sistemas Destacados</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-600">
                {systems.reduce((acc, sys) => acc + sys.products.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Productos Vinculados</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-yellow-600">
                {systems.reduce((acc, sys) => acc + sys.benefits.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Beneficios Totales</div>
            </div>
          </div>
        </section>

        {/* Footer de Prueba */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            ✅ Implementación completada de los 6 Sistemas Sinérgicos Puranatura
          </p>
          <p className="text-xs mt-2">
            Inmunológico • Cardiovascular • Óseo Mineral • Nervioso • Endocrino • Detox
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SystemsTestPage;
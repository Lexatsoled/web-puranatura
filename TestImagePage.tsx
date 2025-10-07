import React from 'react';
import ImageZoom from './components/ImageZoom';

const TestImagePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Test de Zoom de Imagen</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test con Vitamina K2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Vitamina K2 - Imagen Principal</h2>
            <div className="w-80 mx-auto">
              <ImageZoom 
                src="/Jpeg/Vitamina_K2_Anverso.jpg"
                alt="Vitamina K2"
                zoom={2}
              />
            </div>
          </div>

          {/* Test con imagen alternativa */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Vitamina K2 - Imagen 500x500</h2>
            <div className="w-80 mx-auto">
              <ImageZoom 
                src="/Jpeg/vitamina_k2_500x500.jpg"
                alt="Vitamina K2 500x500"
                zoom={2}
              />
            </div>
          </div>
        </div>

        {/* Test de imagen normal sin zoom */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Imagen Normal (sin zoom) para comparar</h2>
          <div className="flex justify-center">
            <img 
              src="/Jpeg/Vitamina_K2_Anverso.jpg" 
              alt="Vitamina K2 normal"
              className="w-80 h-80 object-contain border border-gray-300 rounded-lg p-4"
            />
          </div>
        </div>

        {/* Información de debug */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Instrucciones de Prueba:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Mueve el cursor sobre las imágenes de arriba para ver el efecto de zoom</li>
            <li>En pantallas grandes (lg+) debería aparecer una lupa lateral</li>
            <li>Debería aparecer un indicador "Ampliar" en la esquina inferior derecha</li>
            <li>La imagen debería hacer un zoom sutil al hacer hover</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestImagePage;

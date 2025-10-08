import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold font-display mb-4">PuraNatura</h3>
            <p className="text-green-200">
              Tu santuario de bienestar y salud natural. Conectando con la
              esencia de la naturaleza para una vida plena.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-display mb-4">Contacto</h3>
            <p className="text-green-200">
              Calle de la Salud 123, Santo Domingo
            </p>
            <p className="text-green-200">Email: info@puranatura.do</p>
            <p className="text-green-200">Tel: (809) 555-1234</p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-display mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors duration-300"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors duration-300"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-green-700 pt-6 text-center text-green-300 text-sm">
          <p>
            &copy; {new Date().getFullYear()} PuraNatura. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

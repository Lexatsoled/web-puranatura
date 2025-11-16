import React from 'react';

/**
 * Componente Footer para mostrar información de contacto y redes sociales con accesibilidad y buenas prácticas.
 *
 * @component
 * @returns {JSX.Element}
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white" role="contentinfo" aria-label="Pie de página Pureza Naturalis">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold font-display mb-4" id="footer-brand">
              Pureza Naturalis
            </h3>
            <p className="text-green-200" aria-labelledby="footer-brand">
              Tu santuario de bienestar y salud natural. Conectando con la
              esencia de la naturaleza para una vida plena.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-display mb-4" id="footer-contacto">Contacto</h3>
            <address className="not-italic text-green-200" aria-labelledby="footer-contacto">
              Calle de la Salud 123, Santo Domingo<br />
              Email: <a href="mailto:info@puranatura.do" className="underline text-green-100 hover:text-white">info@puranatura.do</a><br />
              Tel: <a href="tel:+18095551234" className="underline text-green-100 hover:text-white">(809) 555-1234</a>
            </address>
          </div>
          <div>
            <h3 className="text-xl font-bold font-display mb-4" id="footer-social">Síguenos</h3>
            <nav aria-labelledby="footer-social">
              <ul className="flex space-x-4">
                <li>
                  <a
                    href="#"
                    className="text-green-200 hover:text-white transition-colors duration-300"
                    aria-label="Facebook Pureza Naturalis"
                    title="Facebook Pureza Naturalis"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-green-200 hover:text-white transition-colors duration-300"
                    aria-label="Instagram Pureza Naturalis"
                    title="Instagram Pureza Naturalis"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-green-200 hover:text-white transition-colors duration-300"
                    aria-label="Twitter Pureza Naturalis"
                    title="Twitter Pureza Naturalis"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-green-700 pt-6 text-center text-green-300 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Pureza Naturalis. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

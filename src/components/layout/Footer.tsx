import React from 'react';
import { UI_TEXTS } from '../../data/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold font-display mb-4">
              {UI_TEXTS.BRAND.NAME}
            </h3>
            <p className="text-green-200">{UI_TEXTS.BRAND.DESCRIPTION}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-display mb-4">
              {UI_TEXTS.NAVIGATION.CONTACT}
            </h3>
            <p className="text-green-200">{UI_TEXTS.CONTACT.ADDRESS}</p>
            <p className="text-green-200">Email: {UI_TEXTS.CONTACT.EMAIL}</p>
            <p className="text-green-200">Tel: {UI_TEXTS.CONTACT.PHONE}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-display mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-200 hover:text-white transition-colors duration-300"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-200 hover:text-white transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-200 hover:text-white transition-colors duration-300"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-green-700 pt-6 text-center text-green-300 text-sm">
          <p>
            {UI_TEXTS.BRAND.COPYRIGHT.replace(
              '{year}',
              new Date().getFullYear().toString()
            )}{' '}
            {UI_TEXTS.BRAND.ALL_RIGHTS_RESERVED}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error(
    'No se pudo encontrar el elemento raíz para montar la aplicación.',
  );
}

// Configurar basename para producción si es necesario
const basename = import.meta.env.VITE_CLOUDFLARE_TUNNEL === 'true' ? '/' : '/';

// SOLUCIÓN CRÍTICA: Deshabilitar scroll restoration automático de React Router
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

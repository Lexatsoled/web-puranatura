import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nueva versión disponible. ¿Recargar?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.info('App lista para trabajar offline');
  },
});

import '../index.css'; // Assuming index.css is still in root, so ../index.css. Wait, standard is src/index.css or ./index.css.
// Step 324 showed index.css in ROOT.
// I should move index.css to src/index.css?
// If I leave it in root, I import it as ../index.css relative to src/main.tsx?
// Or I import it as '/index.css'?
// Vite supports importing CSS from anywhere.
// But standard is src/index.css.
// I will assume I will move it OR import from root.
// Let's import from '../index.css'.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error(
    'No se pudo encontrar el elemento raíz para montar la aplicación.'
  );
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

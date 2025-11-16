import { Workbox } from 'workbox-window';

/**
 * Registra el Service Worker en la aplicación
 * @returns {Promise<Workbox | undefined>} Instancia de Workbox o undefined si no es soportado
 */
export async function registerServiceWorker(): Promise<Workbox | undefined> {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/service-worker.js');

    // Evento: Nueva versión esperando
    wb.addEventListener('waiting', () => {
      const updateConfirm = window.confirm(
        'Nueva versión disponible. ¿Deseas actualizar ahora para obtener las últimas mejoras?'
      );

      if (updateConfirm) {
        // Enviar mensaje al SW para que se active inmediatamente
        wb.messageSkipWaiting();
        window.location.reload();
      }
    });

    // Evento: Service Worker activado por primera vez
    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('✅ Service Worker activado por primera vez');
      } else {
        console.log('🔄 Service Worker actualizado exitosamente');
      }
    });

    // Evento: Service Worker controlando la página
    wb.addEventListener('controlling', () => {
      console.log('🎮 Service Worker ahora está controlando esta página');
    });

    // Registrar el Service Worker
    try {
      await wb.register();
      console.log('📝 Service Worker registrado exitosamente');

      // Verificar actualizaciones cada hora
      setInterval(() => {
        wb.update();
      }, 60 * 60 * 1000); // 1 hora

      return wb;
    } catch (error) {
      console.error('❌ Error al registrar Service Worker:', error);
      return undefined;
    }
  } else {
    console.warn('⚠️ Service Workers no están soportados en este navegador');
    return undefined;
  }
}

/**
 * Desregistra el Service Worker (útil para debugging)
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      console.log('🗑️ Service Workers desregistrados');
      return true;
    } catch (error) {
      console.error('❌ Error al desregistrar Service Workers:', error);
      return false;
    }
  }
  return false;
}

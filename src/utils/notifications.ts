/**
 * Utilidades para gestión de notificaciones push en PWA
 */

/**
 * Solicita permiso para mostrar notificaciones al usuario
 * @returns {Promise<boolean>} true si el permiso fue concedido
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('⚠️ Las notificaciones no están soportadas en este navegador');
    return false;
  }

  // Si ya se concedió permiso, retornar true
  if (Notification.permission === 'granted') {
    return true;
  }

  // Si fue denegado, retornar false
  if (Notification.permission === 'denied') {
    console.warn('❌ El usuario ha denegado los permisos de notificación');
    return false;
  }

  // Solicitar permiso
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('❌ Error al solicitar permiso de notificaciones:', error);
    return false;
  }
}

/**
 * Suscribe al usuario a las notificaciones push
 * @returns {Promise<PushSubscription | null>} Subscription object o null si falla
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  // Verificar soporte de Service Worker
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ Service Workers no están soportados');
    return null;
  }

  try {
    // Esperar a que el SW esté listo
    const registration = await navigator.serviceWorker.ready;

    // Verificar si PushManager está disponible
    if (!('pushManager' in registration)) {
      console.warn('⚠️ Push Manager no está soportado');
      return null;
    }

    // Obtener VAPID public key desde variables de entorno
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      console.warn(
        '⚠️ VITE_VAPID_PUBLIC_KEY no está configurada en variables de entorno'
      );
      return null;
    }

    // Intentar obtener subscription existente
    let subscription = await registration.pushManager.getSubscription();

    // Si no existe, crear nueva subscription
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      console.log('✅ Nueva push subscription creada');
    }

    // Enviar subscription al servidor
    await sendSubscriptionToServer(subscription);

    return subscription;
  } catch (error) {
    console.error('❌ Error al suscribirse a push notifications:', error);
    return null;
  }
}

/**
 * Desuscribe al usuario de las notificaciones push
 * @returns {Promise<boolean>} true si se desuscribió exitosamente
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log('✅ Desuscrito de push notifications');

      // Notificar al servidor
      await removeSubscriptionFromServer(subscription);

      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Error al desuscribirse de push notifications:', error);
    return false;
  }
}

/**
 * Obtiene el estado actual de la subscription
 * @returns {Promise<PushSubscription | null>} Subscription activa o null
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('❌ Error al obtener subscription actual:', error);
    return null;
  }
}

/**
 * Envía la subscription al servidor backend
 * @param {PushSubscription} subscription - Objeto de subscription
 */
async function sendSubscriptionToServer(
  subscription: PushSubscription
): Promise<void> {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Subscription enviada al servidor');
  } catch (error) {
    console.error('❌ Error al enviar subscription al servidor:', error);
    // No lanzar el error para no romper el flujo principal
  }
}

/**
 * Remueve la subscription del servidor backend
 * @param {PushSubscription} subscription - Objeto de subscription
 */
async function removeSubscriptionFromServer(
  subscription: PushSubscription
): Promise<void> {
  try {
    const response = await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Subscription removida del servidor');
  } catch (error) {
    console.error('❌ Error al remover subscription del servidor:', error);
  }
}

/**
 * Convierte una string base64 URL-safe a Uint8Array
 * Necesario para el applicationServerKey de VAPID
 * @param {string} base64String - String en formato base64 URL-safe
 * @returns {Uint8Array} Array de bytes
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Muestra una notificación local (sin push)
 * Útil para testing o notificaciones inmediatas
 * @param {string} title - Título de la notificación
 * @param {NotificationOptions} options - Opciones de la notificación
 */
export async function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    console.warn('⚠️ No se puede mostrar notificación: permiso denegado');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      ...options,
    });
  } catch (error) {
    console.error('❌ Error al mostrar notificación:', error);
  }
}

import { Request, Response } from 'express';
import { AnalyticsEvent } from '../../types/analytics';

interface ExtendedAnalyticsEvent extends AnalyticsEvent {
  timestamp: string;
  sessionId: string;
  userId?: string;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const event: ExtendedAnalyticsEvent = req.body;

    // Validar el evento
    if (!event.category || !event.action) {
      return res.status(400).json({ message: 'Invalid event data' });
    }

    // Añadir información adicional
    const enrichedEvent = {
      ...event,
      ip: Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : (req.headers['x-forwarded-for'] || req.socket.remoteAddress),
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer,
    };

    // Almacenar el evento (ejemplo con MongoDB)
    await storeEvent(enrichedEvent);

    // Procesar el evento en tiempo real si es necesario
    await processRealTimeEvent(enrichedEvent);

    return res.status(200).json({ message: 'Event recorded successfully' });
  } catch (error) {
    console.error('Error recording analytics event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function storeEvent(_event: ExtendedAnalyticsEvent & { 
  ip?: string; 
  userAgent?: string; 
  referrer?: string; 
}) {
  // Aquí implementarías la lógica para almacenar en tu base de datos
  // Por ejemplo, usando MongoDB:
  
  /*
  const { db } = await connectToDatabase();
  await db.collection('analytics_events').insertOne({
    ...event,
    createdAt: new Date(),
  });
  */
}

async function processRealTimeEvent(event: ExtendedAnalyticsEvent) {
  // Aquí implementarías la lógica para procesamiento en tiempo real
  // Por ejemplo, actualizando contadores, disparando alertas, etc.
  
  switch (event.category) {
    case 'product':
      if (event.action === 'view') {
        await updateProductViewCount(event);
      }
      break;
    case 'cart':
      if (event.action === 'add_to_cart') {
        await checkInventoryLevels(event);
      }
      break;
    // Otros casos según necesites
  }
}

async function updateProductViewCount(_event: ExtendedAnalyticsEvent) {
  // Actualizar contadores de vistas de productos
  /*
  const { db } = await connectToDatabase();
  await db.collection('products').updateOne(
    { _id: event.metadata?.productId },
    { $inc: { viewCount: 1 } }
  );
  */
}

async function checkInventoryLevels(_event: ExtendedAnalyticsEvent) {
  // Verificar niveles de inventario y enviar alertas si es necesario
  /*
  const { db } = await connectToDatabase();
  const product = await db.collection('products').findOne(
    { _id: event.metadata?.productId }
  );

  if (product.stock < 10) {
    await sendLowStockAlert(product);
  }
  */
}

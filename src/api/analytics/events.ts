import { Request, Response } from 'express';
import {
  enrichEvent,
  ExtendedAnalyticsEvent,
  handlers,
  validateEvent,
} from './events.helpers';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const event: ExtendedAnalyticsEvent = req.body;
    if (!validateEvent(event)) {
      return res.status(400).json({ message: 'Invalid event data' });
    }

    const enrichedEvent = enrichEvent(event, req);

    await storeEvent(enrichedEvent);
    await processRealTimeEvent(enrichedEvent);

    return res.status(200).json({ message: 'Event recorded successfully' });
  } catch (error) {
    console.error('Error recording analytics event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function storeEvent(_event: ExtendedAnalyticsEvent) {
  // Persistencia a base de datos. Implementación pendiente según provider.
}

async function processRealTimeEvent(event: ExtendedAnalyticsEvent) {
  const handler = handlers[event.category];
  if (handler) await handler(event);
}

import { FastifyRequest, FastifyReply } from 'fastify';

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
];

/**
 * Detectar si es un bot
 */
function isBot(userAgent: string): boolean {
  return BOT_USER_AGENTS.some(bot => 
    userAgent.toLowerCase().includes(bot)
  );
}

/**
 * Middleware para detectar bots y preparar prerendering
 * En el futuro, se puede integrar con servicios como Prerender.io
 */
export async function prerenderMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userAgent = request.headers['user-agent'] || '';
  
  if (isBot(userAgent)) {
    // Log para analytics
    request.log.info({ 
      userAgent, 
      url: request.url,
      method: request.method 
    }, 'Bot detected');
    
    // Aquí se podría integrar con servicio de prerendering
    // Por ejemplo: Prerender.io, Rendertron, o SSR propio
    // if (shouldPrerender(request.url)) {
    //   const prerenderedHtml = await fetchPrerendered(request.url);
    //   return reply.type('text/html').send(prerenderedHtml);
    // }
  }
}

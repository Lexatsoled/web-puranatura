import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';
import { config } from '../config/index.js';

const buildCdnUrl = () => {
  if (config.CDN_URL) {
    return config.CDN_URL;
  }
  const domain = config.APP_DOMAIN?.replace(/^https?:\/\//, '') ?? 'localhost';
  return `https://cdn.${domain}`;
};

const buildApiUrl = () => {
  if (config.API_BASE_URL) {
    return config.API_BASE_URL;
  }
  const domain = config.APP_DOMAIN?.replace(/^https?:\/\//, '') ?? 'localhost';
  return `https://api.${domain}`;
};

const reportEndpoint = () => {
  if (config.CSP_REPORT_URI) {
    return config.CSP_REPORT_URI;
  }
  return `${buildApiUrl()}/api/csp-report`;
};

export default fp(async function securityHeadersPlugin(app: FastifyInstance) {
  const isDevelopment = config.NODE_ENV !== 'production';
  const cdnUrl = buildCdnUrl();
  const apiUrl = buildApiUrl();
  const reportingUrl = reportEndpoint();

  const cspDirectives = {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        ...(isDevelopment ? ["'unsafe-inline'", "'unsafe-eval'"] : []),
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
      ],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:', cdnUrl, 'https://www.google-analytics.com'],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      connectSrc: [
        "'self'",
        apiUrl,
        'https://www.google-analytics.com',
        ...(isDevelopment ? ['http://localhost:3000', 'http://localhost:5173', 'ws://localhost:5173'] : []),
      ],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'", 'blob:'],
      ...(isDevelopment ? {} : { upgradeInsecureRequests: [] }),
      reportUri: [reportingUrl],
    } as const;

  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: {
      useDefaults: false,
      directives: cspDirectives,
      reportOnly: config.CSP_REPORT_ONLY,
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: !isDevelopment,
    },
    frameguard: {
      action: 'deny',
    },
    noSniff: true,
    dnsPrefetchControl: { allow: false },
    ieNoOpen: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    originAgentCluster: true,
  });

  app.addHook('onSend', async (request, reply) => {
    const permissionsPolicy = [
      'accelerometer=()',
      'autoplay=()',
      'camera=()',
      'cross-origin-isolated=()',
      'display-capture=()',
      'encrypted-media=()',
      'fullscreen=(self)',
      'geolocation=()',
      'gyroscope=()',
      'keyboard-map=()',
      'magnetometer=()',
      'microphone=()',
      'midi=()',
      'payment=(self)',
      'picture-in-picture=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'sync-xhr=()',
      'usb=()',
      'web-share=()',
      'xr-spatial-tracking=()',
    ].join(', ');

    reply.header('Permissions-Policy', permissionsPolicy);
    reply.header('X-Permitted-Cross-Domain-Policies', 'none');

    if (!isDevelopment) {
      reply.header(
        'Report-To',
        JSON.stringify({
          group: 'csp-endpoint',
          max_age: 10886400,
          endpoints: [{ url: reportingUrl }],
        }),
      );
      reply.header('Reporting-Endpoints', `csp-endpoint="${reportingUrl}"`);
    }

    if (request.method === 'POST' && request.url?.startsWith('/api/auth/logout')) {
      reply.header('Clear-Site-Data', '"cache", "cookies", "storage"');
    }
  });

  app.addContentTypeParser(
    'application/csp-report',
    { parseAs: 'string' },
    (_request, body: string | Buffer, done) => {
      try {
        const parsed = JSON.parse(typeof body === 'string' ? body : body.toString());
        done(null, parsed);
      } catch (error) {
        done(error as Error);
      }
    },
  );

  app.log.info(
    {
      plugin: 'security-headers',
      environment: config.NODE_ENV,
      cspReportOnly: config.CSP_REPORT_ONLY,
    },
    'Security headers configured',
  );
});

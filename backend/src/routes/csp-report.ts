import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';

const cspReportSchema = z.object({
  'csp-report': z.object({
    'document-uri': z.string(),
    referrer: z.string().optional(),
    'violated-directive': z.string(),
    'effective-directive': z.string(),
    'original-policy': z.string(),
    disposition: z.enum(['enforce', 'report']),
    'blocked-uri': z.string(),
    'line-number': z.number().optional(),
    'column-number': z.number().optional(),
    'source-file': z.string().optional(),
    'status-code': z.number().optional(),
    'script-sample': z.string().optional(),
  }),
});

type CSPReportRequest = FastifyRequest<{
  Body: z.infer<typeof cspReportSchema>;
}>;

export async function cspReportRoutes(app: FastifyInstance) {
  app.post('/csp-report', async (request: CSPReportRequest, reply) => {
    const parsed = cspReportSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid CSP report payload',
      });
    }

    const report = parsed.data['csp-report'];

    app.log.warn(
      {
        type: 'CSP_VIOLATION',
        uri: report['document-uri'],
        directive: report['violated-directive'],
        blockedUri: report['blocked-uri'],
        sourceFile: report['source-file'],
        lineNumber: report['line-number'],
        columnNumber: report['column-number'],
        sample: report['script-sample'],
        userAgent: request.headers['user-agent'],
        ip: request.ip,
      },
      'Content Security Policy violation detected',
    );

    return reply.code(204).send();
  });
}

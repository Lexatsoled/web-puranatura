import { Router } from 'express';
import { appendCspReport } from '../storage/cspReportStore';
import { z } from 'zod';
import { cspReportsCounter, cspReportsBlockedCounter } from '../utils/metrics';
import { maskIp, hashString } from '../utils/pseudonymize';
import { logger } from '../utils/logger';
import { env } from '../config/env';

const router = Router();

// Endpoint to receive CSP violation reports (application/csp-report or application/json)
const rawCspSchema = z
  .object({
    'csp-report': z.record(z.string(), z.any()).optional(),
  })
  .passthrough();

router.post('/csp-report', async (req, res) => {
  try {
    const raw =
      req.body && Object.keys(req.body).length > 0 ? req.body : undefined;

    // Validate at least a basic shape so we avoid accidental invalid payloads
    try {
      rawCspSchema.parse({ ...(raw ?? {}) });
    } catch (err) {
      // continue — we'll persist with whatever shape arrived, but guard is useful for metrics
    }

    // many browsers send { 'csp-report': { ... } }
    const report = raw?.['csp-report'] ?? raw ?? {};

    // common fields
    const violatedDirective =
      report['violated-directive'] ?? report['violatedDirective'] ?? 'unknown';
    const blockedUri =
      report['blocked-uri'] ??
      report['blockedUri'] ??
      report['blocked_url'] ??
      report['blockedURL'] ??
      'unknown';

    // Pseudonymize PII before persisting: mask IPs and hash user-agent
    const maskedIp = maskIp(req.ip);
    const uaHash = hashString(req.get('user-agent'));

    // Persist for later analysis (PII pseudonymized)
    await appendCspReport({
      report,
      ip: maskedIp,
      userAgentHash: uaHash,
      traceId: res.locals.traceId ?? undefined,
    });

    // Metrics
    try {
      cspReportsCounter.inc({
        violated_directive: String(violatedDirective),
        blocked_uri: String(blockedUri),
        report_only: String(env.cspReportOnly),
      } as any);
      if (blockedUri && blockedUri !== 'unknown') {
        cspReportsBlockedCounter.inc({
          blocked_uri: String(blockedUri),
        } as any);
      }
    } catch (err) {
      logger.warn('Fallo incrementando métricas de CSP', { err });
    }

    // Acknowledge receipt — 204 to indicate no content and quiet success
    res.status(204).end();
  } catch (error) {
    logger.error('Error procesando CSP report', { error });
    res.status(500).json({ ok: false });
  }
});

export default router;

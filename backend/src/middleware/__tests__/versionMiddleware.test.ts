import { describe, expect, it } from 'vitest';
import { versionMiddleware } from '../versionMiddleware.js';

process.env.API_VERSION_DEFAULT = 'v1';
process.env.API_V1_SUNSET_DATE = '2026-06-01';

describe('versionMiddleware', () => {
  it('extrae la versión del path cuando está presente', async () => {
    const request: any = {
      url: '/api/v2/products',
      headers: {},
      log: { info: () => {} },
    };

    await versionMiddleware(request, {} as any);

    expect(request.versionContext?.negotiated).toBe('v2');
    expect(request.versionContext?.pathVersion).toBe('v2');
  });

  it('usa Accept-Version cuando la ruta no contiene versión', async () => {
    const request: any = {
      url: '/api/products',
      headers: { 'accept-version': 'v2' },
      log: { info: () => {} },
    };

    await versionMiddleware(request, {} as any);

    expect(request.versionContext?.negotiated).toBe('v2');
    expect(request.versionContext?.requested).toBe('v2');
  });
});

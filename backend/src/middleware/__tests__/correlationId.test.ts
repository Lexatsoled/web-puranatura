import { describe, expect, it, vi } from 'vitest';
import { correlationId } from '../correlationId.js';

describe('correlationId middleware', () => {
  it('reuses an existing X-Request-ID header when present', async () => {
    const childLog = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const childSpy = vi.fn(() => childLog);
    const request = {
      headers: { 'x-request-id': 'existing-id' },
      log: { child: childSpy },
    } as any;
    const reply = {
      header: vi.fn().mockReturnThis(),
    } as any;

    await correlationId(request, reply);

    expect(reply.header).toHaveBeenCalledWith('X-Request-ID', 'existing-id');
    expect(childSpy).toHaveBeenCalledWith({ correlationId: 'existing-id' });
    expect(request.log).toBe(childLog);
  });

  it('generates a new correlation ID when the header is missing', async () => {
    const childLog = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const childSpy = vi.fn(() => childLog);
    const request = {
      headers: {},
      log: { child: childSpy },
    } as any;
    const reply = {
      header: vi.fn().mockReturnThis(),
    } as any;

    await correlationId(request, reply);

    const headerCalls = reply.header.mock.calls as unknown as Array<[string, string]>;
    const childCalls = childSpy.mock.calls as unknown as Array<[{ correlationId?: string }]>;

    expect(headerCalls.length).toBeGreaterThan(0);
    expect(childCalls.length).toBeGreaterThan(0);

    const headerCall = headerCalls[0];
    if (!headerCall) {
      throw new Error('expected header call');
    }

    const childCall = childCalls[0];
    if (!childCall) {
      throw new Error('expected child call');
    }

    const headerValue = headerCall[1];
    const callArg = childCall[0] as { correlationId?: string };

    expect(typeof headerValue).toBe('string');
    expect(callArg.correlationId).toBe(headerValue);
    expect(headerValue.length).toBeGreaterThan(0);
  });
});

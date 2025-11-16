import { describe, expect, it, vi, beforeEach } from 'vitest';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFile, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import axios from 'axios';
import { CDNService } from '../CDNService.js';
import { cdnConfig } from '../../config/cdn.js';

vi.mock('axios', () => {
  return {
    default: {
      put: vi.fn().mockResolvedValue(undefined),
      post: vi.fn().mockResolvedValue({ data: { result: { variants: ['https://cdn.example.com/image.jpg'] } } }),
    },
  };
});

vi.mock('../../config/cdn.js', () => ({
  cdnConfig: {
    provider: 'bunnycdn',
    baseUrl: 'https://cdn.example.com',
    bunnycdn: {
      storageZoneName: 'zone',
      apiKey: 'secret',
      pullZoneUrl: 'https://pull.zone',
    },
    cloudflare: {
      accountId: 'account',
      apiToken: 'token',
      zoneId: 'zone-id',
    },
  },
}));

const axiosMock = axios as unknown as {
  put: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

const waitForStream = () => new Promise((resolve) => setTimeout(resolve, 5));

describe('CDNService', () => {
  const service = new CDNService();

beforeEach(() => {
  vi.clearAllMocks();
  axiosMock.post.mockResolvedValue({
    data: { result: { variants: ['https://cdn.example.com/image.jpg'] } },
  });
    cdnConfig.provider = 'bunnycdn';
    cdnConfig.baseUrl = 'https://cdn.example.com';
    cdnConfig.bunnycdn.storageZoneName = 'zone';
    cdnConfig.bunnycdn.apiKey = 'secret';
    cdnConfig.bunnycdn.pullZoneUrl = 'https://pull.zone';
    cdnConfig.cloudflare.accountId = 'account';
    cdnConfig.cloudflare.apiToken = 'token';
    cdnConfig.cloudflare.zoneId = 'zone-id';
  });

  it('getCDNUrl respeta paths absolutos y base configurada', () => {
    expect(service.getCDNUrl('https://example.com/image.png')).toBe('https://example.com/image.png');

    cdnConfig.baseUrl = 'https://cdn.test/';
    expect(service.getCDNUrl('/images/file.png?x=1')).toBe('https://cdn.test/images/file.png?x=1');

    cdnConfig.baseUrl = '';
    expect(service.getCDNUrl('/images/file.png')).toBe('/images/file.png');
  });

  it('uploadToBunnyCDN sube archivo y retorna URL', async () => {
    const tempFile = join(tmpdir(), `cdn-test-${randomUUID()}.txt`);
    await writeFile(tempFile, 'demo');

    try {
      const url = await service.uploadToBunnyCDN(tempFile, 'products/demo.txt');
      expect(url).toBe('https://pull.zone/products/demo.txt');
      expect(axiosMock.put).toHaveBeenCalledWith(
        'https://storage.bunnycdn.com/zone/products/demo.txt',
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({ AccessKey: 'secret' }),
        }),
      );
    } finally {
      await waitForStream();
      await unlink(tempFile).catch(() => {});
    }
  });

  it('uploadToCloudflare devuelve primera variante', async () => {
    const tempFile = join(tmpdir(), `cdn-test-${randomUUID()}.png`);
    await writeFile(tempFile, 'demo');

    try {
      const variant = await service.uploadToCloudflare(tempFile, 'image-id');
      expect(variant).toBe('https://cdn.example.com/image.jpg');
      expect(axiosMock.post).toHaveBeenCalledWith(
        'https://api.cloudflare.com/client/v4/accounts/account/images/v1',
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer token' }),
        }),
      );
    } finally {
      await waitForStream();
      await unlink(tempFile).catch(() => {});
    }
  });

  it('purgeCache usa proveedor configurado', async () => {
    cdnConfig.provider = 'cloudflare';
    await service.purgeCache(['https://cdn.example.com/image.jpg']);
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://api.cloudflare.com/client/v4/zones/zone-id/purge_cache',
      { files: ['https://cdn.example.com/image.jpg'] },
      expect.anything(),
    );

    axiosMock.post.mockClear();
    cdnConfig.provider = 'bunnycdn';
    await service.purgeCache(['https://cdn.example.com/image.jpg']);
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://api.bunny.net/purge',
      { url: 'https://cdn.example.com/image.jpg' },
      expect.anything(),
    );
  });
});

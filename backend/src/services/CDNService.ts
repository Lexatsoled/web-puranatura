import axios from 'axios';
import { createReadStream } from 'node:fs';
import FormData from 'form-data';
import { cdnConfig } from '../config/cdn.js';

const trimLeadingSlash = (value: string) => value.replace(/^\/+/, '');
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export class CDNService {
  async uploadToBunnyCDN(filePath: string, remotePath: string): Promise<string> {
    const { storageZoneName, apiKey, pullZoneUrl } = cdnConfig.bunnycdn;
    if (!storageZoneName || !apiKey || !pullZoneUrl) {
      throw new Error('BunnyCDN configuration is incomplete');
    }

    const cleanRemotePath = trimLeadingSlash(remotePath);
    const url = `https://storage.bunnycdn.com/${storageZoneName}/${cleanRemotePath}`;
    const fileStream = createReadStream(filePath);

    await axios.put(url, fileStream, {
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/octet-stream',
      },
      maxBodyLength: Infinity,
    });

    return `${trimTrailingSlash(pullZoneUrl)}/${cleanRemotePath}`;
  }

  async uploadToCloudflare(filePath: string, id: string): Promise<string> {
    const { accountId, apiToken } = cdnConfig.cloudflare;
    if (!accountId || !apiToken) {
      throw new Error('Cloudflare configuration is incomplete');
    }

    const sanitizedId = trimLeadingSlash(id).replace(/[^\w.-]/g, '-');
    const formData = new FormData();
    formData.append('file', createReadStream(filePath) as any);
    formData.append('id', sanitizedId);

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          ...formData.getHeaders(),
        },
        maxBodyLength: Infinity,
      },
    );

    const variants: string[] | undefined = response.data?.result?.variants;
    if (!variants?.length) {
      throw new Error('Cloudflare did not return variants for the uploaded image');
    }
    return variants[0];
  }

  async uploadImage(filePath: string, remotePath: string): Promise<string> {
    if (cdnConfig.provider === 'bunnycdn') {
      return this.uploadToBunnyCDN(filePath, remotePath);
    }
    if (cdnConfig.provider === 'cloudflare') {
      return this.uploadToCloudflare(filePath, remotePath);
    }
    throw new Error('CDN provider is not configured');
  }

  async purgeCache(urls: string[]): Promise<void> {
    if (!urls.length) {
      return;
    }

    if (cdnConfig.provider === 'cloudflare') {
      await this.purgeCloudflareCache(urls);
    } else if (cdnConfig.provider === 'bunnycdn') {
      await this.purgeBunnyCDNCache(urls);
    }
  }

  getCDNUrl(path: string): string {
    if (!path) {
      return '';
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    if (!cdnConfig.baseUrl) {
      return path;
    }

    return `${trimTrailingSlash(cdnConfig.baseUrl)}/${trimLeadingSlash(path)}`;
  }

  private async purgeCloudflareCache(urls: string[]): Promise<void> {
    const { zoneId, apiToken } = cdnConfig.cloudflare;
    if (!zoneId || !apiToken) {
      throw new Error('Cloudflare configuration is incomplete');
    }

    await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      { files: urls },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  private async purgeBunnyCDNCache(urls: string[]): Promise<void> {
    const { apiKey } = cdnConfig.bunnycdn;
    if (!apiKey) {
      throw new Error('BunnyCDN configuration is incomplete');
    }

    await Promise.all(
      urls.map((url) =>
        axios.post(
          'https://api.bunny.net/purge',
          { url },
          {
            headers: {
              AccessKey: apiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      ),
    );
  }
}

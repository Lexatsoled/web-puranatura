export const cdnConfig = {
  provider: process.env.CDN_PROVIDER || 'cloudflare',
  baseUrl: process.env.CDN_BASE_URL || '',
  cloudflare: {
    accountId: process.env.CF_ACCOUNT_ID,
    apiToken: process.env.CF_API_TOKEN,
    zoneId: process.env.CF_ZONE_ID,
  },
  bunnycdn: {
    storageZoneName: process.env.BUNNY_STORAGE_ZONE,
    apiKey: process.env.BUNNY_API_KEY,
    pullZoneUrl: process.env.BUNNY_PULL_ZONE_URL,
  },
};

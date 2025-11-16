export interface DeprecationOptions {
  version: string;
  sunsetDate: string;
  message: string;
  migrationUrl?: string;
}

export const MIGRATION_GUIDE_URL =
  'https://github.com/pureza-naturalis/pureza-naturalis-v3/blob/main/docs/MIGRATION_v1_to_v2.md';

export function calculateSunset(months: number): string {
  const target = new Date();
  target.setUTCMonth(target.getUTCMonth() + months);
  return target.toUTCString();
}

export function deprecationWarning(options: DeprecationOptions): Record<string, string> {
  const parsedSunset = Number.isNaN(Date.parse(options.sunsetDate))
    ? options.sunsetDate
    : new Date(options.sunsetDate).toUTCString();

  const headers: Record<string, string> = {
    Deprecation: options.message,
    Sunset: parsedSunset,
  };

  if (options.migrationUrl) {
    headers.Link = `<${options.migrationUrl}>; rel="deprecation"; title="Guía de migración ${options.version}"`;
  }

  return headers;
}

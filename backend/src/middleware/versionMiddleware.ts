import type { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config/index.js';
import type { ApiVersion } from '../types/version.js';

const SUPPORTED_VERSIONS: ApiVersion[] = ['v1', 'v2'];

const extractPathVersion = (url: string): ApiVersion | undefined => {
  const path = (url ?? '').split('?')[0];
  if (!path.startsWith('/api')) {
    return undefined;
  }

  const segments = path.split('/').filter(Boolean);
  if (segments.length < 2) {
    return undefined;
  }

  const candidate = segments[1].toLowerCase();
  if (SUPPORTED_VERSIONS.includes(candidate as ApiVersion)) {
    return candidate as ApiVersion;
  }

  return undefined;
};

const extractHeaderVersion = (value: string | string[] | undefined): ApiVersion | undefined => {
  const headerValue = Array.isArray(value) ? value[0] : value;
  if (!headerValue) {
    return undefined;
  }
  const normalized = headerValue.trim().toLowerCase();
  if (SUPPORTED_VERSIONS.includes(normalized as ApiVersion)) {
    return normalized as ApiVersion;
  }
  return undefined;
};

export async function versionMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  const pathVersion = extractPathVersion(request.url ?? '');
  const headerVersion = extractHeaderVersion(request.headers['accept-version'] as string | string[] | undefined);
  const negotiated: ApiVersion =
    pathVersion ?? headerVersion ?? (config.API_VERSION_DEFAULT as ApiVersion);

  request.versionContext = {
    negotiated,
    requested: headerVersion,
    pathVersion,
  };

  request.log.info(
    {
      version: negotiated,
      requestedVersion: headerVersion ?? null,
      pathVersion: pathVersion ?? null,
    },
    'API version negociada',
  );
}

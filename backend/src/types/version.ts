export type ApiVersion = 'v1' | 'v2';

export interface VersionContext {
  negotiated: ApiVersion;
  requested?: ApiVersion;
  pathVersion?: ApiVersion;
}

declare module 'fastify' {
  interface FastifyRequest {
    versionContext?: VersionContext;
  }
}

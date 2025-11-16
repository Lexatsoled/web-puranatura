import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeFile, unlink } from 'node:fs/promises';
import { requireRole } from '../middleware/auth.js';
import { CDNService } from '../services/CDNService.js';
import { cdnConfig } from '../config/cdn.js';

const ensureAdmin = requireRole('admin');

export async function uploadRoutes(app: FastifyInstance) {
  const cdnService = new CDNService();

  app.post(
    '/upload/image',
    {
      preHandler: [ensureAdmin],
    },
    async (request, reply) => {
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }

      if (!data.mimetype?.startsWith('image/')) {
        await data.file.resume();
        return reply.code(400).send({ error: 'Only image uploads are allowed' });
      }

      if (cdnConfig.provider === 'none') {
        await data.file.resume();
        return reply.code(400).send({ error: 'CDN provider is disabled' });
      }

      const tempPath = join(tmpdir(), `${randomUUID()}-${data.filename}`);
      await writeFile(tempPath, await data.toBuffer());

      const remotePath = `uploads/${randomUUID()}-${data.filename}`;

      try {
        const cdnUrl = await cdnService.uploadImage(tempPath, remotePath);
        return reply.send({ url: cdnUrl });
      } finally {
        await unlink(tempPath).catch(() => {});
      }
    },
  );

  app.post(
    '/admin/cdn/purge',
    {
      preHandler: [ensureAdmin],
    },
    async (request, reply) => {
      const body = (request.body ?? {}) as { urls?: unknown };
      const urls = Array.isArray(body.urls)
        ? body.urls.filter((url): url is string => typeof url === 'string' && url.length > 0)
        : [];

      if (!urls.length) {
        return reply.code(400).send({ error: 'urls must be a non-empty array' });
      }

      await cdnService.purgeCache(urls);
      return reply.send({ success: true });
    },
  );
}

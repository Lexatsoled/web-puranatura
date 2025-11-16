import { FastifyPluginAsync } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { schemaRegistry } from '../schemas/index.js';

export const schemasPlugin: FastifyPluginAsync = async (fastify) => {
  // Registrar todos los schemas para Swagger
  for (const [key, schema] of Object.entries(schemaRegistry)) {
    const jsonSchema = zodToJsonSchema(schema, key);
    fastify.addSchema(jsonSchema);
  }

  fastify.log.info(`Registered ${Object.keys(schemaRegistry).length} schemas`);
};
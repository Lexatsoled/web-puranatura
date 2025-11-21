# Plantilla – Endpoint Express + Prisma

---

version: 1.0  
updated: 2025-11-19  
owner: Backend Guild

## Instrucciones paso a paso

1. **Inicializar proyecto (solo una vez)**
   ```bash
   cd backend
   npm init -y
   npm install express @prisma/client
   npm install -D typescript ts-node nodemon prisma
   npx prisma init
   ```
2. **Definir esquema en `prisma/schema.prisma`**
   ```prisma
   model Product {
     id        String @id @default(cuid())
     name      String
     price     Float
     createdAt DateTime @default(now())
   }
   ```
3. **Ejecutar migración / seed**
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Crear endpoint (`src/server.ts`)**

   ```ts
   import express from 'express';
   import { PrismaClient } from '@prisma/client';

   const app = express();
   const prisma = new PrismaClient();

   app.get('/api/products', async (_req, res) => {
     const products = await prisma.product.findMany();
     res.json(products);
   });

   app.listen(3001, () => console.log('API ready on 3001'));
   ```

5. **Scripts recomendados en `backend/package.json`**
   ```json
   "scripts": {
     "dev": "nodemon src/server.ts",
     "build": "tsc",
     "start": "node dist/server.js",
     "migrate": "prisma migrate deploy"
   }
   ```
6. **Proxy en Vite (`vite.config.ts`)**
   ```ts
   export default defineConfig({
     server: {
       port: 5173,
       proxy: {
         '/api': 'http://localhost:3001',
       },
     },
   });
   ```

## Checklist “Low effort”

- [ ] Ejecuté todos los comandos anteriores sin errores.
- [ ] `npm run dev` en `backend/` muestra “API ready on 3001”.
- [ ] Desde el frontend (`npm run dev`), `fetch('/api/products')` devuelve datos reales.
- [ ] Documenté cambios en `GPT-51-Codex`.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Plantilla inicial.

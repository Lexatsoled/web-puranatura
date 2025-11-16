# ✔️ GROK-TASK-3: SEC-INPUT-001 - Input Validation

**ID:** SEC-INPUT-001  
**Severidad:** 🟡 MEDIUM  
**Tiempo estimado:** 20 minutos  
**Complejidad:** ⭐⭐ Fácil  
**Status:** ⏳ TODO

---

## 📋 RESUMEN DE TAREA

**Problema:**
- API búsqueda acepta queries de cualquier longitud
- Queries muy largas pueden causar DoS (Denial of Service)
- Sin validación, requests maliciosos pueden derribar el servidor

**Solución:**
- Limitar query params a máximo 200 caracteres
- Retornar error 400 si excede límite
- Tanto frontend como backend validan (defense in depth)

---

## 🎯 PASO 1: EDITAR FRONTEND

### Abrir archivo

```powershell
code src/utils/api.ts
```

**Ubicación esperada:**
```
C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3\src\utils\api.ts
```

### Localizar función de búsqueda

Buscar en el archivo una función que se llame `searchProducts` o similar:

**ENCONTRAR ALGO COMO ESTO:**
```typescript
export const searchProducts = async (query: string) => {
  const response = await fetch(`/api/v1/products?q=${encodeURIComponent(query)}`);
  return response.json();
};
```

o

```typescript
export const searchProducts = (query: string) => {
  return axios.get('/api/v1/products', { params: { q: query } });
};
```

### Agregar validación

**BUSCAR EXACTAMENTE:**
```typescript
export const searchProducts = async (query: string) => {
  const response = await fetch(`/api/v1/products?q=${encodeURIComponent(query)}`);
  return response.json();
};
```

**REEMPLAZAR CON:**
```typescript
export const searchProducts = async (query: string) => {
  // SEC-INPUT-001: Validate query length to prevent DoS
  const sanitizedQuery = query.substring(0, 200);
  if (sanitizedQuery !== query) {
    console.warn(`[SECURITY] Query truncada de ${query.length} a 200 caracteres`);
  }
  const response = await fetch(`/api/v1/products?q=${encodeURIComponent(sanitizedQuery)}`);
  return response.json();
};
```

**O si usas axios:**
```typescript
export const searchProducts = (query: string) => {
  // SEC-INPUT-001: Validate query length to prevent DoS
  const sanitizedQuery = query.substring(0, 200);
  if (sanitizedQuery !== query) {
    console.warn(`[SECURITY] Query truncada de ${query.length} a 200 caracteres`);
  }
  return axios.get('/api/v1/products', { params: { q: sanitizedQuery } });
};
```

**PASOS EN VS CODE:**
1. `Ctrl+F` → Buscar: `searchProducts`
2. `Ctrl+H` → Find and Replace
3. Copiar-pegar en el campo de reemplazo
4. Click "Replace"
5. `Ctrl+S` → Guardar

---

## 🎯 PASO 2: EDITAR BACKEND

### Abrir archivo

```powershell
code backend/src/routes/v1/products.ts
```

**Ubicación esperada:**
```
C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3\backend\src\routes\v1\products.ts
```

### Localizar endpoint GET

Buscar la ruta que maneja búsqueda, debe verse algo como:

**ENCONTRAR ALGO COMO ESTO:**
```typescript
router.get('/products', async (request, reply) => {
  const { q } = request.query;
  
  if (!q) {
    return reply.send({ products: [] });
  }
  
  // ... resto del código
});
```

### Agregar validación

**BUSCAR EXACTAMENTE:**
```typescript
router.get('/products', async (request, reply) => {
  const { q } = request.query;
  
  if (!q) {
    return reply.send({ products: [] });
  }
```

**REEMPLAZAR CON:**
```typescript
router.get('/products', async (request, reply) => {
  let { q } = request.query;
  
  // SEC-INPUT-001: Validate query length to prevent DoS
  if (q && typeof q === 'string') {
    if (q.length > 200) {
      return reply.status(400).json({
        error: 'Query parameter too long (max 200 characters)'
      });
    }
    q = q.substring(0, 200);
  }
  
  if (!q) {
    return reply.send({ products: [] });
  }
```

**PASOS EN VS CODE:**
1. `Ctrl+F` → Buscar: `router.get('/products'`
2. `Ctrl+H` → Find and Replace
3. Copiar-pegar el código
4. Click "Replace"
5. `Ctrl+S` → Guardar

---

## ✅ PASO 3: VERIFICAR CAMBIOS

**En VS Code:**
- [ ] Archivo `src/utils/api.ts` guardado
- [ ] Archivo `backend/src/routes/v1/products.ts` guardado
- [ ] Sin indicadores sin guardar en las pestañas

---

## 🧪 PASO 4: EJECUTAR PRUEBAS

### Test 1: Query normal (< 200 chars)

```powershell
# Debería retornar 200 OK
curl "http://localhost:3001/api/v1/products?q=vitaminas"
```

**Resultado esperado:**
```json
{
  "products": [...]
}
```

✅ Si devuelve datos, es correcto

### Test 2: Query larga (> 200 chars)

```powershell
# Generar query de 300 caracteres
$longQuery = -join((1..300) | ForEach-Object { 'x' })
curl "http://localhost:3001/api/v1/products?q=$longQuery"
```

**Resultado esperado:**
```json
{
  "error": "Query parameter too long (max 200 characters)"
}
```

✅ Si retorna 400 con error, es correcto

### Test 3: Con navegador (visual)

1. Abrir `http://localhost:5173` (frontend)
2. Ir a página de búsqueda/productos
3. Escribir en el buscador
4. Abrir DevTools (`F12`)
5. Ir a Network tab
6. Ver que requests van a `/api/v1/products?q=...`
7. Ver que query tiene máximo 200 caracteres

✅ Si funciona sin errores, es correcto

---

## 📊 PASO 5: VALIDACIÓN FINAL

```powershell
.\validate-audits.ps1

# Debe mostrar:
# ✅ [PASS] ImageZoom Import Fix (del paso anterior)
# (No hay test específico para SEC-INPUT-001, pero se verifica en código review)
```

**Si el script pasa:** ✅ TAREA 3 COMPLETADA

---

## 🎯 CHECKLIST DE COMPLETITUD

- [ ] Archivo `src/utils/api.ts` abierto
- [ ] Localicé función `searchProducts`
- [ ] Agregué validación: `query.substring(0, 200)`
- [ ] Guardé el archivo
- [ ] Archivo `backend/src/routes/v1/products.ts` abierto
- [ ] Localicé ruta GET `/products`
- [ ] Agregué validación: si `q.length > 200` retornar 400
- [ ] Guardé el archivo
- [ ] Probé con query normal → Funcionó ✅
- [ ] Probé con query larga → Retornó 400 ✅
- [ ] Ejecuté `.\validate-audits.ps1` → Pasó ✅

---

## 📋 DETALLES TÉCNICOS

### ¿Por qué 200 caracteres?

- URL típica: ~2000 caracteres max (HTTP spec)
- Query tipica: 10-50 caracteres
- 200 permite queries razonables
- Protege contra DoS (evita procesar queries masivas)

### ¿Por qué validar en ambos lados?

**Frontend:** Previene que usuario envíe query larga
**Backend:** Protege si alguien intenta bypassear frontend con curl/postman

Esto se llama "defense in depth"

### ¿Qué pasa con queries exactas a 200?

- `q.length == 200` → Pasa (no es > 200)
- `q.length == 201` → Falla (es > 200)
- `q.substring(0, 200)` corta a 200 caracteres máximo

---

## 📞 TROUBLESHOOTING

### Problema: No encuentro la función searchProducts
**Solución:** Buscar variantes:
- `searchProducts`
- `getProducts`
- `fetchProducts`
- O simplemente buscar "/api/v1/products"

### Problema: El archivo tiene múltiples funciones
**Solución:** Agregar validación en TODAS las que hagan requests a `/api/v1/products`

### Problema: "substring is not a function"
**Solución:** Verificar que `query` es un string (no array o objeto)

### Problema: Query se trunca incluso sin agregar validación
**Solución:** Probablemente el navegador ya lo hace. Eso está bien, pero sigue agregando la validación explícita.

---

## 🚀 PRÓXIMO PASO

Una vez completada esta tarea:

1. Commit los cambios:
```powershell
git add src/utils/api.ts backend/src/routes/v1/products.ts
git commit -m "security(input): validate query length to prevent DoS attacks"
```

2. Ir a: **GROK-TASK-4.md** (Rate Limiting)

---

**STATUS:** ⏳ EN PROGRESO  
**TIEMPO INVERTIDO:** ~20 minutos  
**SIGUIENTE:** GROK-TASK-4.md


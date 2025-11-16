# TASK-017: Optimización de Queries a Base de Datos

## 📋 INFORMACIÓN

**ID**: TASK-017 | **Fase**: 2 | **Prioridad**: ALTA | **Estimación**: 3h

## 🎯 OBJETIVO

Optimizar queries SQLite mediante índices, análisis EXPLAIN QUERY PLAN, eliminación de N+1 queries y uso de prepared statements.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Crear Índices Optimizados

**Archivo**: `backend/src/db/migrations/005_create_indexes.sql`

```sql
-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_price ON products(category, price);

-- Índices para orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);

-- Índices para order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Índices para sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_jti ON sessions(jti);

-- Índice compuesto para búsqueda de sesiones activas
CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON sessions(user_id, expires_at) 
WHERE deleted_at IS NULL;
```

### Paso 2: Utilidad para Análisis de Queries

**Archivo**: `backend/src/utils/queryAnalyzer.ts`

```typescript
import { Database } from 'better-sqlite3';
import { logger } from '../config/logger.js';

export class QueryAnalyzer {
  constructor(private db: Database) {}

  /**
   * Analizar query con EXPLAIN QUERY PLAN
   */
  analyzeQuery(sql: string, params: any[] = []): void {
    const plan = this.db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all(...params);
    
    logger.info({
      sql,
      plan,
    }, 'Query plan analysis');

    // Detectar table scans (malo)
    const hasTableScan = plan.some((row: any) => 
      row.detail?.includes('SCAN TABLE') && !row.detail?.includes('USING INDEX')
    );

    if (hasTableScan) {
      logger.warn({ sql }, 'Query uses table scan - consider adding index');
    }
  }

  /**
   * Listar todos los índices
   */
  listIndexes(): Array<{ name: string; table: string; sql: string }> {
    return this.db.prepare(`
      SELECT name, tbl_name as 'table', sql
      FROM sqlite_master
      WHERE type = 'index' AND name NOT LIKE 'sqlite_%'
      ORDER BY tbl_name, name
    `).all() as any[];
  }

  /**
   * Estadísticas de uso de índices
   */
  getIndexStats(): void {
    const stats = this.db.prepare(`
      SELECT * FROM sqlite_stat1
    `).all();

    logger.info({ stats }, 'Index statistics');
  }
}
```

### Paso 3: Eliminar N+1 Queries con Eager Loading

**Archivo**: `backend/src/services/OrderService.ts` (optimizar)

```typescript
// ❌ MAL: N+1 queries
async getOrdersWithItems_BAD(userId: number) {
  const orders = await this.db.select().from(orders).where(eq(orders.userId, userId));
  
  for (const order of orders) {
    // Esto hace 1 query por cada order (N+1 problem)
    order.items = await this.db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
  }
  
  return orders;
}

// ✅ BIEN: Single query con JOIN
async getOrdersWithItems_GOOD(userId: number) {
  return this.db
    .select({
      order: orders,
      item: orderItems,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(eq(orders.userId, userId));
}
```

### Paso 4: Prepared Statements para Queries Frecuentes

**Archivo**: `backend/src/services/ProductService.ts`

```typescript
export class ProductService {
  private getByIdStmt: any;
  private getByCategoryStmt: any;

  constructor(private db: Database) {
    // Preparar statements una vez
    this.getByIdStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    this.getByCategoryStmt = db.prepare('SELECT * FROM products WHERE category = ? LIMIT ?');
  }

  getById(id: number) {
    return this.getByIdStmt.get(id);
  }

  getByCategory(category: string, limit: number = 20) {
    return this.getByCategoryStmt.all(category, limit);
  }
}
```

### Paso 5: Script de Análisis de Performance

**Archivo**: `scripts/analyze-queries.ts`

```typescript
#!/usr/bin/env node
import Database from 'better-sqlite3';
import { QueryAnalyzer } from '../backend/src/utils/queryAnalyzer.js';

const db = new Database('./backend/database.sqlite');
const analyzer = new QueryAnalyzer(db);

console.log('📊 Análisis de Performance de Queries\n');

// Listar índices
console.log('📋 Índices existentes:');
const indexes = analyzer.listIndexes();
indexes.forEach(idx => {
  console.log(`  - ${idx.table}.${idx.name}`);
});

// Analizar queries comunes
console.log('\n🔍 Análisis de queries frecuentes:\n');

analyzer.analyzeQuery('SELECT * FROM products WHERE category = ?', ['vitaminas']);
analyzer.analyzeQuery('SELECT * FROM orders WHERE user_id = ? AND status = ?', [1, 'pending']);
analyzer.analyzeQuery(`
  SELECT o.*, oi.* 
  FROM orders o 
  JOIN order_items oi ON o.id = oi.order_id 
  WHERE o.user_id = ?
`, [1]);

db.close();
```

### Paso 6: Optimizar Configuración SQLite

**Archivo**: `backend/src/db/connection.ts`

```typescript
import Database from 'better-sqlite3';

export function createOptimizedDatabase(path: string) {
  const db = new Database(path);

  // Configuración de performance
  db.pragma('journal_mode = WAL'); // Write-Ahead Logging
  db.pragma('synchronous = NORMAL'); // Balance seguridad/performance
  db.pragma('cache_size = -64000'); // 64MB cache
  db.pragma('temp_store = MEMORY'); // Temp tables en memoria
  db.pragma('mmap_size = 30000000000'); // 30GB memory-mapped I/O
  db.pragma('page_size = 4096'); // Tamaño de página
  db.pragma('auto_vacuum = INCREMENTAL'); // Vacuum incremental

  // Análisis automático de queries (dev only)
  if (process.env.NODE_ENV === 'development') {
    db.pragma('optimize'); // Optimizar estadísticas
  }

  return db;
}
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Índices en columnas frecuentes
- [x] EXPLAIN QUERY PLAN para queries críticas
- [x] Eliminación de N+1 queries
- [x] Prepared statements para queries frecuentes
- [x] Configuración SQLite optimizada
- [x] Script de análisis de performance
- [x] Documentación de índices

## 🧪 VALIDACIÓN

```bash
# Ejecutar análisis
tsx scripts/analyze-queries.ts

# Verificar índices
sqlite3 database.sqlite ".indexes"

# Ver plan de query
sqlite3 database.sqlite "EXPLAIN QUERY PLAN SELECT * FROM products WHERE category = 'vitaminas'"

# Stats de DB
sqlite3 database.sqlite "PRAGMA stats"
```

---

**Status**: COMPLETO ✅

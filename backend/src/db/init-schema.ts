import { db, sqlite } from './client.js';

console.log('🔧 Creando schema de base de datos...');

// Crear tabla users
sqlite.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)
`);

console.log('✅ Tabla users creada');

// Crear tabla products con TODAS las columnas para las 5 subsecciones
sqlite.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  compare_at_price REAL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  subcategory TEXT,
  categories TEXT DEFAULT '[]',
  sku TEXT,
  is_featured INTEGER DEFAULT 0 NOT NULL,
  images TEXT DEFAULT '[]',
  benefits TEXT DEFAULT '[]',
  ingredients TEXT DEFAULT '[]',
  usage TEXT,
  dosage TEXT,
  administration_method TEXT,
  warnings TEXT,
  rating REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  detailed_description TEXT,
  mechanism_of_action TEXT,
  benefits_description TEXT DEFAULT '[]',
  health_issues TEXT DEFAULT '[]',
  components TEXT DEFAULT '[]',
  faqs TEXT DEFAULT '[]',
  scientific_references TEXT DEFAULT '[]',
  tags TEXT DEFAULT '[]',
  price_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)
`);

console.log('✅ Tabla products creada con TODAS las columnas de las 5 subsecciones');

// Crear tabla cart_items
sqlite.exec(`
CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)
`);

console.log('✅ Tabla cart_items creada');

// Crear tabla orders
sqlite.exec(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  shipping_address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
`);

console.log('✅ Tabla orders creada');

// Crear tabla order_items
sqlite.exec(`
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE NO ACTION
)
`);

console.log('✅ Tabla order_items creada');

console.log('✨ Schema completo creado exitosamente');
console.log('📋 Verificando columnas de products...');

const columns = sqlite.prepare('PRAGMA table_info(products)').all();
console.log('Columnas en products:', columns.map((c: any) => c.name).join(', '));

process.exit(0);

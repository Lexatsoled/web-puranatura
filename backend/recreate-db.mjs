import Database from 'better-sqlite3';

const db = new Database('./backend/database.sqlite');
db.pragma('encoding = "UTF-8"');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('Creando tablas...');

db.exec(`
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
`);

// Users
db.exec(`
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

// Products
db.exec(`
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  compare_at_price REAL,
  stock INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  subcategory TEXT,
  categories TEXT DEFAULT '[]',
  sku TEXT,
  is_featured INTEGER DEFAULT 0,
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
);
`);

// Cart items
db.exec(`
CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
`);

// Orders
db.exec(`
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT,
  payment_method TEXT,
  subtotal REAL DEFAULT 0,
  shipping REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
`);

// Order items
db.exec(`
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  subtotal REAL NOT NULL,
  variant_id TEXT,
  variant_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
`);

console.log('Tablas recreadas. Insertando datos de prueba...');

db.exec('DELETE FROM products;');

const toJson = (value) => JSON.stringify(value ?? []);
const defaultFields = {
  usage: 'Consultar indicaciones en el envase',
  dosage: null,
  administration_method: null,
  warnings: null,
  detailed_description: null,
  mechanism_of_action: null,
  benefits: [],
  benefits_description: [],
  ingredients: [],
  health_issues: [],
  components: [],
  faqs: [],
  scientific_references: [],
  tags: [],
  price_note: null,
};

const sampleProducts = [
  {
    name: 'Vitamina C 1000mg',
    description: 'Suplemento de vitamina C de alta potencia para el sistema inmune.',
    price: 450,
    compare_at_price: 600,
    stock: 50,
    category: 'vitaminas',
    subcategory: 'inmunidad',
    categories: ['vitaminas', 'inmunidad'],
    sku: 'VITC-1000',
    is_featured: 1,
    images: ['https://dummyimage.com/600x600/28a745/ffffff&text=Vitamina+C'],
    benefits: ['Inmunidad', 'Antioxidante'],
    benefits_description: ['Soporta el sistema inmune', 'Reduce fatiga'],
    tags: ['vitamina c', 'sistema inmune'],
    rating: 4.8,
    reviews_count: 120,
    warnings: 'No exceder la dosis diaria recomendada.',
    usage: 'Tomar 1 cápsula al día',
    dosage: '1000mg',
    components: [{ name: 'Vitamina C', description: 'Ascorbato de sodio', amount: '1000mg' }],
    faqs: [{ question: '¿Puedo combinarlo con zinc?', answer: 'Sí, se puede combinar.' }],
    scientific_references: [{ title: 'Vitamina C y sistema inmune', authors: ['Perez, J.'], journal: 'Salud', year: 2020 }]
  },
  {
    name: 'Omega 3 Premium',
    description: 'Ácidos grasos esenciales para cerebro y corazón.',
    price: 700,
    compare_at_price: 900,
    stock: 30,
    category: 'aceites',
    subcategory: 'cardio',
    categories: ['aceites', 'cardio'],
    sku: 'OMG3-PRM',
    is_featured: 1,
    images: ['https://dummyimage.com/600x600/007bff/ffffff&text=Omega+3'],
    tags: ['omega 3', 'corazon'],
    rating: 4.7,
    reviews_count: 80,
    warnings: 'Consultar al médico si toma anticoagulantes.',
    usage: '2 cápsulas con comidas',
    dosage: '1000mg',
    components: [{ name: 'EPA+DHA', description: 'Aceite de pescado', amount: '1000mg' }]
  },
  {
    name: 'Probióticos 10B',
    description: 'Mezcla de cepas para salud digestiva y defensas.',
    price: 600,
    compare_at_price: 750,
    stock: 40,
    category: 'digestivo',
    subcategory: 'flora',
    categories: ['digestivo','flora'],
    sku: 'PROB-10B',
    is_featured: 0,
    images: ['https://dummyimage.com/600x600/ffc107/000000&text=Probioticos'],
    tags: ['probióticos','digestión'],
    rating: 4.6,
    reviews_count: 60,
    warnings: 'No usar en inmunodeprimidos sin control médico.'
  },
  {
    name: 'Complejo B Forte',
    description: 'Vitaminas del grupo B para energía y sistema nervioso.',
    price: 380,
    compare_at_price: 500,
    stock: 25,
    category: 'vitaminas',
    subcategory: 'energía',
    categories: ['vitaminas','energia'],
    sku: 'B-FORTE',
    is_featured: 0,
    images: ['https://dummyimage.com/600x600/6f42c1/ffffff&text=Complejo+B'],
    rating: 4.5,
    reviews_count: 45
  }
].map((p) => {
  const merged = { ...defaultFields, ...p };
  return {
    ...merged,
    categories: toJson(merged.categories),
    images: toJson(merged.images),
    benefits: toJson(merged.benefits),
    benefits_description: toJson(merged.benefits_description),
    ingredients: toJson(merged.ingredients),
    health_issues: toJson(merged.health_issues),
    components: toJson(merged.components),
    faqs: toJson(merged.faqs),
    scientific_references: toJson(merged.scientific_references),
    tags: toJson(merged.tags)
  };
});

const insert = db.prepare(`
  INSERT INTO products (
    name, description, price, compare_at_price, stock, category, subcategory, categories,
    sku, is_featured, images, benefits, ingredients, usage, dosage, administration_method,
    warnings, rating, reviews_count, detailed_description, mechanism_of_action,
    benefits_description, health_issues, components, faqs, scientific_references,
    tags, price_note
  ) VALUES (
    @name, @description, @price, @compare_at_price, @stock, @category, @subcategory, @categories,
    @sku, @is_featured, @images, @benefits, @ingredients, @usage, @dosage, @administration_method,
    @warnings, @rating, @reviews_count, @detailed_description, @mechanism_of_action,
    @benefits_description, @health_issues, @components, @faqs, @scientific_references,
    @tags, @price_note
  );
`);
for (const product of sampleProducts) {
  insert.run(product);
}

console.log(`Insertados ${sampleProducts.length} productos de prueba.`);
db.close();

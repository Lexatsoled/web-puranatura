-- =====================================================
-- SUPABASE DATABASE SCHEMA - Web Puranatura
-- Migración de productos desde data/products.ts
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- =====================================================
-- TABLES
-- =====================================================

-- Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table (Main)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  mechanism_of_action TEXT,
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Full-text search columns
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('spanish', 
      coalesce(name, '') || ' ' || 
      coalesce(description, '') || ' ' || 
      coalesce(detailed_description, '') || ' ' ||
      coalesce(sku, '')
    )
  ) STORED
);

-- Product Categories Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS product_category_links (
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES product_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  thumbnail TEXT NOT NULL,
  full TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Tags Table
CREATE TABLE IF NOT EXISTS product_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Benefits Table
CREATE TABLE IF NOT EXISTS product_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  benefit TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Contraindications Table
CREATE TABLE IF NOT EXISTS product_contraindications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  contraindication TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Ingredients Table
CREATE TABLE IF NOT EXISTS product_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  ingredient TEXT NOT NULL,
  amount TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Scientific References Table
CREATE TABLE IF NOT EXISTS product_scientific_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  authors TEXT,
  journal TEXT,
  year INTEGER,
  doi TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Variants Table (if needed for size, flavor, etc.)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_modifier DECIMAL(10, 2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  sku TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Full-text search index (GIN)
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING GIN(search_vector);

-- Product categories links indexes
CREATE INDEX IF NOT EXISTS idx_product_category_links_product ON product_category_links(product_id);
CREATE INDEX IF NOT EXISTS idx_product_category_links_category ON product_category_links(category_id);

-- Product images indexes
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort ON product_images(product_id, sort_order);

-- Product tags indexes
CREATE INDEX IF NOT EXISTS idx_product_tags_product ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for products updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for product_categories updated_at
DROP TRIGGER IF EXISTS update_product_categories_updated_at ON product_categories;
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON product_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_category_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_contraindications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_scientific_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can read)
CREATE POLICY "Public read access for products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for categories" ON product_categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access for category links" ON product_category_links
  FOR SELECT USING (true);

CREATE POLICY "Public read access for images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public read access for tags" ON product_tags
  FOR SELECT USING (true);

CREATE POLICY "Public read access for benefits" ON product_benefits
  FOR SELECT USING (true);

CREATE POLICY "Public read access for contraindications" ON product_contraindications
  FOR SELECT USING (true);

CREATE POLICY "Public read access for ingredients" ON product_ingredients
  FOR SELECT USING (true);

CREATE POLICY "Public read access for references" ON product_scientific_references
  FOR SELECT USING (true);

CREATE POLICY "Public read access for variants" ON product_variants
  FOR SELECT USING (is_available = true);

-- Admin write access (authenticated users with admin role)
-- Note: You'll need to set up authentication and roles in Supabase

-- =====================================================
-- VIEWS
-- =====================================================

-- View for products with all related data
CREATE OR REPLACE VIEW products_full AS
SELECT 
  p.*,
  json_agg(DISTINCT jsonb_build_object(
    'id', pc.id,
    'name', pc.name
  )) FILTER (WHERE pc.id IS NOT NULL) AS categories,
  json_agg(DISTINCT jsonb_build_object(
    'thumbnail', pi.thumbnail,
    'full', pi.full,
    'alt_text', pi.alt_text
  ) ORDER BY pi.sort_order) FILTER (WHERE pi.id IS NOT NULL) AS images,
  json_agg(DISTINCT pt.tag) FILTER (WHERE pt.id IS NOT NULL) AS tags,
  json_agg(DISTINCT pb.benefit ORDER BY pb.sort_order) FILTER (WHERE pb.id IS NOT NULL) AS benefits,
  json_agg(DISTINCT pci.contraindication ORDER BY pci.sort_order) FILTER (WHERE pci.id IS NOT NULL) AS contraindications,
  json_agg(DISTINCT jsonb_build_object(
    'ingredient', pin.ingredient,
    'amount', pin.amount
  ) ORDER BY pin.sort_order) FILTER (WHERE pin.id IS NOT NULL) AS ingredients
FROM products p
LEFT JOIN product_category_links pcl ON p.id = pcl.product_id
LEFT JOIN product_categories pc ON pcl.category_id = pc.id
LEFT JOIN product_images pi ON p.id = pi.product_id
LEFT JOIN product_tags pt ON p.id = pt.product_id
LEFT JOIN product_benefits pb ON p.id = pb.product_id
LEFT JOIN product_contraindications pci ON p.id = pci.product_id
LEFT JOIN product_ingredients pin ON p.id = pin.product_id
WHERE p.is_active = true
GROUP BY p.id;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Function to search products with full-text search
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  price DECIMAL,
  description TEXT,
  rating DECIMAL,
  reviews_count INTEGER,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.price,
    p.description,
    p.rating,
    p.reviews_count,
    ts_rank(p.search_vector, plainto_tsquery('spanish', search_query)) AS rank
  FROM products p
  LEFT JOIN product_category_links pcl ON p.id = pcl.product_id
  WHERE 
    p.is_active = true
    AND (search_query IS NULL OR p.search_vector @@ plainto_tsquery('spanish', search_query))
    AND (category_filter IS NULL OR pcl.category_id = category_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
  GROUP BY p.id, rank
  ORDER BY rank DESC, p.rating DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA INSERT (For testing - remove in production)
-- =====================================================

-- Insert sample categories
INSERT INTO product_categories (id, name, description) VALUES
  ('vitaminas-minerales', 'Vitaminas y Minerales', 'Suplementos vitamínicos y minerales esenciales'),
  ('salud-articular', 'Salud Articular', 'Productos para articulaciones y movilidad'),
  ('salud-digestiva', 'Salud Digestiva', 'Probióticos y salud intestinal')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE products IS 'Tabla principal de productos';
COMMENT ON TABLE product_categories IS 'Categorías de productos';
COMMENT ON TABLE product_images IS 'Imágenes de productos con orden';
COMMENT ON COLUMN products.search_vector IS 'Vector de búsqueda full-text generado automáticamente';
COMMENT ON INDEX idx_products_search_vector IS 'Índice GIN para búsqueda full-text rápida';

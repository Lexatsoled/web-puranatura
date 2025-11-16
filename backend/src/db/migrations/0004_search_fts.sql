CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
  name,
  description,
  category,
  tags,
  content = 'products',
  content_rowid = 'id',
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TRIGGER IF NOT EXISTS products_fts_insert
AFTER INSERT ON products
BEGIN
  INSERT INTO products_fts(rowid, name, description, category, tags)
  VALUES (
    new.id,
    new.name,
    COALESCE(new.description, ''),
    COALESCE(new.category, ''),
    COALESCE((
      SELECT GROUP_CONCAT(value, ' ')
      FROM json_each(COALESCE(NULLIF(new.tags, ''), '[]'))
    ), '')
  );
END;

CREATE TRIGGER IF NOT EXISTS products_fts_update
AFTER UPDATE ON products
BEGIN
  INSERT INTO products_fts(products_fts, rowid, name, description, category, tags)
  VALUES(
    'delete',
    old.id,
    old.name,
    COALESCE(old.description, ''),
    COALESCE(old.category, ''),
    COALESCE((
      SELECT GROUP_CONCAT(value, ' ')
      FROM json_each(COALESCE(NULLIF(old.tags, ''), '[]'))
    ), '')
  );

  INSERT INTO products_fts(rowid, name, description, category, tags)
  VALUES (
    new.id,
    new.name,
    COALESCE(new.description, ''),
    COALESCE(new.category, ''),
    COALESCE((
      SELECT GROUP_CONCAT(value, ' ')
      FROM json_each(COALESCE(NULLIF(new.tags, ''), '[]'))
    ), '')
  );
END;

CREATE TRIGGER IF NOT EXISTS products_fts_delete
AFTER DELETE ON products
BEGIN
  INSERT INTO products_fts(products_fts, rowid, name, description, category, tags)
  VALUES(
    'delete',
    old.id,
    old.name,
    COALESCE(old.description, ''),
    COALESCE(old.category, ''),
    COALESCE((
      SELECT GROUP_CONCAT(value, ' ')
      FROM json_each(COALESCE(NULLIF(old.tags, ''), '[]'))
    ), '')
  );
END;

INSERT INTO products_fts(rowid, name, description, category, tags)
SELECT
  p.id,
  p.name,
  COALESCE(p.description, ''),
  COALESCE(p.category, ''),
  COALESCE((
    SELECT GROUP_CONCAT(value, ' ')
    FROM json_each(COALESCE(NULLIF(p.tags, ''), '[]'))
  ), '')
FROM products AS p;

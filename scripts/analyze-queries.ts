#!/usr/bin/env node
import path from 'node:path';
import Database from 'better-sqlite3';
import { QueryAnalyzer } from '../backend/src/utils/queryAnalyzer.js';

const dbPath = path.resolve(process.cwd(), 'backend', 'database.sqlite');
const db = new Database(dbPath);
const analyzer = new QueryAnalyzer(db);

console.log('=== Analisis de Performance de Queries ===\n');

console.log('== Indices existentes ==');
const indexes = analyzer.listIndexes();
if (!indexes.length) {
  console.log('  (sin indices definidos)');
} else {
  indexes.forEach((idx) => {
    console.log(`  - ${idx.tableName}.${idx.name}`);
  });
}

console.log('\n== Analisis de queries frecuentes ==\n');

analyzer.analyzeQuery('SELECT * FROM products WHERE category = ?', ['vitaminas']);
analyzer.analyzeQuery('SELECT * FROM orders WHERE user_id = ? AND status = ?', ['user-1', 'pending']);
analyzer.analyzeQuery(
  `
    SELECT o.*, oi.*
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
  `,
  ['user-1'],
);

console.log('\n== Estadisticas de indices ==\n');
analyzer.getIndexStats();

db.close();

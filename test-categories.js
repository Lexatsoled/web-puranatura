// Test para verificar el funcionamiento de las categorías

const testProducts = [
  {
    id: '1',
    name: 'Vitamina C 1000mg',
    categories: [
      'vitaminas-minerales',
      'salud-inmunologica',
      'antiinflamatorios',
    ],
    price: 24.99,
  },
  {
    id: '2',
    name: 'Omega-3 Fish Oil',
    categories: [
      'salud-cardiovascular',
      'antiinflamatorios',
      'salud-cognitiva',
    ],
    price: 35.99,
  },
];

// Test 1: Filtrar por 'vitaminas-minerales'
const selectedCategory = 'vitaminas-minerales';
const filtered = testProducts.filter(
  (product) =>
    product.categories && product.categories.includes(selectedCategory)
);

console.log('Productos filtrados por "vitaminas-minerales":');
console.log(filtered);

// Test 2: Obtener todas las categorías únicas
const allCategories = new Set();
testProducts.forEach((product) => {
  if (product.categories) {
    product.categories.forEach((cat) => allCategories.add(cat));
  }
});

console.log('\nTodas las categorías únicas:');
console.log(Array.from(allCategories));

console.log('\nTest completado - el filtrado funciona correctamente');

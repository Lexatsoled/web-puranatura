#!/bin/bash
# Script para analizar productos con información faltante

echo "🔍 ANÁLISIS DE PRODUCTOS CON INFORMACIÓN FALTANTE"
echo "=================================================="

# Buscar productos que NO tienen detailedDescription
echo -e "\n❌ PRODUCTOS SIN DETAILED DESCRIPTION:"
grep -n "id:" data/products.ts | while read line; do
  id_line=$(echo $line | cut -d: -f1)
  product_id=$(echo $line | grep -o '"[^"]*"' | head -1)
  
  # Verificar si tiene detailedDescription en las siguientes 50 líneas
  has_detailed=$(sed -n "${id_line},$((id_line+50))p" data/products.ts | grep -c "detailedDescription")
  
  if [ $has_detailed -eq 0 ]; then
    product_name=$(sed -n "$((id_line+1))p" data/products.ts | grep -o "'[^']*'" | head -1)
    echo "  - Línea $id_line: $product_id $product_name"
  fi
done

# Buscar productos que NO tienen components
echo -e "\n❌ PRODUCTOS SIN COMPONENTS:"
grep -n "id:" data/products.ts | while read line; do
  id_line=$(echo $line | cut -d: -f1)
  product_id=$(echo $line | grep -o '"[^"]*"' | head -1)
  
  # Verificar si tiene components en las siguientes 50 líneas
  has_components=$(sed -n "${id_line},$((id_line+50))p" data/products.ts | grep -c "components:")
  
  if [ $has_components -eq 0 ]; then
    product_name=$(sed -n "$((id_line+1))p" data/products.ts | grep -o "'[^']*'" | head -1)
    echo "  - Línea $id_line: $product_id $product_name"
  fi
done

echo -e "\n✅ ANÁLISIS COMPLETADO"
#!/bin/bash

# Script para analizar chunks mayores a 300KB
echo "Analizando chunks mayores a 300KB..."
find dist/chunks -type f -name '*.js' -exec du -h {} + | awk '$1 > 300 { print $2, $1 }'
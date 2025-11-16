#!/bin/bash

URL="${1:-http://localhost:3000}"

echo "🧪 Running smoke tests against $URL"

# Test homepage
echo "Testing homepage..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$STATUS" -ne 200 ]; then
  echo "❌ Homepage failed: $STATUS"
  exit 1
fi
echo "✅ Homepage OK"

# Test API health
echo "Testing API health..."
API_URL="${URL/3000/3001}/health"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
if [ "$STATUS" -ne 200 ]; then
  echo "❌ API health check failed: $STATUS"
  exit 1
fi
echo "✅ API health OK"

# Test products endpoint
echo "Testing products endpoint..."
PRODUCTS_URL="${URL/3000/3001}/api/products"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTS_URL")
if [ "$STATUS" -ne 200 ]; then
  echo "❌ Products endpoint failed: $STATUS"
  exit 1
fi
echo "✅ Products endpoint OK"

echo "✅ All smoke tests passed"
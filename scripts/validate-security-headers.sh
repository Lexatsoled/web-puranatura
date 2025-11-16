#!/usr/bin/env bash

URL="${1:-http://localhost:3001}"

echo "🔒 Validando headers de seguridad para: $URL"
echo ""

get_header() {
  curl -sI "$URL" | grep -i "^$1:" | cut -d' ' -f2- | tr -d '\r'
}

echo "🛡  Content-Security-Policy:"
CSP=$(get_header "content-security-policy")
if [ -n "$CSP" ]; then
  echo "  ✅ Presente"
  echo "     $CSP"
else
  echo "  ❌ FALTA"
fi
echo ""

echo "🛡  Strict-Transport-Security:"
HSTS=$(get_header "strict-transport-security")
if [ -n "$HSTS" ]; then
  echo "  ✅ Presente"
  echo "     $HSTS"
  if echo "$HSTS" | grep -q "max-age=31536000"; then
    echo "     ✅ max-age >= 1 año"
  else
    echo "     ⚠️  max-age inferior a 1 año"
  fi
  if echo "$HSTS" | grep -q "includeSubDomains"; then
    echo "     ✅ includeSubDomains habilitado"
  else
    echo "     ⚠️  Falta includeSubDomains"
  fi
else
  echo "  ❌ FALTA"
fi
echo ""

echo "🛡  X-Frame-Options:"
XFO=$(get_header "x-frame-options")
if [ -n "$XFO" ]; then
  echo "  ✅ Presente: $XFO"
else
  echo "  ❌ FALTA"
fi
echo ""

echo "🛡  X-Content-Type-Options:"
XCTO=$(get_header "x-content-type-options")
if [ "$XCTO" = "nosniff" ]; then
  echo "  ✅ Presente: $XCTO"
else
  echo "  ❌ FALTA o incorrecto"
fi
echo ""

echo "🛡  Referrer-Policy:"
RP=$(get_header "referrer-policy")
if [ -n "$RP" ]; then
  echo "  ✅ Presente: $RP"
else
  echo "  ❌ FALTA"
fi
echo ""

echo "🛡  Permissions-Policy:"
PP=$(get_header "permissions-policy")
if [ -n "$PP" ]; then
  echo "  ✅ Presente"
  echo "     ${PP:0:100}..."
else
  echo "  ❌ FALTA"
fi
echo ""

echo "CORS:"
CORS=$(get_header "access-control-allow-origin")
if [ -n "$CORS" ]; then
  echo "  ℹ️  Access-Control-Allow-Origin: $CORS"
else
  echo "  ℹ️  Sin header (puede ser intencional)"
fi
echo ""

echo "📊 Herramientas externas recomendadas:"
echo "  • SecurityHeaders: https://securityheaders.com/?q=$URL"
echo "  • Mozilla Observatory: https://observatory.mozilla.org/analyze/$URL"
echo "  • HSTS Preload: https://hstspreload.org/?domain=${URL#https://}"

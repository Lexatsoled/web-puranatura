#!/usr/bin/env bash
# Ejecuta la secuencia completa de validaciones locales (lint, tests y build) fallando al primer error.
set -euo pipefail

npm run lint
npm run test:unit
npm run test:ci
npm run test:e2e
npm run ci:security
npm run build


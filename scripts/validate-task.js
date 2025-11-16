/**
 * Script de validación de tareas
 * Verifica que una tarea cumple con criterios de aceptación
 * 
 * Uso: node scripts/validate-task.js TASK-001
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class TaskValidator {
  constructor(taskId) {
    this.taskId = taskId;
    this.errors = [];
    this.warnings = [];
    this.passes = [];
    this.projectRoot = path.resolve(__dirname, '..');
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  pass(message) {
    this.passes.push(message);
    this.log(`✅ ${message}`, 'green');
  }

  warn(message) {
    this.warnings.push(message);
    this.log(`⚠️  ${message}`, 'yellow');
  }

  error(message) {
    this.errors.push(message);
    this.log(`❌ ${message}`, 'red');
  }

  info(message) {
    this.log(`ℹ️  ${message}`, 'cyan');
  }

  fileExists(filePath) {
    const fullPath = path.join(this.projectRoot, filePath);
    return fs.existsSync(fullPath);
  }

  readFile(filePath) {
    const fullPath = path.join(this.projectRoot, filePath);
    try {
      return fs.readFileSync(fullPath, 'utf8');
    } catch (err) {
      return null;
    }
  }

  runCommand(command, silent = false) {
    try {
      const output = execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: silent ? 'pipe' : 'inherit',
      });
      return { success: true, output };
    } catch (err) {
      return { success: false, error: err.message, output: err.stdout };
    }
  }

  // Validaciones específicas por tarea
  async validateTask001() {
    this.info('Validando TASK-001: Setup de detección de secretos');

    // Verificar archivos creados
    const requiredFiles = [
      '.gitleaksignore',
      '.github/workflows/secret-scan.yml',
    ];

    requiredFiles.forEach(file => {
      if (this.fileExists(file)) {
        this.pass(`Archivo creado: ${file}`);
      } else {
        this.error(`Archivo faltante: ${file}`);
      }
    });

    // Verificar modificaciones
    const preCommit = this.readFile('.husky/pre-commit');
    if (preCommit && preCommit.includes('gitleaks')) {
      this.pass('Pre-commit hook incluye gitleaks');
    } else {
      this.error('Pre-commit hook NO incluye gitleaks');
    }

    const packageJson = this.readFile('package.json');
    if (packageJson && packageJson.includes('scan:secrets')) {
      this.pass('package.json incluye scripts de escaneo');
    } else {
      this.error('package.json NO incluye scripts de escaneo');
    }

    // Verificar funcionalidad
    this.info('Verificando que gitleaks funciona...');
    const gitleaksTest = this.runCommand('npx gitleaks version', true);
    if (gitleaksTest.success) {
      this.pass('Gitleaks instalado y funcional');
    } else {
      this.warn('Gitleaks no encontrado (puede usar npx)');
    }
  }

  async validateTask002() {
    this.info('Validando TASK-002: Verificación histórica de secretos');

    // Verificar archivos creados
    const reportPath = 'reports/execution-2025-11-07/secret-history-audit.md';
    const scriptPath = 'scripts/audit-secret-history.sh';

    if (this.fileExists(reportPath)) {
      this.pass(`Reporte de auditoría creado: ${reportPath}`);
      
      const report = this.readFile(reportPath);
      if (report && report.includes('LIMPIO')) {
        this.pass('Historial verificado como LIMPIO');
      } else if (report && report.includes('ENCONTRADO')) {
        this.warn('Secretos encontrados en historial - ACCIÓN REQUERIDA');
      } else {
        this.error('Reporte incompleto o sin conclusión');
      }
    } else {
      this.error(`Reporte faltante: ${reportPath}`);
    }

    if (this.fileExists(scriptPath)) {
      this.pass(`Script de auditoría creado: ${scriptPath}`);
    } else {
      this.error(`Script faltante: ${scriptPath}`);
    }
  }

  async validateTask004() {
    this.info('Validando TASK-004: Migrar checkout a backend');

    // Verificar schema creado
    const schemaPath = 'backend/src/db/schema/orders.ts';
    if (this.fileExists(schemaPath)) {
      this.pass('Schema de orders creado');
      
      const schema = this.readFile(schemaPath);
      if (schema && schema.includes('orders') && schema.includes('orderItems')) {
        this.pass('Schema incluye tablas orders y orderItems');
      } else {
        this.error('Schema incompleto');
      }
    } else {
      this.error('Schema de orders faltante');
    }

    // Verificar ruta API
    const routePath = 'backend/src/routes/orders.ts';
    if (this.fileExists(routePath)) {
      this.pass('Ruta de orders creada');
    } else {
      this.error('Ruta de orders faltante');
    }

    // Verificar frontend actualizado
    const checkoutStore = this.readFile('src/store/checkoutStore.ts');
    if (checkoutStore && checkoutStore.includes('fetch') && checkoutStore.includes('/api/orders')) {
      this.pass('CheckoutStore actualizado para usar API');
    } else {
      this.error('CheckoutStore NO actualizado correctamente');
    }

    if (checkoutStore && !checkoutStore.includes('localStorage.setItem(\'pureza-naturalis-orders\'')) {
      this.pass('localStorage.setItem removido correctamente');
    } else {
      this.error('localStorage.setItem AÚN PRESENTE');
    }

    // Verificar migración aplicada
    this.info('Verificando migración de DB...');
    const dbPath = 'backend/database.sqlite';
    if (this.fileExists(dbPath)) {
      // Aquí podrías usar better-sqlite3 para verificar tablas
      this.info('Database existe - verificación manual recomendada');
    }
  }

  async validateGeneral() {
    this.info('Validaciones generales...');

    // ESLint
    const lintResult = this.runCommand('npm run lint', true);
    if (lintResult.success) {
      this.pass('ESLint: Sin errores');
    } else {
      this.error('ESLint: Tiene errores');
    }

    // TypeScript
    const typeCheckResult = this.runCommand('npm run type-check', true);
    if (typeCheckResult.success) {
      this.pass('TypeScript: Sin errores');
    } else {
      this.error('TypeScript: Tiene errores de tipos');
    }

    // Tests
    this.info('Ejecutando tests...');
    const testResult = this.runCommand('npm run test:ci', true);
    if (testResult.success) {
      this.pass('Tests: Todos pasando');
    } else {
      this.error('Tests: Algunos fallando');
    }
  }

  async validate() {
    this.log(`\n${'='.repeat(60)}`, 'blue');
    this.log(`🔍 Validando ${this.taskId}`, 'cyan');
    this.log(`${'='.repeat(60)}\n`, 'blue');

    // Validación específica según tarea
    const taskNumber = this.taskId.split('-')[1];
    const validatorMethod = `validateTask${taskNumber}`;

    if (typeof this[validatorMethod] === 'function') {
      await this[validatorMethod]();
    } else {
      this.warn(`No hay validador específico para ${this.taskId}`);
    }

    // Validaciones generales
    await this.validateGeneral();

    // Resumen
    this.log(`\n${'='.repeat(60)}`, 'blue');
    this.log('📊 RESUMEN DE VALIDACIÓN', 'cyan');
    this.log(`${'='.repeat(60)}\n`, 'blue');

    this.log(`✅ Pasadas: ${this.passes.length}`, 'green');
    this.log(`⚠️  Advertencias: ${this.warnings.length}`, 'yellow');
    this.log(`❌ Errores: ${this.errors.length}`, 'red');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      this.log(`\n🎉 ${this.taskId} COMPLETAMENTE VALIDADA`, 'green');
      return 0;
    } else if (this.errors.length === 0) {
      this.log(`\n⚠️  ${this.taskId} VALIDADA CON ADVERTENCIAS`, 'yellow');
      return 1;
    } else {
      this.log(`\n❌ ${this.taskId} FALLÓ VALIDACIÓN`, 'red');
      return 2;
    }
  }
}

// Ejecutar validación
const taskId = process.argv[2];

if (!taskId) {
  console.error('❌ Error: Debes especificar un TASK-ID');
  console.error('Uso: node scripts/validate-task.js TASK-001');
  process.exit(1);
}

const validator = new TaskValidator(taskId);
validator.validate()
  .then(exitCode => process.exit(exitCode))
  .catch(err => {
    console.error('❌ Error durante validación:', err);
    process.exit(3);
  });

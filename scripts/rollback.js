/**
 * Script de rollback - Revertir a checkpoint anterior
 * Recupera estado previo de manera segura
 * 
 * Uso: node scripts/rollback.js TASK-001-2025-11-07T10-30-00-000Z
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

class RollbackManager {
  constructor(checkpointId) {
    this.checkpointId = checkpointId;
    this.projectRoot = path.resolve(__dirname, '..');
    this.checkpointDir = path.join(this.projectRoot, '.checkpoints');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  runCommand(command, silent = false) {
    try {
      const output = execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: silent ? 'pipe' : 'inherit',
      });
      return { success: true, output };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        output: error.stdout || '',
      };
    }
  }

  async confirm(question) {
    return new Promise(resolve => {
      this.rl.question(`${colors.yellow}${question} (sí/no): ${colors.reset}`, answer => {
        resolve(answer.toLowerCase() === 'sí' || answer.toLowerCase() === 'si');
      });
    });
  }

  loadCheckpointState() {
    const stateFile = path.join(this.checkpointDir, `${this.checkpointId}.json`);
    
    if (!fs.existsSync(stateFile)) {
      throw new Error(`Checkpoint no encontrado: ${stateFile}`);
    }

    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    this.log('\n📋 Información del Checkpoint:', 'cyan');
    this.log(`   Task: ${state.taskId}`);
    this.log(`   Descripción: ${state.description}`);
    this.log(`   Fecha: ${new Date(state.timestamp).toLocaleString()}`);
    this.log(`   Commit: ${state.git.shortCommit} (${state.git.branch})`);

    return state;
  }

  verifyGitStatus() {
    this.log('\n🔍 Verificando estado de Git...', 'cyan');
    
    const status = this.runCommand('git status --porcelain', true);
    
    if (status.output && status.output.trim()) {
      this.log('⚠️  ADVERTENCIA: Hay cambios sin commitear:', 'yellow');
      console.log(status.output);
      return false;
    }

    this.log('✅ Working directory limpio', 'green');
    return true;
  }

  async createBackup() {
    this.log('\n💾 Creando backup del estado actual...', 'cyan');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupBranch = `backup-before-rollback-${timestamp}`;
    
    const result = this.runCommand(`git checkout -b ${backupBranch}`, true);
    
    if (result.success) {
      this.log(`✅ Backup branch creado: ${backupBranch}`, 'green');
      
      // Volver a branch original
      const currentBranch = this.runCommand('git rev-parse --abbrev-ref HEAD', true).output.trim();
      this.runCommand(`git checkout ${currentBranch}`, true);
      
      return backupBranch;
    } else {
      throw new Error('No se pudo crear backup branch');
    }
  }

  async performRollback(state) {
    this.log('\n🔄 Ejecutando rollback...', 'cyan');

    const tagName = `checkpoint-${this.checkpointId}`;
    
    // Verificar que el tag existe
    const tagExists = this.runCommand(`git tag -l ${tagName}`, true);
    if (!tagExists.output.trim()) {
      throw new Error(`Tag no encontrado: ${tagName}`);
    }

    // Opciones de rollback
    this.log('\nOpciones de rollback:', 'cyan');
    this.log('1. Soft rollback (mantener cambios en working directory)');
    this.log('2. Mixed rollback (mantener archivos, deshacer staging)');
    this.log('3. Hard rollback (eliminar TODOS los cambios) ⚠️ PELIGROSO');

    const mode = await new Promise(resolve => {
      this.rl.question('Selecciona modo (1/2/3): ', answer => {
        resolve(answer);
      });
    });

    let gitCommand;
    switch (mode) {
      case '1':
        gitCommand = `git reset --soft ${tagName}`;
        this.log('Ejecutando soft rollback...', 'yellow');
        break;
      case '2':
        gitCommand = `git reset --mixed ${tagName}`;
        this.log('Ejecutando mixed rollback...', 'yellow');
        break;
      case '3':
        const confirmed = await this.confirm('⚠️  ADVERTENCIA: Esto eliminará TODOS los cambios. ¿Continuar?');
        if (!confirmed) {
          throw new Error('Rollback cancelado por el usuario');
        }
        gitCommand = `git reset --hard ${tagName}`;
        this.log('Ejecutando hard rollback...', 'red');
        break;
      default:
        throw new Error('Opción inválida');
    }

    const result = this.runCommand(gitCommand);
    
    if (result.success) {
      this.log('✅ Rollback completado', 'green');
    } else {
      throw new Error('Rollback falló');
    }
  }

  generateRollbackReport(state, backupBranch) {
    this.log('\n📝 Generando reporte...', 'cyan');

    const report = `# Rollback Report

**Checkpoint ID:** ${this.checkpointId}  
**Task:** ${state.taskId}  
**Fecha Rollback:** ${new Date().toLocaleString()}  
**Backup Branch:** \`${backupBranch}\`

## Estado Restaurado

- **Commit:** ${state.git.commit}
- **Branch:** ${state.git.branch}
- **Descripción:** ${state.description}

## Recuperación de Cambios Previos

Si necesitas recuperar los cambios que existían antes del rollback:

\`\`\`bash
# Ver cambios en el backup
git checkout ${backupBranch}

# Recuperar archivo específico
git checkout ${backupBranch} -- path/to/file

# Mergear cambios selectivos
git checkout main
git cherry-pick <commit-hash>
\`\`\`

## Verificación Post-Rollback

\`\`\`bash
# Verificar estado
git status

# Verificar logs
git log --oneline -10

# Ejecutar tests
npm run test
\`\`\`

---
*Rollback ejecutado por scripts/rollback.js*
`;

    const reportFile = path.join(
      this.checkpointDir,
      `rollback-${this.checkpointId}-${new Date().toISOString().replace(/[:.]/g, '-')}.md`
    );
    fs.writeFileSync(reportFile, report);
    this.log(`✅ Reporte generado: ${path.basename(reportFile)}`, 'green');
  }

  async execute() {
    try {
      this.log('\n' + '='.repeat(60), 'cyan');
      this.log('🔙 ROLLBACK MANAGER', 'cyan');
      this.log('='.repeat(60) + '\n', 'cyan');

      // Cargar estado del checkpoint
      const state = this.loadCheckpointState();

      // Verificar Git
      const isClean = this.verifyGitStatus();
      
      if (!isClean) {
        const proceed = await this.confirm('¿Deseas hacer stash de los cambios y continuar?');
        if (!proceed) {
          throw new Error('Rollback cancelado - working directory no está limpio');
        }
        
        this.runCommand(`git stash push -u -m "pre-rollback-stash-${new Date().toISOString()}"`);
        this.log('✅ Cambios guardados en stash', 'green');
      }

      // Confirmar rollback
      const confirmRollback = await this.confirm(`¿Deseas hacer rollback a ${state.taskId}?`);
      if (!confirmRollback) {
        throw new Error('Rollback cancelado por el usuario');
      }

      // Crear backup
      const backupBranch = await this.createBackup();

      // Ejecutar rollback
      await this.performRollback(state);

      // Generar reporte
      this.generateRollbackReport(state, backupBranch);

      this.log('\n' + '='.repeat(60), 'green');
      this.log('✅ ROLLBACK COMPLETADO EXITOSAMENTE', 'green');
      this.log('='.repeat(60) + '\n', 'green');

      this.log(`📌 Estado restaurado: ${state.git.shortCommit}`, 'cyan');
      this.log(`💾 Backup disponible en: ${backupBranch}`, 'cyan');

    } catch (error) {
      this.log(`\n❌ Error durante rollback: ${error.message}`, 'red');
      throw error;
    } finally {
      this.rl.close();
    }
  }
}

// Ejecutar
const checkpointId = process.argv[2];

if (!checkpointId) {
  console.error('❌ Error: Debes especificar un checkpoint ID');
  console.error('Uso: node scripts/rollback.js TASK-001-2025-11-07T10-30-00-000Z');
  console.error('\nPara ver checkpoints disponibles:');
  console.error('  ls .checkpoints/*.json');
  process.exit(1);
}

const manager = new RollbackManager(checkpointId);
manager.execute()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

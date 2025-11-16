/**
 * Script de checkpoint - Guardar estado actual del proyecto
 * Crea snapshot antes de cambios mayores
 * 
 * Uso: node scripts/checkpoint.js TASK-001 "Descripción del checkpoint"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

class CheckpointManager {
  constructor(taskId, description) {
    this.taskId = taskId;
    this.description = description;
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.projectRoot = path.resolve(__dirname, '..');
    this.checkpointDir = path.join(this.projectRoot, '.checkpoints');
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  ensureCheckpointDir() {
    if (!fs.existsSync(this.checkpointDir)) {
      fs.mkdirSync(this.checkpointDir, { recursive: true });
      this.log('📁 Directorio .checkpoints creado', 'cyan');
    }
  }

  runCommand(command) {
    try {
      return execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf8',
      });
    } catch (error) {
      throw new Error(`Error ejecutando: ${command}\n${error.message}`);
    }
  }

  createGitSnapshot() {
    this.log('\n📸 Creando snapshot de Git...', 'cyan');
    
    // Verificar si hay cambios sin commitear
    const status = this.runCommand('git status --porcelain');
    
    if (status.trim()) {
      this.log('⚠️  Hay cambios sin commitear:', 'yellow');
      console.log(status);
      
      // Crear stash con mensaje descriptivo
      const stashMessage = `checkpoint-${this.taskId}-${this.timestamp}`;
      this.runCommand(`git stash push -u -m "${stashMessage}"`);
      this.log(`✅ Cambios guardados en stash: ${stashMessage}`, 'green');
    } else {
      this.log('✅ Working directory limpio', 'green');
    }

    // Crear tag
    const tagName = `checkpoint-${this.taskId}-${this.timestamp}`;
    const tagMessage = `${this.description}\nTask: ${this.taskId}\nDate: ${new Date().toISOString()}`;
    
    this.runCommand(`git tag -a "${tagName}" -m "${tagMessage}"`);
    this.log(`✅ Tag creado: ${tagName}`, 'green');

    return tagName;
  }

  captureProjectState() {
    this.log('\n📊 Capturando estado del proyecto...', 'cyan');

    const state = {
      taskId: this.taskId,
      description: this.description,
      timestamp: this.timestamp,
      git: {
        branch: this.runCommand('git rev-parse --abbrev-ref HEAD').trim(),
        commit: this.runCommand('git rev-parse HEAD').trim(),
        shortCommit: this.runCommand('git rev-parse --short HEAD').trim(),
      },
      dependencies: {},
      files: {
        total: 0,
        byType: {},
      },
    };

    // Capturar dependencias
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
      );
      state.dependencies = {
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
      };
    } catch (error) {
      this.log('⚠️  No se pudo leer package.json', 'yellow');
    }

    // Capturar estadísticas de archivos
    const gitFiles = this.runCommand('git ls-files').split('\n').filter(Boolean);
    state.files.total = gitFiles.length;
    
    gitFiles.forEach(file => {
      const ext = path.extname(file) || 'no-ext';
      state.files.byType[ext] = (state.files.byType[ext] || 0) + 1;
    });

    // Guardar estado
    const stateFile = path.join(
      this.checkpointDir,
      `${this.taskId}-${this.timestamp}.json`
    );
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    this.log(`✅ Estado guardado: ${path.basename(stateFile)}`, 'green');

    return state;
  }

  generateReport(tagName, state) {
    this.log('\n📝 Generando reporte...', 'cyan');

    const report = `# Checkpoint: ${this.taskId}

**Descripción:** ${this.description}  
**Fecha:** ${new Date().toLocaleString()}  
**Tag Git:** \`${tagName}\`

## Estado del Repositorio

- **Branch:** ${state.git.branch}
- **Commit:** ${state.git.commit}
- **Short Commit:** ${state.git.shortCommit}

## Archivos Rastreados

- **Total:** ${state.files.total} archivos
- **Por tipo:**
${Object.entries(state.files.byType)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 10)
  .map(([ext, count]) => `  - ${ext}: ${count}`)
  .join('\n')}

## Dependencias

### Production
\`\`\`json
${JSON.stringify(state.dependencies.dependencies, null, 2)}
\`\`\`

### Development
\`\`\`json
${JSON.stringify(state.dependencies.devDependencies, null, 2)}
\`\`\`

## Recuperación

Para volver a este checkpoint:

\`\`\`bash
# Ver información del checkpoint
git show ${tagName}

# Volver a este estado (CUIDADO: elimina cambios)
git checkout ${tagName}

# Crear branch desde este checkpoint
git checkout -b recovery-${this.taskId} ${tagName}
\`\`\`

---
*Checkpoint automático generado por scripts/checkpoint.js*
`;

    const reportFile = path.join(
      this.checkpointDir,
      `${this.taskId}-${this.timestamp}.md`
    );
    fs.writeFileSync(reportFile, report);
    this.log(`✅ Reporte generado: ${path.basename(reportFile)}`, 'green');
  }

  async create() {
    this.log('\n' + '='.repeat(60), 'cyan');
    this.log(`💾 Creando Checkpoint: ${this.taskId}`, 'cyan');
    this.log('='.repeat(60) + '\n', 'cyan');

    this.ensureCheckpointDir();
    const tagName = this.createGitSnapshot();
    const state = this.captureProjectState();
    this.generateReport(tagName, state);

    this.log('\n' + '='.repeat(60), 'green');
    this.log('✅ CHECKPOINT CREADO EXITOSAMENTE', 'green');
    this.log('='.repeat(60) + '\n', 'green');

    this.log(`📌 Tag: ${tagName}`, 'cyan');
    this.log(`📁 Archivos: .checkpoints/${this.taskId}-${this.timestamp}.*`, 'cyan');
  }
}

// Ejecutar
const taskId = process.argv[2];
const description = process.argv[3];

if (!taskId || !description) {
  console.error('❌ Error: Faltan argumentos');
  console.error('Uso: node scripts/checkpoint.js TASK-001 "Descripción"');
  process.exit(1);
}

const manager = new CheckpointManager(taskId, description);
manager.create()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error creando checkpoint:', err.message);
    process.exit(1);
  });

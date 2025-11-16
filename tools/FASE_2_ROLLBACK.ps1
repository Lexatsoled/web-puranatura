#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de Rollback para Fase 2
    Revierte cambios si algo sale mal

.DESCRIPTION
    Opciones:
    - Revertir últimos commits
    - Restaurar desde backup
    - Limpiar caché y rebuild
    - Revertir a baseline de métricas

.EXAMPLE
    .\FASE_2_ROLLBACK.ps1 -Task perf-img-001
    .\FASE_2_ROLLBACK.ps1 -RevertLastCommit -Commits 3
    .\FASE_2_ROLLBACK.ps1 -FullRollback
#>

param(
    [ValidateSet('perf-img-001', 'perf-bundle-001', 'perf-cache-001', 'perf-n+1-001', 'ux-error-001')]
    [string]$Task,
    [switch]$RevertLastCommit = $false,
    [int]$Commits = 1,
    [switch]$FullRollback = $false,
    [switch]$CleanBuild = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = 'Stop'

# ============================================================================
# CONFIGURACIÓN
# ============================================================================

$Colors = @{
    Info    = 'Cyan'
    Success = 'Green'
    Warning = 'Yellow'
    Error   = 'Red'
    Header  = 'Magenta'
}

$RollbackMap = @{
    'perf-img-001' = @{
        files = @(
            'src/components/ProductImage.tsx',
            'src/components/ImageZoom.tsx',
            'scripts/optimize-images.js'
        ),
        restore = 'git checkout HEAD~1 -- {files}'
    }
    'perf-bundle-001' = @{
        files = @(
            'vite.config.ts',
            'src/main.tsx'
        ),
        branches = @('fase-2')
    }
    'perf-cache-001' = @{
        files = @(
            'backend/src/plugins/cacheHeaders.ts',
            'backend/src/plugins/redisCache.ts',
            'src/hooks/useCache.ts'
        )
    }
    'perf-n+1-001' = @{
        files = @(
            'backend/src/routes/v1/products.ts',
            'backend/src/plugins/queryProfiler.ts'
        )
    }
    'ux-error-001' = @{
        files = @(
            'src/hooks/useErrorBoundary.ts',
            'src/components/ErrorBoundary.tsx',
            'backend/src/plugins/errorHandler.ts'
        )
    }
}

# ============================================================================
# FUNCIONES
# ============================================================================

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor $Colors.Header
    Write-Host "║  $($Text.PadRight(66))  ║" -ForegroundColor $Colors.Header
    Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor $Colors.Header
    Write-Host ""
}

function Write-Section {
    param([string]$Text)
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "  $Text" -ForegroundColor $Colors.Info
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
}

function Confirm-Action {
    param([string]$Message)
    
    $response = Read-Host "$Message (s/n)"
    return $response -eq 's'
}

function Get-GitStatus {
    $status = git status --porcelain
    return $status
}

function Revert-Commits {
    param([int]$Count)
    
    Write-Section "🔄 Revirtiendo últimos $Count commits"
    
    # Ver commits a revertir
    Write-Host "Commits a revertir:" -ForegroundColor $Colors.Warning
    git log --oneline -$Count
    
    Write-Host ""
    if (Confirm-Action "¿Revertir estos commits?") {
        git reset --hard HEAD~$Count
        Write-Host "✅ Revertido a HEAD~$Count" -ForegroundColor $Colors.Success
    }
    else {
        Write-Host "❌ Operación cancelada" -ForegroundColor $Colors.Error
        exit 1
    }
}

function Revert-SpecificTask {
    param([string]$TaskId)
    
    Write-Section "🔄 Revirtiendo tarea: $TaskId"
    
    $rollbackInfo = $RollbackMap[$TaskId]
    
    if (-not $rollbackInfo) {
        Write-Host "❌ Tarea no encontrada: $TaskId" -ForegroundColor $Colors.Error
        exit 1
    }
    
    Write-Host "Archivos a revertir:" -ForegroundColor $Colors.Warning
    $rollbackInfo.files | ForEach-Object {
        Write-Host "  - $_"
    }
    
    Write-Host ""
    if (Confirm-Action "¿Revertir estos archivos?") {
        $rollbackInfo.files | ForEach-Object {
            try {
                git checkout HEAD -- $_
                Write-Host "  ✅ Revertido: $_" -ForegroundColor $Colors.Success
            }
            catch {
                Write-Host "  ⚠️  Error revirtiendo $_: $_" -ForegroundColor $Colors.Warning
            }
        }
    }
}

function Full-Rollback {
    Write-Header "⚠️  ROLLBACK COMPLETO - FASE 2"
    
    Write-Host "⚠️  ADVERTENCIA: Esto revierte TODOS los cambios de Fase 2" -ForegroundColor $Colors.Error
    Write-Host ""
    
    if (Confirm-Action "¿Continuar con rollback completo?") {
        Write-Host ""
        if (Confirm-Action "¿Estás REALMENTE seguro?") {
            Write-Section "🔄 Revirtiendo a main"
            
            # Guardar cambios en stash
            git stash push -m "Rollback point before Fase 2 revert - $(Get-Date -Format 'yyyyMMdd-HHmmss')"
            Write-Host "✅ Cambios guardados en stash" -ForegroundColor $Colors.Success
            
            # Revertir a main
            git checkout main
            git reset --hard origin/main
            
            Write-Host "✅ Reverted to main" -ForegroundColor $Colors.Success
            Write-Host ""
            Write-Host "Para restaurar cambios: git stash pop" -ForegroundColor $Colors.Info
        }
    }
}

function Clean-Build {
    Write-Section "🧹 Limpieza de Build"
    
    $itemsToClean = @(
        './dist',
        './node_modules/.vite',
        './node_modules/.cache'
    )
    
    $itemsToClean | ForEach-Object {
        if (Test-Path $_) {
            Write-Host "  → Eliminando: $_" -ForegroundColor Gray -NoNewline
            Remove-Item -Path $_ -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host " ✅" -ForegroundColor $Colors.Success
        }
    }
    
    Write-Host ""
    Write-Host "→ Reinstalando dependencias..." -ForegroundColor Gray -NoNewline
    npm ci 2>&1 | Out-Null
    Write-Host " ✅" -ForegroundColor $Colors.Success
    
    Write-Host "→ Rebuilding..." -ForegroundColor Gray -NoNewline
    npm run build 2>&1 | Out-Null
    Write-Host " ✅" -ForegroundColor $Colors.Success
}

function Rollback-Database {
    Write-Section "🗄️  Verificar Estado de Base de Datos"
    
    $backupPath = './tools/backups/database-pre-fase2.sqlite'
    
    if (Test-Path $backupPath) {
        Write-Host "Backup encontrado: $backupPath" -ForegroundColor $Colors.Info
        
        if (Confirm-Action "¿Restaurar base de datos desde backup?") {
            $dbPath = './backend/database.sqlite'
            
            # Crear backup del actual
            Copy-Item -Path $dbPath -Destination "$dbPath.rollback-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            
            # Restaurar
            Copy-Item -Path $backupPath -Destination $dbPath -Force
            
            Write-Host "✅ Base de datos restaurada" -ForegroundColor $Colors.Success
        }
    }
    else {
        Write-Host "ℹ️  No hay backup de base de datos" -ForegroundColor $Colors.Info
    }
}

function Show-GitLog {
    Write-Section "📝 Últimos Commits"
    
    git log --oneline -20
}

function Validate-Rollback {
    Write-Section "✅ Verificando Rollback"
    
    $changes = Get-GitStatus
    
    if ($changes) {
        Write-Host "⚠️  Aún hay cambios no commiteados:" -ForegroundColor $Colors.Warning
        $changes | ForEach-Object {
            Write-Host "  - $_"
        }
    }
    else {
        Write-Host "✅ Directorio limpio" -ForegroundColor $Colors.Success
    }
    
    Write-Host ""
    Write-Host "Rama actual: $(git rev-parse --abbrev-ref HEAD)" -ForegroundColor $Colors.Info
}

# ============================================================================
# MAIN
# ============================================================================

if ($FullRollback) {
    Full-Rollback
}
elseif ($RevertLastCommit) {
    Revert-Commits $Commits
}
elseif ($Task) {
    Revert-SpecificTask $Task
}
elseif ($CleanBuild) {
    Clean-Build
}
else {
    Write-Header "🔄 ROLLBACK - FASE 2"
    
    Write-Section "📋 OPCIONES DISPONIBLES"
    
    Write-Host ""
    Write-Host "1. Revertir commits específicos:" -ForegroundColor $Colors.Info
    Write-Host "   .\FASE_2_ROLLBACK.ps1 -RevertLastCommit -Commits 3" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Revertir tarea específica:" -ForegroundColor $Colors.Info
    Write-Host "   .\FASE_2_ROLLBACK.ps1 -Task perf-img-001" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Limpieza de build:" -ForegroundColor $Colors.Info
    Write-Host "   .\FASE_2_ROLLBACK.ps1 -CleanBuild" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Rollback completo a main:" -ForegroundColor $Colors.Info
    Write-Host "   .\FASE_2_ROLLBACK.ps1 -FullRollback" -ForegroundColor Gray
    Write-Host ""
    
    Write-Section "📊 Estado Actual"
    
    Show-GitLog
    Write-Host ""
    Validate-Rollback
}

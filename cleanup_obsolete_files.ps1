# PowerShell script for safe deletion of obsolete files in Pureza-Naturalis-V3
# This script performs safety checks before deletion

param(
    [switch]$DryRun,
    [switch]$Force
)

Write-Host "🧹 Pureza-Naturalis-V3 Obsolete Files Cleanup Script" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Files to delete (identified as obsolete)
$obsoleteFiles = @(
    # Root level unused files
    "SimpleHomePage.tsx",
    "TestImagePage.tsx",
    "convertidor-imagenes.html",
    "test-navigation.html",
    "temp_storepage_backup.txt",

    # Temporary/test images
    "Goku_live_action.jpg",
    "fish-oil-details.txt",
    "same-details.txt",
    "Supersayayin.png",

    # Analysis files (keep for documentation but mark as obsolete)
    # These are kept for historical reference but not needed in production
    # "ANALISIS_*.md" - Keep for documentation
    # "DIAGNOSTICO_*.md" - Keep for documentation
)

# Files that exist and are referenced (DO NOT DELETE)
$protectedFiles = @(
    "App.tsx",           # Main app component
    "SimpleLayout.tsx",  # Layout component
    "index.tsx",         # Entry point
    "index.html",        # HTML template
    "package.json",      # Dependencies
    "tsconfig.json",     # TypeScript config
    "vite.config.ts",    # Build config
    "tailwind.config.js" # Styling config
)

Write-Host "`n📋 Files identified for deletion:" -ForegroundColor Yellow
foreach ($file in $obsoleteFiles) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        Write-Host "  ❌ $file" -ForegroundColor Red
    } else {
        Write-Host "  ⚠️  $file (not found)" -ForegroundColor Yellow
    }
}

Write-Host "`n🛡️  Protected files (will not be deleted):" -ForegroundColor Green
foreach ($file in $protectedFiles) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❓ $file (not found)" -ForegroundColor Yellow
    }
}

# Safety checks
Write-Host "`n🔍 Performing safety checks..." -ForegroundColor Cyan

$safetyChecks = @(
    @{ Name = "Backup exists"; Check = { Test-Path "../backup_pureza_naturalis_v3_*.zip" } },
    @{ Name = "Git repository"; Check = { Test-Path ".git" } },
    @{ Name = "Node modules exist"; Check = { Test-Path "node_modules" } },
    @{ Name = "Source directory exists"; Check = { Test-Path "src" } }
)

$allChecksPass = $true
foreach ($check in $safetyChecks) {
    $result = & $check.Check
    if ($result) {
        Write-Host "  ✅ $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($check.Name)" -ForegroundColor Red
        $allChecksPass = $false
    }
}

if (-not $allChecksPass -and -not $Force) {
    Write-Host "`n❌ Safety checks failed. Use -Force to override." -ForegroundColor Red
    exit 1
}

if ($DryRun) {
    Write-Host "`n🔍 DRY RUN MODE - No files will be deleted" -ForegroundColor Yellow
    Write-Host "Run without -DryRun to perform actual deletion" -ForegroundColor Yellow
    exit 0
}

# Confirmation
if (-not $Force) {
    $confirmation = Read-Host "`n⚠️  This will permanently delete the listed files. Continue? (y/N)"
    if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
        Write-Host "Operation cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Perform deletion
Write-Host "`n🗑️  Deleting obsolete files..." -ForegroundColor Cyan

$deletedCount = 0
$failedCount = 0

foreach ($file in $obsoleteFiles) {
    $fullPath = Join-Path $PSScriptRoot $file

    if (Test-Path $fullPath) {
        try {
            Remove-Item $fullPath -Force
            Write-Host "  ✅ Deleted: $file" -ForegroundColor Green
            $deletedCount++
        } catch {
            Write-Host "  ❌ Failed to delete: $file ($($_.Exception.Message))" -ForegroundColor Red
            $failedCount++
        }
    } else {
        Write-Host "  ⚠️  Not found: $file" -ForegroundColor Yellow
    }
}

# Summary
Write-Host "`n📊 Cleanup Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Files deleted: $deletedCount" -ForegroundColor Green
Write-Host "  ❌ Failed deletions: $failedCount" -ForegroundColor Red
Write-Host "  📁 Total files processed: $($obsoleteFiles.Count)" -ForegroundColor Blue

if ($deletedCount -gt 0) {
    Write-Host "`n🔄 Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run 'npm run build' to verify the build still works" -ForegroundColor White
    Write-Host "  2. Run 'npm run dev' to verify the app starts correctly" -ForegroundColor White
    Write-Host "  3. Run tests to ensure functionality is intact" -ForegroundColor White
    Write-Host "  4. Commit changes: 'git add . && git commit -m \"Remove obsolete files\"'" -ForegroundColor White
}

Write-Host "`n🎉 Cleanup completed!" -ForegroundColor Green
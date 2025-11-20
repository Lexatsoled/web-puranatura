param(
    [string]$Inventory = "docs_inventory.json"
)
Write-Host "Generando limpieza documental usando $Inventory"
if(-Not (Test-Path $Inventory)) { throw "Inventario no encontrado" }
# Ejemplo simple: mover carpetas conocidas
$targets = @(
    @{Path='Analisis GPT 51'; Dest='archive/legacy-analysis'},
    @{Path='reports'; Dest='archive/legacy-reports'},
    @{Path='docs'; Dest='archive/legacy-docs'},
    @{Path='Problemas Encontrados en GitHub'; Dest='archive/legacy-ci-logs'},
    @{Path='temp_trace_extract1'; Dest='archive/temp-traces'}
)
foreach($target in $targets){
    if(Test-Path $target.Path){
        if(-Not (Test-Path $target.Dest)) { New-Item -ItemType Directory -Path $target.Dest -Force | Out-Null }
        Write-Host "Moviendo $($target.Path) -> $($target.Dest)"
        Move-Item $target.Path $target.Dest -Force
    }
}

@echo off
set "BACKUP_DIR=backups"
set "TIMESTAMP=%date:~-4%_%date:~3,2%_%date:~0,2%__%time:~0,2%_%time:~3,2%_%time:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"
set "FILENAME=%BACKUP_DIR%\backup_%TIMESTAMP%.sql"

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo [BACKUP] Iniciando copia de seguridad de PostgreSQL...
echo [BACKUP] Contenedor: puranatura-db
echo [BACKUP] Destino: %FILENAME%

docker exec -t puranatura-db pg_dump -U admin -d puranatura > "%FILENAME%"

if %ERRORLEVEL% EQU 0 (
    echo [BACKUP] EXITO: Copia de seguridad creada correctamente.
) else (
    echo [BACKUP] ERROR: Fallo al crear la copia de seguridad.
)

pause

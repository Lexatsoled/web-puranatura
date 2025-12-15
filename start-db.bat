@echo off
echo Iniciando Base de Datos PuraNatura...
docker-compose up -d
echo.
echo Base de datos iniciada en segundo plano.
echo Puedes acceder en localhost:5432
pause

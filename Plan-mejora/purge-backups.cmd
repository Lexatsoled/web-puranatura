@echo off
setlocal
set TARGET_DIR="C:\Users\Usuario\Desktop\Web Puranatura\web-puranatura---terapias-naturales\backups"
forfiles /p %TARGET_DIR% /m *.db /d -7 /c "cmd /c del @path"
endlocal

@echo off
set DATABASE_URL=file:./prisma/dev.db
cd /d "C:\Users\Usuario\Desktop\Web Puranatura\web-puranatura---terapias-naturales"
npm run backup:safe >> "%LOCALAPPDATA%\Puranatura\backup-task.log" 2>&1

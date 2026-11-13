@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 goto nonode
node -e "process.exit(Number(process.versions.node.split('.')[0])>=22?0:1)"
if errorlevel 1 goto nonode
if not exist node_modules (
  echo Instalando dependencias, puede tardar unos minutos...
  call npm install
)
start "Worker 2con2estudio" cmd /k "npm run worker:node"
start "Web 2con2estudio" cmd /k "npm run dev"
timeout /t 10 >nul
start http://localhost:5173
exit /b 0
:nonode
echo Falta Node.js 22 o superior. Instala la version LTS desde https://nodejs.org y vuelve a abrir este archivo.
pause
exit /b 1

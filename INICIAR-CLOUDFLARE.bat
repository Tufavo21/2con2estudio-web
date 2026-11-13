@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Falta Node.js 22 o superior. Instalalo desde https://nodejs.org
  pause
  exit /b 1
)
node scripts\deploy-cloudflare.mjs
echo.
pause

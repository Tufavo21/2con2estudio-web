@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Subiendo el proyecto a https://github.com/Tufavo21/2con2estudio-web
where git >nul 2>nul
if errorlevel 1 (
  echo Falta Git. Instalalo desde https://git-scm.com/download/win y vuelve a abrir este archivo.
  echo NOGIT> subir-github.log
  pause
  exit /b 1
)
if not exist .git git init -b main
git config user.name >nul 2>nul || git config user.name "Tufavo21"
git config user.email >nul 2>nul || git config user.email "Tufavo21@users.noreply.github.com"
git add -A
git commit -m "Demo web de 2con2estudio" -m "Web React + Vite y Worker de Cloudflare para el formulario (modo demo)." -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01JhKn9Lnxdb4zmhcallfym1"
git remote get-url origin >nul 2>nul || git remote add origin https://github.com/Tufavo21/2con2estudio-web.git
git branch -M main
echo.
echo Si se abre una ventana para iniciar sesion en GitHub, entra con tu cuenta y acepta.
git push -u origin main
echo EXIT=%errorlevel%> subir-github.log
echo.
pause

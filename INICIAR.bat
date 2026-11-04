@echo off
title PASION RL BIKERS - Iniciar sitio
cd /d "%~dp0"
echo ==========================================
echo       PASION RL BIKERS
echo ==========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: No se encontro Node.js.
  echo Instala Node.js LTS y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Instalando componentes necesarios. Esto solo se hace la primera vez...
  call npm install
  if errorlevel 1 (
    echo.
    echo No se pudieron instalar los componentes. Revisa tu conexion a internet.
    pause
    exit /b 1
  )
)
echo.
echo Iniciando el sitio...
start "" http://localhost:3000
call npm start
pause

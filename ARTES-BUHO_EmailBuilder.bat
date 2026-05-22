@echo off
REM =============================================================
REM  ARTES BUHO - Email Builder
REM  Desarrollado por RUBEN COTON para ARTES BUHO MANAGEMENT
REM =============================================================
title ARTES BUHO - Email Builder
cd /d "%~dp0"

REM Comprueba Node disponible
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js no esta instalado o no esta en PATH.
  echo Instala Node desde https://nodejs.org/ y vuelve a ejecutar.
  pause
  exit /b 1
)

REM Arranca servidor en segundo plano
start "ARTES BUHO Server" /MIN cmd /c "node server.js"

REM Espera breve y abre navegador
timeout /t 2 /nobreak >nul
start "" "http://localhost:8090"

exit /b 0

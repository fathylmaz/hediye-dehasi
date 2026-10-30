@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ===============================================
echo  HEDIYE DEHASI - Docker ile baslat
 echo ===============================================
echo.
where docker >nul 2>&1
if errorlevel 1 (
  echo HATA: Docker bulunamadi. Docker Desktop kurulumunu kontrol edin.
  echo Ayrintilar: INSTALL_WINDOWS.md
  pause
  exit /b 1
)
docker compose up --build -d
if errorlevel 1 (
  echo.
  echo Docker baslatilamadi. Docker Desktop acik mi?
  echo Ayrintilar: docker compose logs --tail 100
  pause
  exit /b 1
)
docker compose ps
echo.
echo Site: http://localhost:8080
echo API:  http://localhost:8000/docs
echo.
start "" "http://localhost:8080"
pause

@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Проверка Node.js...
node -v 2>nul || (
  echo Ошибка: Node.js не найден. Установите с https://nodejs.org/ (LTS)
  pause
  exit /b 1
)
echo.

echo Установка зависимостей...
call npm install
if errorlevel 1 (
  echo Ошибка при npm install.
  pause
  exit /b 1
)

echo.
echo ========================================
echo  Когда появится "Ready", откройте в браузере:
echo  http://localhost:3000
echo ========================================
echo.
echo Запуск сервера (не закрывайте это окно)...
call npm run dev

pause

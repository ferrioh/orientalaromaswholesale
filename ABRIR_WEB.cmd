@echo off
cd /d "%~dp0"
echo Abriendo Oriental Aromas en http://127.0.0.1:5173
echo Mantiene esta ventana abierta mientras revisas la web.
call npm run dev -- --port 5173 --open

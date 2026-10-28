@echo off
title Detener Servidor IUTEPAL
chcp 65001 > nul
cls

echo ============================================================
echo           DETENIENDO SERVIDOR LOCAL IUTEPAL
echo ============================================================
echo.

echo Buscando procesos en el puerto 3000...
powershell -NoProfile -Command ^
    "$lines = netstat -ano | Select-String ':3000.*LISTENING';" ^
    "if ($lines) { " ^
    "    $lines | ForEach-Object { " ^
    "        $pidNum = ($_ -split '\s+')[-1]; " ^
    "        Stop-Process -Id $pidNum -Force -ErrorAction SilentlyContinue; " ^
    "        Write-Host ('[EXITO] Detenido proceso en puerto 3000 (PID: ' + $pidNum + ')') -ForegroundColor Green; " ^
    "    }; " ^
    "} else { " ^
    "    Write-Host '[INFO] No se encontro ningun servidor activo en el puerto 3000.' -ForegroundColor Yellow; " ^
    "}"

echo.
pause


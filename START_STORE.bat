@echo off
title ApexStore E-Commerce Launcher
color 0A
echo ===================================================
echo           ApexStore E-Commerce Platform
echo ===================================================
echo.
echo Starting local development server...
echo Opening http://localhost:5173 in browser...
echo.
start http://localhost:5173
npm run dev
pause

@echo off
title Creating Project Zip Archive
echo ===================================================
echo   Packaging Wedding Invitation Website into Zip
echo   (Excluding node_modules and .git)
echo ===================================================
echo.

node create-zip.js

echo.
pause

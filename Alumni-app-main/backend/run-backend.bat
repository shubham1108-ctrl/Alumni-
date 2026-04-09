@echo off
echo Starting Alumni app - Golden years network Setup...

:: Use PowerShell to run the logic, but bypass the execution policy
powershell -ExecutionPolicy Bypass -File "%~dp0run-backend.ps1"

if %ERRORLEVEL% neq 0 (
    echo.
    echo Script failed with error code %ERRORLEVEL%
    pause
)

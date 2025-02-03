@echo off
:: Set the execution policy to allow running scripts if it's not already allowed
PowerShell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force"

:: Run the PowerShell script
PowerShell -ExecutionPolicy Bypass -File "%~dp0__init\windows.ps1"

pause

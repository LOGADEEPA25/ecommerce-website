@echo off
REM E-Commerce Platform Automated Setup Script for Windows
REM This script automates database migrations, data import, and Elasticsearch indexing

echo ==========================================
echo   E-Commerce Platform Setup Script
echo ==========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker first.
    exit /b 1
)

REM Check if containers are running
docker ps | findstr "ecommerce_backend" >nul
if errorlevel 1 (
    echo [WARNING] Backend container not running. Starting Docker Compose...
    docker-compose up -d
    
    REM Wait for containers to be ready
    echo [INFO] Waiting for containers to start...
    timeout /t 10 /nobreak >nul
)

REM Function to wait for MySQL
echo [INFO] Waiting for MySQL to be ready...
:wait_mysql
docker exec ecommerce_db mysqladmin ping -h localhost --silent >nul 2>&1
if errorlevel 1 (
    echo|set /p="."
    timeout /t 2 /nobreak >nul
    goto wait_mysql
)
echo.
echo [INFO] MySQL is ready!

REM Function to wait for Elasticsearch
echo [INFO] Waiting for Elasticsearch to be ready...
:wait_es
curl -s http://localhost:9201/_cluster/health | findstr "status" >nul
if errorlevel 1 (
    echo|set /p="."
    timeout /t 2 /nobreak >nul
    goto wait_es
)
echo.
echo [INFO] Elasticsearch is ready!

echo.
echo [INFO] Running Django migrations...
docker exec -it ecommerce_backend python manage.py migrate

echo.
echo [INFO] Creating app migrations...
docker exec -it ecommerce_backend python manage.py makemigrations authentication

echo.
echo [INFO] Applying app migrations...
docker exec -it ecommerce_backend python manage.py migrate

echo.
echo [INFO] Importing sample data...
docker exec -it ecommerce_backend python import_data.py

echo.
echo [INFO] Indexing data in Elasticsearch...
docker exec -it ecommerce_backend python manage.py index_elasticsearch

echo.
echo [INFO] Setup completed successfully!
echo ==========================================
echo.
echo Your application is ready:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   Admin:    http://localhost:8000/admin
echo.
pause

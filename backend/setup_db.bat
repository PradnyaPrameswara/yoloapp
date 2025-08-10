@echo off
echo Setting up the database for YOLO Web Application...

REM MySQL connection parameters - adjust these as needed
set MYSQL_USER=root
set MYSQL_PASSWORD=
set MYSQL_HOST=localhost

REM Create SQL script
echo CREATE DATABASE IF NOT EXISTS yolo_web; > setup_db.sql
echo USE yolo_web; >> setup_db.sql
echo CREATE TABLE IF NOT EXISTS users ( >> setup_db.sql
echo     id INT AUTO_INCREMENT PRIMARY KEY, >> setup_db.sql
echo     username VARCHAR(255) NOT NULL UNIQUE, >> setup_db.sql
echo     email VARCHAR(255) NOT NULL UNIQUE, >> setup_db.sql
echo     password VARCHAR(255) NOT NULL, >> setup_db.sql
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP >> setup_db.sql
echo ); >> setup_db.sql

REM Check if mysql command is available
mysql --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo MySQL is not installed or not in PATH. Please install MySQL or add it to your PATH.
    goto :cleanup
)

REM Run the SQL script
echo Running SQL script to create database and tables...
mysql -u %MYSQL_USER% -h %MYSQL_HOST% -p%MYSQL_PASSWORD% < setup_db.sql
if %ERRORLEVEL% neq 0 (
    echo Failed to create database. Please check your MySQL connection parameters.
) else (
    echo Database setup completed successfully!
)

:cleanup
REM Clean up the temporary SQL script
del setup_db.sql

echo.
echo You can now run Python script setup_db.py to initialize the database with Python.
echo.

@echo off
REM Build script for LaTeX document (Windows)
REM Requires XeLaTeX to be installed and in PATH

echo Compiling LaTeX document with XeLaTeX...
echo.

xelatex main.tex
if %errorlevel% neq 0 (
    echo.
    echo Error during first compilation!
    pause
    exit /b %errorlevel%
)

echo.
echo Running second pass for cross-references...
xelatex main.tex
if %errorlevel% neq 0 (
    echo.
    echo Error during second compilation!
    pause
    exit /b %errorlevel%
)

echo.
echo Compilation successful!
echo Output: main.pdf
echo.
pause

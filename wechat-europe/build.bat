@echo off
REM Build script for WeChat Europe Analysis LaTeX document (Windows)
REM Requires XeLaTeX to be installed and in PATH

echo Compiling WeChat Europe Analysis LaTeX document with XeLaTeX...
echo.

xelatex wechat_europe_analysis.tex
if %errorlevel% neq 0 (
    echo.
    echo Error during first compilation!
    pause
    exit /b %errorlevel%
)

echo.
echo Running second pass for cross-references...
xelatex wechat_europe_analysis.tex
if %errorlevel% neq 0 (
    echo.
    echo Error during second compilation!
    pause
    exit /b %errorlevel%
)

echo.
echo Compilation successful!
echo Output: wechat_europe_analysis.pdf
echo.
pause

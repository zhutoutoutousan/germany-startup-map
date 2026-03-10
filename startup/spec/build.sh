#!/bin/bash
# Build script for LaTeX document (Linux/macOS)
# Requires XeLaTeX to be installed

echo "Compiling LaTeX document with XeLaTeX..."
echo

xelatex main.tex
if [ $? -ne 0 ]; then
    echo
    echo "Error during first compilation!"
    exit 1
fi

echo
echo "Running second pass for cross-references..."
xelatex main.tex
if [ $? -ne 0 ]; then
    echo
    echo "Error during second compilation!"
    exit 1
fi

echo
echo "Compilation successful!"
echo "Output: main.pdf"
echo

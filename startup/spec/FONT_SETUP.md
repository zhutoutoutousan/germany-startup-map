# Font Setup Instructions / 字体设置说明 / Schriftart-Einrichtungsanleitung

## Problem / 问题 / Problem

If you get font errors like "The font 'SimSun' cannot be found", you need to install Chinese fonts on your system or adjust the font names in `main.tex`.

如果您遇到像"找不到字体'SimSun'"这样的字体错误，您需要在系统上安装中文字体或在`main.tex`中调整字体名称。

Wenn Sie Schriftartfehler wie "Die Schriftart 'SimSun' kann nicht gefunden werden" erhalten, müssen Sie chinesische Schriftarten auf Ihrem System installieren oder die Schriftartnamen in `main.tex` anpassen.

## Solutions / 解决方案 / Lösungen

### Option 1: Install Chinese Fonts / 安装中文字体 / Chinesische Schriftarten installieren

#### Windows:
- SimSun and SimHei are usually pre-installed
- If not, install Microsoft YaHei from Windows settings
- SimSun和SimHei通常已预装
- 如果没有，从Windows设置安装Microsoft YaHei

#### macOS:
- STSong and STHeiti are usually pre-installed
- PingFang SC is also available
- STSong和STHeiti通常已预装
- PingFang SC也可用

#### Linux:
```bash
sudo apt-get install fonts-wqy-zenhei fonts-noto-cjk-sc
# or
sudo yum install wqy-zenhei-fonts
```

### Option 2: Change Font Names in main.tex / 在main.tex中更改字体名称 / Schriftartnamen in main.tex ändern

Edit `main.tex` and change the font names to fonts available on your system:

编辑`main.tex`并将字体名称更改为您系统上可用的字体：

Bearbeiten Sie `main.tex` und ändern Sie die Schriftartnamen in auf Ihrem System verfügbare Schriftarten:

```latex
% For macOS:
\newfontfamily\chinesefont{STSong}
\newfontfamily\chinesefontsf{STHeiti}

% For Linux:
\newfontfamily\chinesefont{WenQuanYi Micro Hei}
\newfontfamily\chinesefontsf{WenQuanYi Micro Hei}

% Cross-platform option:
\newfontfamily\chinesefont{Noto Sans CJK SC}
\newfontfamily\chinesefontsf{Noto Sans CJK SC}
```

### Option 3: Comment Out Font Lines (Chinese text may not display correctly) / 注释掉字体行（中文可能无法正确显示） / Schriftartzeilen auskommentieren (Chinesischer Text wird möglicherweise nicht korrekt angezeigt)

If you don't need Chinese text to display correctly, you can comment out the font lines:

如果您不需要中文文本正确显示，可以注释掉字体行：

Wenn Sie nicht benötigen, dass chinesischer Text korrekt angezeigt wird, können Sie die Schriftartzeilen auskommentieren:

```latex
% \newfontfamily\chinesefont{SimSun}
% \newfontfamily\chinesefontsf{SimHei}
```

## Checking Available Fonts / 检查可用字体 / Verfügbare Schriftarten prüfen

### Windows:
Open Font Settings and look for Chinese fonts

打开字体设置并查找中文字体

Öffnen Sie die Schriftarteinstellungen und suchen Sie nach chinesischen Schriftarten

### macOS:
```bash
fc-list :lang=zh
```

### Linux:
```bash
fc-list :lang=zh
```

## Recommended Fonts / 推荐字体 / Empfohlene Schriftarten

1. **Noto Sans CJK SC** - Best cross-platform support / 最佳跨平台支持 / Beste plattformübergreifende Unterstützung
2. **Source Han Sans SC** - Adobe's open source font / Adobe的开源字体 / Adobes Open-Source-Schriftart
3. **WenQuanYi Micro Hei** - Popular on Linux / Linux上流行 / Beliebt auf Linux

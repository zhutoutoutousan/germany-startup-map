# 如何在LaTeX文档中集成数据
# How to Integrate Data into LaTeX Document
# Wie man Daten in LaTeX-Dokumente integriert

## 方法1: 直接引用CSV数据

在LaTeX文档中，可以使用`pgfplotstable`包来读取和显示CSV数据：

```latex
\usepackage{pgfplotstable}
\usepackage{booktabs}

% 读取CSV文件
\pgfplotstableread[col sep=comma]{data/messaging_app_users.csv}\messagingdata

% 在文档中显示表格
\begin{table}[ht]
\centering
\caption{欧洲主要国家即时通讯应用用户对比}
\pgfplotstabletypeset[
    columns={Country,WhatsApp_Users_Millions,WeChat_Users_Thousands},
    columns/Country/.style={string type},
    columns/WhatsApp_Users_Millions/.style={column name=WhatsApp (M)},
    columns/WeChat_Users_Thousands/.style={column name=WeChat (K)},
    every head row/.style={before row=\toprule,after row=\midrule},
    every last row/.style={after row=\bottomrule},
]\messagingdata
\end{table}
```

## 方法2: 插入生成的图表

使用`graphicx`包插入PNG图表：

```latex
\usepackage{graphicx}

\begin{figure}[ht]
\centering
\includegraphics[width=0.9\textwidth]{figures/messaging_app_comparison.png}
\caption{欧洲主要国家即时通讯应用用户对比}
\label{fig:messaging-comparison}
\end{figure}

\begin{figure}[ht]
\centering
\includegraphics[width=0.9\textwidth]{figures/payment_methods_comparison.png}
\caption{欧洲与中国支付方式分布对比}
\label{fig:payment-comparison}
\end{figure}

\begin{figure}[ht]
\centering
\includegraphics[width=0.9\textwidth]{figures/gdpr_fines_top10.png}
\caption{GDPR罚款Top 10案例}
\label{fig:gdpr-fines}
\end{figure}
```

## 方法3: 使用Python脚本自动生成LaTeX表格

可以创建一个Python脚本，读取CSV数据并生成LaTeX表格代码：

```python
import pandas as pd

# 读取数据
df = pd.read_csv('data/messaging_app_users.csv')

# 生成LaTeX表格代码
latex_table = df.to_latex(
    index=False,
    caption='欧洲主要国家即时通讯应用用户对比',
    label='tab:messaging-users',
    float_format='%.1f',
    escape=False
)

print(latex_table)
```

## 方法4: 在文档中引用关键数据

在LaTeX文档中直接引用数据摘要报告中的关键数字：

```latex
根据收集的数据，WeChat在欧洲的用户数仅为WhatsApp的0.05\%，这清楚地说明了微信生态模式在欧洲面临的巨大挑战。

欧洲银行卡使用率是中国的3倍，而中国移动支付使用率是欧洲的5.4倍，这反映了两个市场在支付习惯上的根本性差异。

GDPR罚款数据显示，自2020年以来，欧盟对大型科技平台的罚款总额超过14.9亿欧元，其中最高单笔罚款达到7.46亿欧元（Amazon, 2021年）。
```

## 推荐的文档结构

在`wechat_europe_analysis.tex`中添加数据支持章节：

```latex
\section{数据支撑 / Data Support / Datenunterstützung}

\subsection{即时通讯应用市场数据 / Messaging App Market Data}

\begin{figure}[ht]
\centering
\includegraphics[width=0.9\textwidth]{figures/messaging_app_comparison.png}
\caption{欧洲主要国家即时通讯应用用户对比 / Messaging App Users Comparison}
\label{fig:messaging-comparison}
\end{figure}

根据收集的数据，WhatsApp在欧洲15个主要国家的总用户数达到2.73亿，而WeChat仅为15万，渗透率仅为0.05\%。

\subsection{支付方式对比数据 / Payment Methods Comparison Data}

\begin{figure}[ht]
\centering
\includegraphics[width=0.9\textwidth]{figures/payment_methods_comparison.png}
\caption{欧洲与中国支付方式分布对比 / Payment Methods Distribution Comparison}
\label{fig:payment-comparison}
\end{figure}

\subsection{GDPR监管数据 / GDPR Regulatory Data}

\begin{figure}[ht]
\centering
\includegraphics[width=0.9\textwidth]{figures/gdpr_fines_top10.png}
\caption{GDPR罚款Top 10案例 / Top 10 GDPR Fines}
\label{fig:gdpr-fines}
\end{figure}
```

## 注意事项 / Notes / Hinweise

1. **路径问题**: 确保LaTeX文档中的图片路径正确。如果使用Overleaf，需要上传`figures/`目录中的所有PNG文件。

2. **字体问题**: 图表中的中文可能在某些LaTeX环境中显示不正确。建议使用支持中文的字体设置。

3. **数据更新**: 当数据更新时，重新运行`data_collection.py`脚本，然后重新编译LaTeX文档。

4. **引用格式**: 使用`\ref{fig:xxx}`来引用图表，使用`\cite{}`来引用数据来源。

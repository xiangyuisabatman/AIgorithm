# 🧠 AIgorithm

**AIgorithm** 是一个智能算法练习系统，结合 AI 自动生成高质量算法题、执行用例验证、记录解题结果、生成解题分析报告，并根据表现智能调整题目难度。  
整个系统可在本地命令行中运行，支持 TypeScript / Bun 环境。

---

## 🚀 功能特性

- 🤖 **AI 题目生成**  
  自动生成包含题目描述、示例用例、TypeScript 函数模板的算法题。

- 🧩 **本地题库管理**  
  所有题目以 `.ts` 文件存放于 `/problems` 目录，可直接编辑提交。

- 🧪 **用例验证系统**  
  自动读取 `examples` 并运行题解函数验证正确性，统计通过情况。

- 📊 **自适应难度调整**  
  根据用户累计完成题数与正确率，动态控制生成题目的难度比例。

- 📁 **进度与报告追踪**  
  自动生成练习记录与结果报告（JSON / Markdown 可扩展）。

---

## 🧩 项目结构

```bash
algorithm-ai/
├── problems/                 # 已生成的算法题
│   ├── 1 Two Sum.ts
│   ├── 2 Longest Substring Without Repeating Characters.ts
│   └── ...
├── solutions/                # 题解分析报告
├── agent/                    # 智能算法生成系统(核心代码)  
│   └── cli.ts                  # CLI 入口
├── problems.json             # 题目元数据（忽略提交）
├── progress.json             # 做题进度（忽略提交）
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ 环境要求

- [Bun](https://bun.sh/) ≥ v1.1  
- Node.js ≥ v18（用于 AI 接口兼容）  
- TypeScript ≥ 5.0  

---

## 🧰 使用方法

### 1️⃣ 安装bun
[bun官网安装教程](https://bun.com/docs/installation)
### 2️⃣ 安装依赖
```bash
bun install
```
### 3️⃣ 初始化项目
```bash
bun run init
```
### 4️⃣ 运行代码
```bash
bun run start
```

## 📚 帮助文档
### 1. 创建新题目
[点击播放视频](./static//video/new%20problem.mov)
### 2. 校验算法
[点击播放视频](./static/video/valid%20problem.mov)
### 3. 提交算法并生成解题报告
[点击播放视频](./static/video/commit%20problem.mov)

## 💬 未来计划
- [ ] UI可视化版本
- [ ] 多语言支持（Python, Go, Rust等）
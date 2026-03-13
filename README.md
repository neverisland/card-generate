# 实时名片生成器

[English](./README.en.md)

## 项目简介

这是一个基于 Vite + React + TypeScript 的在线名片生成工具，用于快速编辑并导出横版或竖版商务名片。

你可以在左侧面板修改姓名、职位、手机号、邮箱、地址、社交账号和二维码内容，右侧会实时预览最终效果，并支持导出 `PNG` 或 `JPG`。

## 技术栈

- React 19
- TypeScript
- Vite
- Konva / React Konva
- qrcode

## 安装与启动

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

### 打包生产版本

```bash
npm run build
```

### 本地预览生产包

```bash
npm run preview
```

## 使用说明

1. 在左侧输入或修改名片内容。
2. 在顶部切换横版或竖版布局。
3. 在视觉样式区域切换主题或调整颜色。
4. 在实时预览中查看名片效果。
5. 使用右上角按钮导出 `PNG` 或 `JPG`。

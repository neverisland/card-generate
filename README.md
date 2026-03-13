# 实时名片生成器

[English](./README.en.md)

## 项目简介

这是一个基于 Vite + React + TypeScript 的前端名片生成工具，用于快速编辑并导出横版或竖版商务名片。

应用提供实时预览画布，支持修改基础信息、切换主题、调整元素图层与位置，并导出为 `PNG` 或 `JPG`。

## 主要功能

- 实时编辑姓名、职位、手机号、邮箱、地址、社交账号和二维码内容
- 支持横版与竖版两种名片方向切换
- 内置多套配色主题，并支持自定义背景色、强调色、圆角和边距
- 画布元素可选择、拖拽、缩放、旋转、锁定、隐藏、删除和调整图层顺序
- 自动生成二维码预览
- 支持导出 `PNG` 和 `JPG`
- 自动将当前编辑内容保存到浏览器本地存储

## 技术栈

- React 19
- TypeScript
- Vite
- Konva / React Konva
- qrcode

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

默认情况下，Vite 会输出本地访问地址，例如：`http://127.0.0.1:5173/`。

### 3. 打包生产版本

```bash
npm run build
```

打包结果会输出到 `dist/` 目录。

### 4. 本地预览生产包

```bash
npm run preview
```

## 使用说明

1. 在左侧面板填写或修改名片内容。
2. 在顶部切换横版或竖版布局。
3. 在“视觉样式”中切换主题或自定义颜色。
4. 在“图层管理”和“当前元素”中微调文本或二维码的位置、大小、显隐和层级。
5. 通过右上角按钮导出 `PNG` 或 `JPG`。

## 项目结构

```text
src/
  App.tsx                  # 顶层状态、导出流程、主布局
  App.css                  # 全局界面样式
  components/
    CardCanvas.tsx         # 实时预览画布与画布交互
    ControlPanel.tsx       # 左侧配置面板
    Toolbar.tsx            # 顶部工具栏
  lib/
    document.ts            # 文档持久化、方向切换、图层操作
  hooks/
    useLoadedImage.ts      # 图像加载辅助 Hook
  defaultDocument.ts       # 默认模板和初始元素布局
  themes.ts                # 主题定义与应用逻辑
  types.ts                 # 共享类型定义
```

## 数据与状态

- 当前文档会使用浏览器 `localStorage` 持久化
- 存储键为 `business-card-designer:v1`
- 切换方向时会按模板重排元素，并尽量保留已有样式设置

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # TypeScript 构建 + Vite 生产打包
npm run preview  # 本地预览 dist 产物
```

## 当前限制

- 目前没有配置自动化测试
- 首次进入页面时，画布与二维码相关代码会按需加载，以换取更小的首屏包体积
- 暂不支持独立上传图片或在二维码中嵌入 Logo

## 手动验证建议

在提交改动前，建议至少检查以下流程：

- 编辑文本内容是否立即反映到右侧预览
- 切换横版/竖版后布局是否符合预期
- 主题切换和自定义颜色是否正常生效
- 二维码内容更新后是否正确重绘
- 导出 `PNG/JPG` 是否成功

<h1 align="center">项目仪表板 · Next.js + shadcn/ui</h1>

<p align="center">
  一个现代化的项目与任务管理仪表板，作为面向创始人、产品设计师和全栈开发者的真实世界 UI 模板。
</p>

<p align="center">
  <a href="https://v0-project-workspace.vercel.app"><strong>在线演示</strong></a>
  ·
  <a href="#getting-started"><strong>本地运行</strong></a>
  ·
  <a href="#architecture"><strong>探索架构</strong></a>
</p>

---

## 概述

这个仓库是一个小而专注的**项目管理仪表板 UI**，使用以下技术构建：

- **Next.js App Router**（应用路由器）
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui + 自定义侧边栏原语**

它被设计为一个**活体作品集**：

- 您可以浏览实际的代码，而不仅仅是设计模型。
- 您可以像对待真实产品一样克隆、运行和扩展这个仪表板。
- 它演示了如何以清晰、可扩展的方式结合设计和工程决策。

如果您是创始人、独立黑客或正在评估合作的工程师，这个仓库旨在展示我如何思考**系统、结构和 UI 细节**。

## 在线演示

该仪表板部署在 Vercel 上：

- **生产环境**: https://v0-project-workspace.vercel.app

> 注意：这是一个 UI 优先的演示。它使用模拟数据，不包含身份验证或后端 API。

## 功能特性

- **项目概览布局**
  - 带有活动状态和徽章的侧边栏导航。
  - 带有进度可视化显示的活动项目列表。

- **响应式侧边栏系统**
  - 基于带有上下文的自定义 `SidebarProvider` 构建。
  - 用于切换侧边栏的键盘快捷键。
  - 通过 cookies 持久化的移动端行为和状态。

- **面向设计系统的组件**
  - 来自 shadcn/ui 的基础原语。
  - 使用 `lib/data` 中数据组合的 `AppSidebar` 组件。
  - `lib/utils` 中用于一致样式化的实用工具助手。

- **模拟真实工作负载的模拟数据**
  - 带有状态、优先级、标签和时间范围的项目。
  - 侧边栏导航和"活动项目"摘要。

## 架构

高层级结构：

- `app/`
  - `layout.tsx` – 根布局、元数据、字体和全局样式。
  - `page.tsx` – 主仪表板页面，连接 `SidebarProvider`、`AppSidebar` 和页面内容。

- `components/`
  - `app-sidebar.tsx` – 应用程序侧边栏，由共享的侧边栏原语和数据组合而成。
  - `projects-content.tsx` – 主仪表板内容（项目列表、过滤器和时间线）。
  - `progress-circle.tsx` – 项目进度的小型可重用可视化组件。
  - `ui/` – 类似设计系统的原语（按钮、侧边栏原语、输入框、工具提示等）。

- `lib/`
  - `utils.ts` – 实用工具助手（例如，类名助手）。
  - `data/projects.ts` – 项目的种子数据以及计算过滤器计数的助手。
  - `data/sidebar.ts` – 侧边栏导航、活动项目摘要和页脚项的种子数据。

这种分离保持了：

- **UI 原语**（在 `components/ui` 中）在整个应用程序中可重用。
- **功能组件**（如 `AppSidebar`）专注于组合而不是原始配置。
- **数据**（在 `lib/data` 中）与 UI 解耦，以便您稍后可以轻松地将模拟数据替换为真实 API。

## 技术栈

- **框架**: Next.js（App Router）
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 库**: shadcn/ui、Radix UI 原语
- **图标**: Lucide、Phosphor Icons
- **分析**: Vercel Analytics

## 入门指南

### 前置要求

- Node.js 18+
- pnpm（推荐）或 npm/yarn

### 安装依赖

```bash
# 使用 pnpm 安装项目依赖包
pnpm install
```

### 运行开发服务器

```bash
# 启动开发服务器，默认运行在 http://localhost:3000
pnpm dev
```

应用程序将在 `http://localhost:3000` 可用。

### 构建生产版本

```bash
# 构建生产环境版本
pnpm build
# 启动生产服务器
pnpm start
```

## 重用与定制

这个项目故意设计得很小，以便您可以：

- **将其作为起点**，用于您自己的 SaaS 仪表板或内部工具。
- **将 `lib/data` 中的模拟数据**替换为来自您 API 的真实数据。
- **扩展设计系统**，在 `components/ui` 下添加更多组件。
- **完善信息架构**（`app/` 下的路由）以匹配您自己的产品。

如果您最终将其作为起点使用，链接回来或在仓库上点赞总是受到赞赏的。

## 关于

这个项目是作为**开源的活体作品集**构建的，以演示我如何处理：

- 构建小型前端应用程序。
- 平衡视觉设计和实现细节。
- 构建仍然易于适应的可重用 UI 原语。

如果您是创始人、产品经理或工程师，想要讨论合作，请随时联系。

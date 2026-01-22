import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// 从 Google Fonts 加载 Geist 字体（用于正文），使用拉丁字符子集
// Geist 是一个现代、干净的无衬线字体，适合 UI 设计
const _geist = Geist({ subsets: ["latin"] })

// 从 Google Fonts 加载 Geist Mono 字体（用于代码和等宽文本），使用拉丁字符子集
// Geist Mono 是一个等宽字体，适合显示代码、数字和技术信息
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// 导出元数据配置对象，用于设置页面的 SEO 和浏览器显示信息
// Metadata 类型由 Next.js 提供，确保类型安全
export const metadata: Metadata = {
  // 页面标题，显示在浏览器标签页上
  title: "项目管理工具 - PM Tools",
  // 页面描述，用于 SEO 优化，显示在搜索引擎结果中
  description: "现代化的项目和任务管理工具，支持时间轴视图",
  // 生成器信息，标识该应用由 v0.app 生成
  generator: "v0.app",
  // 图标配置，设置网站图标和 Apple 设备上的触摸图标
  icons: {
    // 浏览器标签页图标（favicon）
    icon: "/icon.png",
    // Apple 设备上的触摸图标，用于添加到主屏幕时显示
    apple: "/apple-touch-icon.png",
  },
}

// 导出视口配置对象，用于设置移动端和浏览器的视口行为
// Viewport 类型由 Next.js 提供，确保类型安全
export const viewport: Viewport = {
  // 主题颜色，用于移动端浏览器地址栏和 PWA 的主题色
  // #3b82f6 是 Tailwind CSS 中的 blue-500 颜色
  themeColor: "#3b82f6",
}

// 根布局组件，这是 Next.js App Router 中最顶层的布局组件
// 它包裹整个应用程序，定义全局 HTML 结构和样式
export default function RootLayout({
  children, // 子组件，即页面内容，由 Next.js 自动注入
}: Readonly<{
  children: React.ReactNode // TypeScript 类型定义，children 可以是任何 React 节点
}>) {
  return (
    <html lang="zh">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

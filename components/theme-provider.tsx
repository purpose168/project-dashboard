'use client'

// 导入 React 的所有内容
import * as React from 'react'
// 导入 next-themes 库的主题提供者组件和类型
import {
  ThemeProvider as NextThemesProvider, // 主题提供者组件
  type ThemeProviderProps, // 主题提供者属性类型
} from 'next-themes'

// ThemeProvider 组件：主题提供者组件
// 用于为整个应用提供主题切换功能，支持亮色和暗色主题
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // 返回 next-themes 的 ThemeProvider 组件
  // children：子组件（通常是整个应用）
  // ...props：其他属性（如 defaultTheme、attribute、enableSystem 等）
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

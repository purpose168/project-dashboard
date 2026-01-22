import * as React from 'react'

import { cn } from '@/lib/utils'

// Input 组件：可重用的输入框组件
// 用于接收用户输入的文本、数字、密码等数据
// 支持所有 HTML input 元素的属性和类型
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type} // 输入框类型（text、password、email、number 等）
      data-slot="input"
      className={cn(
        // 基础样式类名，定义输入框的外观和行为
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // 焦点可见时的样式
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        // 无效状态时的样式（用于表单验证）
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className, // 合并额外的 className
      )}
      {...props} // 传递所有其他 props 到 input 元素
    />
  )
}

// 导出 Input 组件，供其他模块使用
export { Input }

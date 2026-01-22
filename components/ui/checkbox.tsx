'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

// Checkbox 组件：可重用的复选框组件
// 使用 Radix UI 的 Checkbox 原语作为基础，确保可访问性和一致性
function Checkbox({
  className, // 额外的 CSS 类名
  ...props // 其他 HTML checkbox 属性
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // 基础样式类名，定义复选框的外观和行为
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className, // 合并额外的 className
      )}
      {...props}
    >
      {/* 
        CheckboxPrimitive.Indicator 组件：复选框的指示器
        当复选框被选中时，显示此组件的内容（勾选图标）
      */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        {/* 
          CheckIcon 组件：勾选图标
          来自 lucide-react 图标库
          size-3.5: 设置图标大小为 0.875rem（14px）
        */}
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

// 导出 Checkbox 组件，供其他模块使用
export { Checkbox }

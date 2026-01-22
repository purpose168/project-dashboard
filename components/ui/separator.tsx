'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@/lib/utils'

// Separator 组件：分隔线组件
// 用于在视觉上分隔内容区域，提高界面的可读性和层次感
// 支持水平和垂直两种方向
function Separator({
  className, // 额外的 CSS 类名
  orientation = 'horizontal', // 分隔线方向，默认为 'horizontal'（可以是 'horizontal' 或 'vertical'）
  decorative = true, // 是否为装饰性元素，默认为 true（true 表示不使用语义化标签，false 表示使用语义化标签）
  ...props // 其他 HTML div 属性
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative} // 设置是否为装饰性元素
      orientation={orientation} // 设置分隔线方向
      className={cn(
        // 基础样式类名，定义分隔线的外观和行为
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className, // 合并额外的 className
      )}
      {...props}
    />
  )
}

// 导出 Separator 组件，供其他模块使用
export { Separator }

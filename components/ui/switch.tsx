'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

// Switch 组件：开关切换组件
// 基于 Radix UI 的 Switch 原语构建，提供可访问性良好的开关控件
// 用于在两种状态之间切换（开/关、是/否、启用/禁用等）
// 支持键盘导航和屏幕阅读器，确保无障碍访问
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // 基础样式类名，定义开关的外观和行为
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {/* SwitchPrimitive.Thumb：开关的滑块组件 */}
      {/* 在开关内部移动的小圆点，表示当前状态 */}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
        }
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

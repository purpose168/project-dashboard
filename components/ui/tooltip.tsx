'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

// TooltipProvider 组件：工具提示提供者组件
// 为所有 Tooltip 组件提供上下文和配置
// 控制工具提示的延迟显示时间等全局设置
function TooltipProvider({
  delayDuration = 0, // 延迟显示时间（毫秒），默认为 0（立即显示）
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

// Tooltip 组件：工具提示根组件
// 工具提示的主容器，包含 TooltipProvider 和 TooltipPrimitive.Root
// 用于显示鼠标悬停时的提示信息
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

// TooltipTrigger 组件：工具提示触发器组件
// 触发工具提示显示的元素（如按钮、图标、文本等）
// 鼠标悬停或聚焦在该元素上时显示工具提示
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

// TooltipContent 组件：工具提示内容组件
// 工具提示的实际内容区域，显示提示文本或其他内容
// 支持从四个方向显示（上、下、左、右），并带有动画效果
function TooltipContent({
  className,
  sideOffset = 0, // 侧边偏移量（像素），默认为 0
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          // 基础样式类名，定义工具提示内容的外观和行为
          'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className,
        )}
        {...props}
      >
        {children}
        {/* TooltipPrimitive.Arrow：工具提示箭头组件 */}
        {/* 指向触发器的小箭头，帮助用户理解工具提示与触发器的关系 */}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

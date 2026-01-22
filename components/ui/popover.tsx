'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'

// Popover 组件：弹出框的根组件
// 它是整个弹出框系统的入口，管理弹出框的打开/关闭状态
// 使用 Radix UI 的 Popover.Root 作为基础原语，确保可访问性和一致性
function Popover({
  ...props // 其他 HTML popover 属性
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

// PopoverTrigger 组件：弹出框的触发器
// 当用户点击或悬停此组件时，会打开弹出框
// 通常是一个按钮或图标
function PopoverTrigger({
  ...props // 其他 HTML button 属性
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

// PopoverContent 组件：弹出框的主要内容容器
// 包含弹出框的所有内容，并管理弹出框的打开/关闭动画
// 支持对齐方式和偏移量的配置
function PopoverContent({
  className, // 额外的 CSS 类名
  align = 'center', // 对齐方式，默认为 'center'（可以是 'start'、'center'、'end'）
  sideOffset = 4, // 侧边偏移量，默认为 4（单位：px）
  ...props // 其他 HTML div 属性
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align} // 设置对齐方式
        sideOffset={sideOffset} // 设置侧边偏移量
        className={cn(
          // 基础样式类名，定义弹出框内容的外观和动画
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden',
          className, // 合并额外的 className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

// PopoverAnchor 组件：弹出框的锚点
// 用于指定弹出框相对于哪个元素定位
// 当弹出框需要相对于非触发器元素定位时使用
function PopoverAnchor({
  ...props // 其他 HTML div 属性
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

// 导出所有 Popover 相关组件，供其他模块使用
export {
  Popover, // 弹出框根组件
  PopoverTrigger, // 弹出框触发器
  PopoverContent, // 弹出框内容容器
  PopoverAnchor, // 弹出框锚点
}

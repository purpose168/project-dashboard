'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

// Sheet 组件：侧边抽屉式面板组件
// 基于 Radix UI 的 Dialog 原语构建，提供从屏幕边缘滑出的面板
// 适用于移动端导航、设置面板、表单等场景
// 支持从上、下、左、右四个方向滑出
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

// SheetTrigger 组件：触发器组件
// 用于触发 Sheet 打开的按钮或元素
// 可以是按钮、链接或其他可交互元素
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

// SheetClose 组件：关闭按钮组件
// 用于关闭 Sheet 的按钮或元素
// 可以是关闭按钮图标、取消按钮等
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

// SheetPortal 组件：传送门组件
// 将 Sheet 内容渲染到 document.body 中
// 确保 Sheet 始终位于其他元素之上，不受父元素的 z-index 和 overflow 影响
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

// SheetOverlay 组件：遮罩层组件
// 在 Sheet 打开时显示半透明背景遮罩
// 点击遮罩层可以关闭 Sheet
// 提供视觉焦点，帮助用户专注于 Sheet 内容
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // 基础样式类名，定义遮罩层的外观和行为
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  )
}

// SheetContent 组件：内容容器组件
// Sheet 的主要内容区域，包含实际的 UI 元素
// 支持从四个方向滑出：top（上）、right（右）、bottom（下）、left（左）
// 默认从右侧滑出
function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // 基础样式类名，定义内容容器的外观和行为
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
          // 从右侧滑出的样式（默认）
          side === 'right' &&
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
          // 从左侧滑出的样式
          side === 'left' &&
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
          // 从顶部滑出的样式
          side === 'top' &&
            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
          // 从底部滑出的样式
          side === 'bottom' &&
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
          className,
        )}
        {...props}
      >
        {children}
        {/* 关闭按钮：位于右上角的 X 图标按钮 */}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">关闭</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

// SheetHeader 组件：头部区域组件
// Sheet 的顶部区域，通常包含标题和描述
// 用于组织 Sheet 的顶部内容，提供清晰的视觉层次
function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  )
}

// SheetFooter 组件：底部区域组件
// Sheet 的底部区域，通常包含操作按钮（如确认、取消）
// 自动对齐到底部，提供一致的操作区域
function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

// SheetTitle 组件：标题组件
// Sheet 的主标题，使用语义化的 h2 标签
// 应该简洁明了地描述 Sheet 的用途
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

// SheetDescription 组件：描述组件
// Sheet 的辅助描述文本，提供额外的上下文信息
// 使用语义化的 p 标签，帮助用户理解 Sheet 的内容
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

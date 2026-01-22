"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Dialog 组件：对话框的根组件
// 它是整个对话框系统的入口，管理对话框的打开/关闭状态
// 使用 Radix UI 的 Dialog.Root 作为基础原语，确保可访问性和一致性
function Dialog({
  ...props // 其他 HTML dialog 属性
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

// DialogTrigger 组件：对话框的触发器
// 当用户点击此组件时，会打开对话框
// 通常是一个按钮或链接
function DialogTrigger({
  ...props // 其他 HTML button 属性
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

// DialogPortal 组件：对话框的传送门
// 将对话框内容渲染到指定的 DOM 节点（通常是 document.body）
// 这样可以避免对话框被父元素的样式（如 overflow: hidden）影响
function DialogPortal({
  ...props // 其他 Portal 属性
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

// DialogClose 组件：对话框的关闭按钮
// 当用户点击此组件时，会关闭对话框
// 可以在对话框内部放置多个关闭按钮
function DialogClose({
  ...props // 其他 HTML button 属性
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

// DialogOverlay 组件：对话框的遮罩层
// 在对话框后面显示一个半透明的黑色遮罩
// 用于聚焦用户注意力，并提供点击遮罩关闭对话框的功能
function DialogOverlay({
  className, // 额外的 CSS 类名
  ...props // 其他 HTML div 属性
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        // 基础样式类名，定义遮罩层的外观和动画
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className // 合并额外的 className
      )}
      {...props}
    />
  )
}

// DialogContent 组件：对话框的主要内容容器
// 包含对话框的所有内容，并管理对话框的打开/关闭动画
// 默认显示关闭按钮，可以通过 showCloseButton 属性控制
function DialogContent({
  className, // 额外的 CSS 类名
  children, // 子组件，即对话框的内容
  showCloseButton = true, // 是否显示关闭按钮，默认为 true
  ...props // 其他 HTML div 属性
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean // 是否显示关闭按钮的可选属性
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      {/* 渲染遮罩层 */}
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // 基础样式类名，定义对话框内容的外观和动画
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          className // 合并额外的 className
        )}
        {...props}
      >
        {/* 渲染子组件（对话框内容） */}
        {children}
        {/* 如果 showCloseButton 为 true，则显示关闭按钮 */}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            {/* 关闭图标（X） */}
            <XIcon />
            {/* 屏幕阅读器文本，用于可访问性 */}
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

// DialogHeader 组件：对话框的头部区域
// 通常包含对话框的标题和描述
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

// DialogFooter 组件：对话框的底部区域
// 通常包含操作按钮（如"确定"、"取消"等）
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

// DialogTitle 组件：对话框的标题
// 使用语义化的 HTML 标题标签，提高可访问性
function DialogTitle({
  className, // 额外的 CSS 类名
  ...props // 其他 HTML h2 属性
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

// DialogDescription 组件：对话框的描述文本
// 提供对话框的详细说明，帮助用户理解对话框的用途
function DialogDescription({
  className, // 额外的 CSS 类名
  ...props // 其他 HTML p 属性
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

// 导出所有 Dialog 相关组件，供其他模块使用
export {
  Dialog, // 对话框根组件
  DialogClose, // 对话框关闭按钮
  DialogContent, // 对话框内容容器
  DialogDescription, // 对话框描述
  DialogFooter, // 对话框底部区域
  DialogHeader, // 对话框头部区域
  DialogOverlay, // 对话框遮罩层
  DialogPortal, // 对话框传送门
  DialogTitle, // 对话框标题
  DialogTrigger, // 对话框触发器
}

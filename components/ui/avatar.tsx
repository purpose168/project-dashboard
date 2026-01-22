"use client"

import type * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

// Avatar 组件是头像的根容器组件
// 它提供了头像的基本容器样式和布局
// 使用 Radix UI 的 Avatar.Root 作为基础原语，确保可访问性和一致性
function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  )
}

// AvatarImage 组件用于显示头像的图片
// 它是头像的主要视觉元素，显示用户的头像图片
function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

// AvatarFallback 组件用于显示头像的后备内容
// 当图片加载失败或不可用时，显示此组件的内容
// 通常显示用户的姓名首字母或默认图标
function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"

      className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
      {...props}
    />
  )
}

// 导出三个组件，供其他模块使用
// Avatar: 头像容器组件
// AvatarImage: 头像图片组件
// AvatarFallback: 头像后备组件
export { Avatar, AvatarImage, AvatarFallback }

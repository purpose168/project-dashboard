import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// 使用 class-variance-authority (CVA) 库定义按钮的样式变体
// CVA 是一个强大的工具，用于管理组件的样式变体，避免重复的 className 字符串
// 它允许我们定义不同的变体（variant 和 size），并自动组合它们
const buttonVariants = cva(
  // 基础样式类名，所有按钮变体都会应用这些样式
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      // variant 变体：定义按钮的不同视觉风格
      variant: {
        // default: 默认按钮样式，使用主色调
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        // destructive: 危险操作按钮样式，使用红色系
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        // outline: 轮廓按钮样式，带边框和背景
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        // secondary: 次要按钮样式，使用次要色调
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        // ghost: 幽灵按钮样式，仅悬停时显示背景
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        // link: 链接按钮样式，类似文本链接
        link: 'text-primary underline-offset-4 hover:underline',
      },
      // size 变体：定义按钮的不同尺寸
      size: {
        // default: 默认尺寸按钮
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        // sm: 小尺寸按钮
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        // lg: 大尺寸按钮
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        // icon: 图标按钮，正方形
        icon: 'size-9',
        // icon-sm: 小图标按钮
        'icon-sm': 'size-8',
        // icon-lg: 大图标按钮
        'icon-lg': 'size-10',
      },
    },
    // 默认变体值，当未指定 variant 或 size 时使用这些值
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

// Button 组件：可重用的按钮组件，支持多种样式变体和尺寸
function Button({
  className, // 额外的 CSS 类名
  variant, // 按钮样式变体（default、destructive、outline、secondary、ghost、link）
  size, // 按钮尺寸（default、sm、lg、icon、icon-sm、icon-lg）
  asChild = false, // 是否将按钮渲染为子元素（使用 Radix UI 的 Slot 组件）
  ...props // 其他 HTML button 属性
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  // 根据 asChild 属性决定渲染为 Slot 还是 button 元素
  // Slot 组件允许我们将按钮的样式和行为应用到子元素上
  // 这对于将按钮样式应用到链接或其他元素时非常有用
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// 导出 Button 组件和 buttonVariants 配置
// buttonVariants 可以在其他地方使用，用于生成一致的按钮样式
export { Button, buttonVariants }

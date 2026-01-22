import { cn } from '@/lib/utils'

// Skeleton 组件：骨架屏组件
// 用于在内容加载时显示占位符，提升用户体验
// 通过动画效果（animate-pulse）模拟内容正在加载的状态
// 常用于列表、卡片、表单等需要异步加载数据的场景
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-accent animate-pulse rounded-md', // 基础样式类名，定义骨架屏的外观和行为
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }

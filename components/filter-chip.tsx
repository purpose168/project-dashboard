"use client"

// 导入 X 图标（来自 Phosphor Icons 库）
import { X } from "@phosphor-icons/react/dist/ssr"

// FilterChipProps 接口定义：过滤芯片组件的属性
interface FilterChipProps {
  label: string // 芯片标签文本
  onRemove: () => void // 移除芯片的回调函数
}

// FilterChip 组件：过滤芯片组件
// 用于显示可移除的标签或过滤条件
// 常用于显示过滤条件、标签、分类等场景，用户可以点击 X 按钮移除
export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className="flex h-8 items-center gap-1.5 rounded-md border border-border/60 bg-muted px-3 text-sm">
      {/* 芯片标签文本 */}
      <span>{label}</span>
      {/* 移除按钮：点击时调用 onRemove 回调函数 */}
      <button onClick={onRemove} className="ml-0.5 rounded-md p-0.5 hover:bg-accent">
        <X className="h-3.5 w-3.5" weight="bold" />
      </button>
    </div>
  )
}

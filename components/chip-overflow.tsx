"use client"

// 导入弹出框相关组件
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// 导入过滤芯片组件
import { FilterChip } from "@/components/filter-chip"
// 导入工具函数
import { cn } from "@/lib/utils"

// Chip 类型定义：芯片（标签）的数据结构
export type Chip = { key: string; value: string }

// ChipOverflowProps 接口定义：芯片溢出组件的属性
interface ChipOverflowProps {
  chips: Chip[] // 芯片列表
  onRemove: (key: string, value: string) => void // 移除芯片的回调函数
  maxVisible?: number // 最大可见芯片数量，默认为 4
  className?: string // 自定义类名
}

// ChipOverflow 组件：芯片溢出组件
// 用于显示芯片（标签）列表，当数量超过 maxVisible 时，将多余的芯片显示在弹出框中
// 常用于显示过滤条件、标签、分类等场景
export function ChipOverflow({ chips, onRemove, maxVisible = 4, className }: ChipOverflowProps) {
  // visible：可见的芯片列表（前 maxVisible 个）
  const visible = chips.slice(0, Math.max(0, maxVisible))
  // hidden：隐藏的芯片列表（超过 maxVisible 的部分）
  const hidden = chips.slice(Math.max(0, maxVisible))

  // 如果没有芯片，返回 null（不渲染任何内容）
  if (chips.length === 0) return null

  return (
    <div className={cn("flex items-center gap-2 overflow-hidden", className)}>
      {/* 渲染可见的芯片 */}
      {visible.map((chip) => (
        <FilterChip
          key={`${chip.key}-${chip.value}`}
          label={`${chip.key}: ${chip.value}`}
          onRemove={() => onRemove(chip.key, chip.value)}
        />
      ))}

      {/* 如果有隐藏的芯片，显示 "+N more" 按钮和弹出框 */}
      {hidden.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            {/* 显示隐藏芯片数量的按钮 */}
            <button className="flex h-8 items-center rounded-full border border-border/60 bg-background px-3 text-sm text-muted-foreground hover:bg-accent">
              +{hidden.length} more
            </button>
          </PopoverTrigger>
          {/* 弹出框内容：显示所有隐藏的芯片 */}
          <PopoverContent align="start" className="w-64 p-2 rounded-xl">
            <div className="flex max-h-64 flex-col gap-2 overflow-auto pr-1">
              {hidden.map((chip) => (
                <div key={`${chip.key}-${chip.value}`} className="shrink-0">
                  <FilterChip
                    label={`${chip.key}: ${chip.value}`}
                    onRemove={() => onRemove(chip.key, chip.value)}
                  />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

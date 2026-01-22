"use client"

// 导入警告八边形图标（来自 Phosphor Icons 库）
import { WarningOctagon } from "@phosphor-icons/react/dist/ssr"
// 导入工具函数
import { cn } from "@/lib/utils"

// PriorityLevel 类型定义：优先级级别类型
export type PriorityLevel = "urgent" | "high" | "medium" | "low"

// BarsGlyph 组件：条形图字形组件
// 用于显示优先级的条形图（非 urgent 级别）
// 匹配 Figma 设计：使用描边的条形，具有不同的高度和颜色
function BarsGlyph({ level, className }: { level: Exclude<PriorityLevel, "urgent">; className?: string }) {
  // bars：条形图的数据数组（包含位置、颜色等信息）
  // 匹配 Figma 设计：描边的条形，具有不同的高度和颜色
  const bars = [
    { x: 4, y1: 13.333, y2: level === "low" ? 13.333 : level === "medium" ? 13.333 : 13.333, color: "currentColor" },
    { x: 8, y1: 6.667, y2: 13.333, color: level === "low" ? "rgb(228, 228, 231)" : "currentColor" },
    { x: 12, y1: level === "high" ? 2.667 : level === "medium" ? 6.667 : 6.667, y2: 13.333, color: level === "high" ? "currentColor" : "rgb(228, 228, 231)" },
  ]

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      {/* 渲染条形图的每一条线 */}
      {bars.map((bar, i) => (
        <path
          key={i}
          d={`M${bar.x} ${bar.y2}V${bar.y1}`}
          stroke={bar.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}

// PriorityGlyphIcon 组件：优先级图标组件
// 根据优先级级别显示不同的图标（urgent 显示警告八边形，其他显示条形图）
export function PriorityGlyphIcon({
  level,
  size = "md",
  className,
}: {
  level: PriorityLevel
  size?: "sm" | "md"
  className?: string
}) {
  // isUrgent：是否为紧急优先级
  const isUrgent = level === "urgent"
  // baseIcon：基础图标大小类名
  const baseIcon = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"

  // 如果是紧急优先级，显示警告八边形图标
  if (isUrgent) {
    return <WarningOctagon className={cn(baseIcon, "text-muted-foreground", className)} weight="fill" />
  }

  // safeLevel：安全的优先级级别（排除 urgent）
  const safeLevel: Exclude<PriorityLevel, "urgent"> = level === "high" || level === "medium" ? level : "low"
  // 否则显示条形图图标
  return <BarsGlyph level={safeLevel} className={cn(baseIcon, "text-muted-foreground", className)} />
}

// PriorityBadgeProps 接口定义：优先级徽章组件的属性
export type PriorityBadgeProps = {
  level: PriorityLevel // 优先级级别
  appearance?: "badge" | "inline" // 外观样式：badge（徽章）或 inline（内联）
  size?: "sm" | "md" // 尺寸：sm（小）或 md（中）
  className?: string // 自定义类名
  withIcon?: boolean // 是否显示图标
}

// PriorityBadge 组件：优先级徽章组件
// 用于显示任务的优先级，支持徽章和内联两种外观样式
export function PriorityBadge({ level, appearance = "badge", size = "md", className, withIcon = true }: PriorityBadgeProps) {
  // isUrgent：是否为紧急优先级
  const isUrgent = level === "urgent"
  // label：优先级标签文本（首字母大写）
  const label = level === "urgent" ? "Urgent" : level.charAt(0).toUpperCase() + level.slice(1)

  // baseText：基础文本大小类名
  const baseText = size === "md" ? "text-sm" : "text-xs"
  // baseIcon：基础图标大小类名
  const baseIcon = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"

  // 如果外观样式为 inline（内联）
  if (appearance === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-foreground", baseText, className)}>
        {/* 如果需要显示图标 */}
        {withIcon && (isUrgent ? (
          <WarningOctagon className={cn(baseIcon, "text-muted-foreground")} weight="fill" />
        ) : (
          <BarsGlyph level={level} className={cn(baseIcon, "text-muted-foreground")} />
        ))}
        {/* 优先级标签文本 */}
        <span className={cn(isUrgent ? "text-foreground/80" : "text-foreground/80")}>{label}</span>
      </span>
    )
  }

  // appearance: badge（徽章样式）
  // colorClass：徽章颜色类名（根据是否为紧急优先级选择不同的颜色）
  const colorClass = isUrgent
    ? "text-foreground/80 border-zinc-200 bg-zinc-50"
    : "text-foreground/80 border-zinc-200 bg-zinc-50"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5",
        baseText,
        colorClass,
        className,
      )}
    >
      {/* 如果需要显示图标 */}
      {withIcon && (isUrgent ? (
        <WarningOctagon className={cn(baseIcon, "text-muted-foreground")} weight="fill" />
      ) : (
        <BarsGlyph level={level} className={cn(baseIcon, "text-muted-foreground")} />
      ))}
      {/* 优先级标签文本 */}
      <span>{label}</span>
    </span>
  )
}

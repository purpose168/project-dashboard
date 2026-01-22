"use client"

import { cn } from "@/lib/utils"
import { differenceInCalendarDays } from "date-fns"

// TimelineBarProps 接口：时间轴条形图组件的属性类型定义
interface TimelineBarProps {
  startDate: Date // 开始日期
  endDate: Date // 结束日期
  dates: Date[] // 时间轴显示的日期数组
  cellWidth: number // 每个单元格的宽度（像素）
  label: string // 条形图的标签文本
  progress?: number // 进度百分比（仅项目类型使用）
  variant: "project" | "task" // 变体类型：项目或任务
  status?: "done" | "todo" | "in-progress" // 状态：已完成、待办、进行中（仅任务类型使用）
}

// TimelineBar 组件：时间轴条形图组件
// 用于在时间轴上显示项目或任务的时间条，支持不同的状态和进度显示
export function TimelineBar({ startDate, endDate, dates, cellWidth, label, progress, variant, status }: TimelineBarProps) {
  // firstDate：时间轴的第一个日期
  const firstDate = dates[0]
  // lastDate：时间轴的最后一个日期
  const lastDate = dates[dates.length - 1]
  // totalDays：时间轴显示的总天数
  const totalDays = differenceInCalendarDays(lastDate, firstDate) + 1

  // startOffset：条形图开始日期相对于时间轴第一个日期的偏移天数
  const startOffset = differenceInCalendarDays(startDate, firstDate)
  // duration：条形图的持续时间（天数）
  const duration = differenceInCalendarDays(endDate, startDate) + 1

  // visibleStart：可见部分的开始位置（确保不小于 0）
  const visibleStart = Math.max(0, startOffset)
  // visibleEnd：可见部分的结束位置（确保不超过时间轴总天数）
  const visibleEnd = Math.min(totalDays, startOffset + duration)
  // visibleDays：可见部分的天数
  const visibleDays = visibleEnd - visibleStart

  // 如果可见天数小于等于 0，则不渲染组件
  if (visibleDays <= 0) return null

  // leftPx：条形图的左边距（像素）
  const leftPx = visibleStart * cellWidth
  // widthPx：条形图的宽度（像素）
  const widthPx = visibleDays * cellWidth

  // formatDateShort 函数：格式化日期为短格式（日/月）
  const formatDateShort = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  // dateRange：日期范围字符串
  const dateRange = `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`

  // getStatusColor 函数：根据变体类型和状态返回对应的颜色类名
  const getStatusColor = () => {
    // 如果是项目类型，返回灰色样式
    if (variant === "project") {
      return "bg-muted border text-foreground"
    }
    // 如果是任务类型，根据状态返回不同的颜色样式
    switch (status) {
      case "done":
        return "bg-teal-500/15 border-teal-500/40 text-teal-600" // 已完成：青色
      case "in-progress":
        return "bg-primary/15 border-primary/40 text-primary" // 进行中：主色调
      default:
        return "bg-primary/10 border-primary/30 text-primary" // 待办：浅色主色调
    }
  }

  return (
    <div className="relative w-full h-8">
      {/* 条形图容器 */}
      <div
        className={cn(
          "absolute top-0 h-full rounded-md border flex items-center px-3 transition-all", // 基础样式：绝对定位、圆角、边框、居中对齐、过渡动画
          getStatusColor(), // 动态颜色样式
        )}
        title={`${dateRange}: ${label}`} // 鼠标悬停提示：显示日期范围和标签
        style={{
          left: leftPx, // 左边距
          width: widthPx, // 宽度
        }}
      >
        {/* 条形图文本：显示日期范围和标签 */}
        <span className="text-xs font-medium truncate">
          {dateRange}: {label}
        </span>
        {/* 进度显示：仅项目类型且进度已定义时显示 */}
        {progress !== undefined && variant === "project" && (
          <span className="ml-auto text-xs font-medium text-muted-foreground pl-2">{progress}%</span>
        )}
      </div>
    </div>
  )
}

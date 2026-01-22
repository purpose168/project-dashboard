"use client"

// 导入 React 的 useState 钩子
import { useState } from "react"
// 导入 React 的 PointerEvent 类型
import type { PointerEvent as ReactPointerEvent } from "react"
// 导入日期处理函数（来自 date-fns 库）
import { addDays, differenceInCalendarDays, format } from "date-fns"

// 导入 Project 类型定义
import type { Project } from "@/lib/data/projects"
// 导入工具函数
import { cn } from "@/lib/utils"

// TimelineBarItem 类型定义：时间轴条目类型
export type TimelineBarItem = {
    id: string // 条目 ID
    name: string // 条目名称
    startDate: Date // 开始日期
    endDate: Date // 结束日期
    status?: Project["tasks"][number]["status"] // 状态（可选）
    progress?: number // 进度（可选）
}

// DraggableBarProps 类型定义：可拖拽条形图组件的属性
export type DraggableBarProps = {
    item: TimelineBarItem // 时间轴条目对象
    variant: "project" | "task" // 变体（项目或任务）
    viewStartDate: Date // 视图开始日期
    cellWidth: number // 单元格宽度
    onUpdateStart: (id: string, newStart: Date) => void // 更新开始日期的回调函数
    onUpdateDuration?: (id: string, newStart: Date, newEnd: Date) => void // 更新持续时间的回调函数（可选）
    onDoubleClick?: () => void // 双击事件的回调函数（可选）
}

// DraggableBar 组件：可拖拽条形图组件
// 用于显示项目或任务的时间轴条形图，支持拖拽移动和调整大小功能
export function DraggableBar({
    item,
    variant,
    viewStartDate,
    cellWidth,
    onUpdateStart,
    onUpdateDuration,
    onDoubleClick,
}: DraggableBarProps) {
    // durationDays：持续时间（天数）
    const durationDays = differenceInCalendarDays(item.endDate, item.startDate) + 1
    // offsetDays：偏移天数（从视图开始日期到条目开始日期的天数）
    const offsetDays = differenceInCalendarDays(item.startDate, viewStartDate)
    // left：条形图的左边距（像素）
    const left = offsetDays * cellWidth
    // width：条形图的宽度（像素）
    const width = durationDays * cellWidth

    // isDragging 状态：是否正在拖拽
    const [isDragging, setIsDragging] = useState(false)
    // dragOffset 状态：拖拽偏移量（像素）
    const [dragOffset, setDragOffset] = useState(0)
    // dragType 状态：拖拽类型（移动、调整左侧大小、调整右侧大小）
    const [dragType, setDragType] = useState<"move" | "resize-left" | "resize-right" | null>(null)

    // handlePointerDown 函数：处理指针按下事件（开始拖拽）
    const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        e.preventDefault() // 阻止默认行为
        e.stopPropagation() // 阻止事件冒泡
        setIsDragging(true) // 设置为拖拽状态

        const rect = e.currentTarget.getBoundingClientRect() // 获取元素的位置和尺寸
        const offsetX = e.clientX - rect.left // 计算鼠标相对于元素左侧的偏移量
        // 根据偏移量确定拖拽类型：
        // - 偏移量 < 8px：调整左侧大小
        // - 偏移量 > 元素宽度 - 8px：调整右侧大小
        // - 其他情况：移动
        const dragKind = offsetX < 8 ? "resize-left" : offsetX > rect.width - 8 ? "resize-right" : "move"
        setDragType(dragKind) // 设置拖拽类型

        const startX = e.clientX // 记录起始 X 坐标
        // 设置鼠标光标样式
        document.body.style.cursor = dragKind === "move" ? "grabbing" : "col-resize"

        // handlePointerMove 函数：处理指针移动事件（拖拽中）
        const handlePointerMove = (moveEvent: PointerEvent) => {
            setDragOffset(moveEvent.clientX - startX) // 更新拖拽偏移量
        }

        // handlePointerUp 函数：处理指针抬起事件（结束拖拽）
        const handlePointerUp = (upEvent: PointerEvent) => {
            const deltaX = upEvent.clientX - startX // 计算 X 轴移动距离
            const daysMoved = Math.round(deltaX / cellWidth) // 计算移动的天数（四舍五入）

            // 如果移动的天数不为 0，则更新条目
            if (daysMoved !== 0) {
                if (dragKind === "move") {
                    // 移动：更新开始日期
                    onUpdateStart(item.id, addDays(item.startDate, daysMoved))
                } else if (dragKind === "resize-left" && onUpdateDuration) {
                    // 调整左侧大小：更新开始日期
                    const newStartDate = addDays(item.startDate, daysMoved)
                    if (newStartDate < item.endDate) { // 确保开始日期早于结束日期
                        onUpdateDuration(item.id, newStartDate, item.endDate)
                    }
                } else if (dragKind === "resize-right" && onUpdateDuration) {
                    // 调整右侧大小：更新结束日期
                    const newEndDate = addDays(item.endDate, daysMoved)
                    if (newEndDate > item.startDate) { // 确保结束日期晚于开始日期
                        onUpdateDuration(item.id, item.startDate, newEndDate)
                    }
                }
            }

            // 重置拖拽状态
            setIsDragging(false)
            setDragOffset(0)
            setDragType(null)
            document.body.style.cursor = "" // 恢复鼠标光标样式
            // 移除事件监听器
            window.removeEventListener("pointermove", handlePointerMove)
            window.removeEventListener("pointerup", handlePointerUp)
        }

        // 添加全局事件监听器
        window.addEventListener("pointermove", handlePointerMove)
        window.addEventListener("pointerup", handlePointerUp)
    }

    // visualLeft：视觉左边距（考虑拖拽偏移）
    let visualLeft = left
    // visualWidth：视觉宽度（考虑拖拽偏移）
    let visualWidth = width

    // 如果正在拖拽，根据拖拽类型更新视觉位置和大小
    if (isDragging && dragType) {
        if (dragType === "move") {
            // 移动：更新左边距
            visualLeft = left + dragOffset
        } else if (dragType === "resize-right") {
            // 调整右侧大小：更新宽度（最小宽度为单元格宽度）
            visualWidth = Math.max(cellWidth, width + dragOffset)
        } else if (dragType === "resize-left") {
            // 调整左侧大小：更新左边距和宽度（最小宽度为单元格宽度）
            visualLeft = left + dragOffset
            visualWidth = Math.max(cellWidth, width - dragOffset)
        }
    }

    // dateLabel：日期标签（格式：开始日期/月 - 结束日期/月）
    const dateLabel = `${format(item.startDate, "d/M")} - ${format(item.endDate, "d/M")}`

    // taskColors：任务颜色（根据状态返回对应的颜色类名）
    const taskColors =
        item.status === "done"
            ? "bg-teal-500/15 border-teal-500/40 text-teal-600" // 已完成：青色
            : item.status === "in-progress"
                ? "bg-primary/10 border-primary/30 text-blue-800" // 进行中：蓝色
                : "bg-primary/10 border-primary/30 text-primary" // 待办：主色调

    return (
        <div
            onPointerDown={handlePointerDown} // 指针按下事件
            onDoubleClick={onDoubleClick} // 双击事件
            className={cn(
                "absolute h-[30px] top-[12px] rounded-md border flex items-center px-2 gap-2 select-none overflow-hidden cursor-grab active:cursor-grabbing group",
                variant === "project" ? "bg-muted border-border text-foreground" : taskColors, // 根据变体设置颜色
                isDragging ? "shadow-lg z-30 opacity-90" : "", // 拖拽时显示阴影和半透明效果
            )}
            style={{
                left: `${visualLeft}px`, // 左边距
                width: `${Math.max(visualWidth, 50)}px`, // 宽度（最小 50px）
                transition: isDragging ? "none" : "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)", // 拖拽时禁用过渡动画
            }}
        >
            {/* 调整大小的手柄 */}
            <div
                className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-l-md"
            />
            <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-r-md"
            />

            {/* 任务变体：显示左侧装饰线 */}
            {variant === "task" && <div className="w-0.5 h-4 bg-current/50 rounded-full shrink-0" />}
            {/* 条目标签：日期和名称 */}
            <span className="text-sm font-medium tracking-[0.0923px] whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
                {dateLabel}: {item.name}
            </span>
            {/* 任务变体：显示右侧装饰线 */}
            {variant === "task" && <div className="w-0.5 h-4 bg-current/50 rounded-full shrink-0 ml-auto" />}
        </div>
    )
}

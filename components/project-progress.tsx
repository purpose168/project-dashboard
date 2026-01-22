"use client"

// 导入列表勾选图标（来自 Phosphor Icons 库）
import { ListChecks } from "@phosphor-icons/react/dist/ssr"
// 导入 Project 类型定义
import type { Project } from "@/lib/data/projects"
// 导入进度圆环组件
import { ProgressCircle } from "@/components/progress-circle"
// 导入工具函数
import { cn } from "@/lib/utils"

// ProjectProgressProps 类型定义：项目进度组件的属性
export type ProjectProgressProps = {
  project: Project // 项目对象
  className?: string // 自定义类名
  /**
   * 进度圆环大小（像素），默认为 18px（与侧边栏的活跃项目匹配）
   */
  size?: number
  /**
   * 是否显示"已完成 / 总任务数"摘要文本
   */
  showTaskSummary?: boolean
}

// computeProjectProgress 函数：计算项目进度
// 参数：project - 项目对象
// 返回值：包含总任务数、已完成任务数、进度百分比的对象
function computeProjectProgress(project: Project) {
  // totalTasks：总任务数
  // 优先使用 project.tasks 的长度，如果没有则使用 project.taskCount，默认为 0
  const totalTasks = project.tasks?.length ?? project.taskCount ?? 0
  // doneTasks：已完成任务数
  // 如果有 project.tasks，则过滤出状态为 "done" 的任务
  // 否则根据 progress 计算已完成任务数
  const doneTasks = project.tasks
    ? project.tasks.filter((t) => t.status === "done").length
    : Math.round(((project.progress ?? 0) / 100) * totalTasks)

  // percent：进度百分比
  // 如果 project.progress 是数字，则直接使用
  // 否则根据已完成任务数和总任务数计算
  const percent = typeof project.progress === "number"
    ? project.progress
    : totalTasks
      ? Math.round((doneTasks / totalTasks) * 100)
      : 0

  return {
    totalTasks, // 总任务数
    doneTasks, // 已完成任务数
    percent: Math.max(0, Math.min(100, percent)), // 进度百分比（限制在 0-100 之间）
  }
}

// getProgressColor 函数：根据进度百分比返回颜色
// 参数：percent - 进度百分比（0-100）
// 返回值：对应的颜色值（十六进制）
function getProgressColor(percent: number): string {
  // 基于阈值的简单映射，与侧边栏调色板对齐
  if (percent >= 80) return "#22C55E" // 绿色（完成度高）
  if (percent >= 50) return "#F97316" // 橙色（完成度中等）
  if (percent > 0) return "#EF4444" // 红色（完成度低）
  return "#94A3B8" // 灰色（0%）
}

// ProjectProgress 组件：项目进度组件
// 用于显示项目的进度信息，包括进度圆环、进度百分比和任务摘要
export function ProjectProgress({ project, className, size = 18, showTaskSummary = true }: ProjectProgressProps) {
  // 计算项目进度
  const { totalTasks, doneTasks, percent } = computeProjectProgress(project)
  // 获取进度颜色
  const color = getProgressColor(percent)

  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      {/* 进度圆环 */}
      <ProgressCircle progress={percent} color={color} size={size} />
      {/* 进度信息 */}
      <div className="flex items-center gap-4">
        {/* 进度百分比 */}
        <span>{percent}%</span>
        {/* 任务摘要（如果启用且有任务） */}
        {showTaskSummary && totalTasks > 0 && (
          <span className="flex items-center gap-1 text-sm">
            <ListChecks className="h-4 w-4" /> {/* 列表勾选图标 */}
            {doneTasks} / {totalTasks} 任务 {/* 已完成 / 总任务数 */}
          </span>
        )}
      </div>
    </div>
  )
}

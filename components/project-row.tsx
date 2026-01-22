"use client"

// 导入 React 的 useState 钩子
import { useState } from "react"
// 导入复选框组件
import { Checkbox } from "@/components/ui/checkbox"
// 导入时间轴条形图组件
import { TimelineBar } from "@/components/timeline-bar"
// 导入图标组件（来自 Phosphor Icons 库）
import { CaretDown, CaretRight, Folder, ChartBar } from "@phosphor-icons/react/dist/ssr"
// 导入工具函数
import { cn } from "@/lib/utils"
// 导入 Project 类型定义
import type { Project } from "@/lib/data/projects"

// ProjectRowProps 接口定义：项目行组件的属性
interface ProjectRowProps {
  project: Project // 项目对象
  isExpanded: boolean // 是否展开
  onToggle: () => void // 切换展开/折叠的回调函数
  dates: Date[] // 日期数组
  cellWidth: number // 单元格宽度
}

// ProjectRow 组件：项目行组件
// 用于显示项目行，包含项目信息和时间轴，支持展开/折叠以显示任务
export function ProjectRow({ project, isExpanded, onToggle, dates, cellWidth }: ProjectRowProps) {
  // timelineWidth：时间轴宽度（日期数量 × 单元格宽度）
  const timelineWidth = dates.length * cellWidth

  return (
    <div className="border-b border-border/30">
      {/* 项目行 */}
      <div className="group flex cursor-pointer hover:bg-accent/30 transition-colors" onClick={onToggle}>
        {/* 项目信息 */}
        <div className="w-[280px] lg:w-[320px] shrink-0 flex items-center gap-2 px-4 py-3 bg-background sticky left-0 z-10 border-r border-border/40 border-l">
          {/* 展开/折叠按钮 */}
          <button className="p-0.5 rounded hover:bg-accent">
            {isExpanded ? (
              <CaretDown className="h-4 w-4 text-muted-foreground" /> 
            ) : (
              <CaretRight className="h-4 w-4 text-muted-foreground" /> 
            )}
          </button>
          <Folder className="h-4 w-4 text-muted-foreground" /> {/* 文件夹图标 */}
          <span className="font-medium text-sm truncate">{project.name}</span> {/* 项目名称 */}
          <span className="ml-1 text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 shrink-0">
            {project.taskCount} {/* 任务数量 */}
          </span>
        </div>

        {/* 项目时间轴 */}
        <div className="relative py-3 pr-4 pt-4 pb-4 shrink-0" style={{ width: timelineWidth }}>
          <TimelineBar
            startDate={project.startDate} // 开始日期
            endDate={project.endDate} // 结束日期
            dates={dates} // 日期数组
            cellWidth={cellWidth} // 单元格宽度
            label={project.name} // 标签（项目名称）
            progress={project.progress} // 进度
            variant="project" // 变体（项目）
          />
        </div>
      </div>

      {/* 任务行 */}
      <div className={cn("overflow-hidden transition-all duration-200", isExpanded ? "max-h-[500px]" : "max-h-0")}>
        {/* 遍历项目的所有任务，渲染任务行 */}
        {project.tasks.map((task) => (
          <TaskRow key={task.id} task={task} dates={dates} cellWidth={cellWidth} />
        ))}
      </div>
    </div>
  )
}

// TaskRowProps 接口定义：任务行组件的属性
interface TaskRowProps {
  task: Project["tasks"][number] // 任务对象
  dates: Date[] // 日期数组
  cellWidth: number // 单元格宽度
}

// TaskRow 组件：任务行组件
// 用于显示任务行，包含任务信息和时间轴
function TaskRow({ task, dates, cellWidth }: TaskRowProps) {
  // checked 状态：复选框是否选中
  const [checked, setChecked] = useState(task.status === "done")

  // getStatusColor 函数：根据任务状态返回对应的颜色类名
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "text-emerald-600" // 绿色（已完成）
      case "in-progress":
        return "text-primary" // 主色调（进行中）
      default:
        return "text-muted-foreground" // 灰色（待办）
    }
  }

  return (
    <div className="group flex hover:bg-accent/20 transition-colors">
      {/* 任务信息 */}
      <div className="w-[280px] lg:w-[320px] shrink-0 flex items-center gap-2 pl-10 pr-4 py-2.5 bg-background sticky left-0 z-10 border-r border-border/40">
        {/* 复选框 */}
        <Checkbox
          checked={checked}
          onCheckedChange={(c) => setChecked(c as boolean)}
          className={cn("h-4 w-4 rounded-sm", checked && "bg-teal-500 border-teal-500")}
        />
        {/* 任务详情 */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className={cn("text-sm truncate", checked && "line-through text-muted-foreground")}>{task.name}</span> {/* 任务名称 */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{task.assignee}</span> {/* 负责人 */}
            <ChartBar className="h-3 w-3" /> {/* 图表图标 */}
            <span className={getStatusColor(task.status)}>
              {/* 任务状态 */}
              {task.status === "done" ? "已完成" : task.status === "in-progress" ? "进行中" : "待办"}
            </span>
          </div>
        </div>
      </div>

      {/* 任务时间轴 */}
      <div className="relative py-2.5 pr-4 shrink-0" style={{ width: dates.length * cellWidth }}>
        <TimelineBar
          startDate={task.startDate} // 开始日期
          endDate={task.endDate} // 结束日期
          dates={dates} // 日期数组
          cellWidth={cellWidth} // 单元格宽度
          label={task.name} // 标签（任务名称）
          variant="task" // 变体（任务）
          status={task.status} // 任务状态
        />
      </div>
    </div>
  )
}

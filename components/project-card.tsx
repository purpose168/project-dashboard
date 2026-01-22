"use client"

// 导入日期格式化函数
import { format } from "date-fns"
// 导入 Project 类型定义
import type { Project } from "@/lib/data/projects"
// 导入头像组件
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// 导入头像 URL 获取函数
import { getAvatarUrl } from "@/lib/assets/avatars"
// 导入图标组件（来自 Phosphor Icons 库）
import { Folder, CalendarBlank, Flag, User } from "@phosphor-icons/react/dist/ssr"
// 导入工具函数
import { cn } from "@/lib/utils"
// 导入优先级徽章组件
import { PriorityBadge } from "@/components/priority-badge"
// 导入项目进度组件
import { ProjectProgress } from "@/components/project-progress"

// ProjectCardProps 类型定义：项目卡片组件的属性
type ProjectCardProps = {
  project: Project // 项目对象
  actions?: React.ReactNode // 操作按钮（可选）
  variant?: "list" | "board" // 卡片变体：list（列表）或 board（看板），默认为 list
}

// statusConfig 函数：根据项目状态返回对应的配置
// 参数：status - 项目状态（active、planned、backlog、completed、cancelled）
// 返回值：状态配置对象，包含标签、圆点颜色、药丸样式
function statusConfig(status: Project["status"]) {
  switch (status) {
    case "active": // 进行中状态
      return { label: "进行中", dot: "bg-teal-600", pill: "text-teal-700 border-teal-200 bg-teal-50" }
    case "planned": // 已计划状态
      return { label: "已计划", dot: "bg-zinc-900", pill: "text-zinc-900 border-zinc-200 bg-zinc-50" }
    case "backlog": // 待办状态
      return { label: "待办", dot: "bg-orange-600", pill: "text-orange-700 border-orange-200 bg-orange-50" }
    case "completed": // 已完成状态
      return { label: "已完成", dot: "bg-blue-600", pill: "text-blue-700 border-blue-200 bg-blue-50" }
    case "cancelled": // 已取消状态
      return { label: "已取消", dot: "bg-rose-600", pill: "text-rose-700 border-rose-200 bg-rose-50" }
    default: // 默认状态
      return { label: status, dot: "bg-zinc-400", pill: "text-zinc-700 border-zinc-200 bg-zinc-50" }
  }
}

// priorityLabel 函数：根据优先级返回对应的标签文本
// 参数：priority - 项目优先级（urgent、high、medium、low）
// 返回值：优先级标签文本（首字母大写）
function priorityLabel(priority: Project["priority"]) {
  if (priority === "urgent") return "紧急" // 紧急优先级
  return priority.charAt(0).toUpperCase() + priority.slice(1) // 其他优先级：首字母大写
}

// ProjectCard 组件：项目卡片组件
// 用于显示项目信息，支持列表和看板两种显示模式
// 包含项目名称、状态、优先级、截止日期、负责人、进度等信息
export function ProjectCard({ project, actions, variant = "list" }: ProjectCardProps) {
  // s：状态配置对象
  const s = statusConfig(project.status)
  // assignee：项目负责人（第一个成员）
  const assignee = project.members?.[0]
  // dueDate：项目截止日期
  const dueDate = project.endDate
  // avatarUrl：负责人头像 URL
  const avatarUrl = getAvatarUrl(assignee)
  // isBoard：是否为看板模式
  const isBoard = variant === "board"

  // initials：负责人姓名的首字母缩写（最多 2 个字母）
  const initials = assignee ? assignee.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() : null

  // secondaryLine：次要信息行（客户、类型、持续时间或标签）
  const secondaryLine = (() => {
    const a = project.client // 客户
    const b = project.typeLabel // 类型标签
    const c = project.durationLabel // 持续时间标签
    // 如果有客户、类型或持续时间，则显示它们（用 " • " 分隔）
    if (a || b || c) {
      return [a, b, c].filter(Boolean).join(" • ")
    }
    // 否则显示标签（如果有）
    if (project.tags && project.tags.length > 0) {
      return project.tags.join(" • ")
    }
    return ""
  })()

  // dueLabel：截止日期标签
  const dueLabel = (() => {
    if (!dueDate) return "无截止日期" // 如果没有截止日期，显示提示
    // 看板模式：使用简短的日期格式（如 "Jan 15"）
    return format(dueDate, "MMM d")
  })()

  return (
    <div className="rounded-2xl border border-border bg-background hover:shadow-lg/5 transition-shadow cursor-pointer">
      <div className="p-4">
        {/* 卡片头部：显示图标、状态、优先级和操作按钮 */}
        <div className="flex items-center justify-between">
          {/* 左侧：图标或截止日期 */}
          {isBoard ? (
            // 看板模式：显示截止日期和旗帜图标
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flag className="h-4 w-4" /> {/* 旗帜图标 */}
              <span>{dueLabel}</span> {/* 截止日期 */}
            </div>
          ) : (
            // 列表模式：显示文件夹图标
            <div className="text-muted-foreground">
              <Folder className="h-5 w-5" /> {/* 文件夹图标 */}
            </div>
          )}
          {/* 右侧：状态徽章、优先级徽章和操作按钮 */}
          <div className="flex items-center gap-2">
            {/* 列表模式：显示状态徽章 */}
            {!isBoard && (
              <div className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", s.pill)}>
                <span className={cn("inline-block size-1.5 rounded-full", s.dot)} /> {/* 状态圆点 */}
                {s.label} {/* 状态标签 */}
              </div>
            )}
            {/* 看板模式：显示优先级徽章 */}
            {isBoard && (
              <PriorityBadge level={project.priority} appearance="inline" />
            )}
            {/* 操作按钮 */}
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        </div>

        {/* 项目名称和次要信息 */}
        <div className="mt-3">
          {/* 项目名称 */}
          <p className="text-[15px] font-semibold text-foreground leading-6">
            {project.name}
          </p>
          {/* 次要信息 */}
          {isBoard ? (
            // 看板模式：显示次要信息行
            <div className="mt-1 text-sm text-muted-foreground truncate">
              {secondaryLine}
            </div>
          ) : (
            // 列表模式：显示次要信息行
            (() => {
              const a = project.client // 客户
              const b = project.typeLabel // 类型标签
              const c = project.durationLabel // 持续时间标签
              // 如果有客户、类型或持续时间，则显示它们（用 " • " 分隔）
              if (a || b || c) {
                return (
                  <p className="mt-1 text-sm text-muted-foreground truncate">
                    {[a, b, c].filter(Boolean).join(" • ")}
                  </p>
                )
              }
              // 否则显示标签（如果有）
              if (project.tags && project.tags.length > 0) {
                return (
                  <p className="mt-1 text-sm text-muted-foreground truncate">{project.tags.join(" • ")}</p>
                )
              }
              return null
            })()
          )}
        </div>


        {/* 列表模式：显示截止日期和优先级 */}
        {!isBoard && (
          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarBlank className="h-4 w-4" /> {/* 日历图标 */}
              <span>{dueDate ? format(dueDate, "MMM d, yyyy") : "—"}</span> {/* 截止日期 */}
            </div>
            <PriorityBadge level={project.priority} appearance="inline" /> {/* 优先级徽章 */}
          </div>
        )}

        {/* 分隔线 */}
        <div className="mt-4 border-t border-border/60" />

        {/* 底部：项目进度和负责人头像 */}
        <div className="mt-3 flex items-center justify-between">
          {/* 项目进度组件 */}
          <ProjectProgress project={project} size={isBoard ? 20 : 18} />
          {/* 负责人头像 */}
          <Avatar className="size-6 border border-border">
            <AvatarImage alt={assignee ?? ""} src={avatarUrl} /> {/* 头像图片 */}
            <AvatarFallback className="text-xs">
              {/* 如果没有头像，显示首字母缩写或用户图标 */}
              {initials ? initials : <User className="h-4 w-4 text-muted-foreground" />}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

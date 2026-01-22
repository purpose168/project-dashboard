"use client"

// 导入 React 相关模块
import React, { useEffect, useMemo, useState } from "react"
// 导入 Project 类型定义
import type { Project } from "@/lib/data/projects"
// 导入项目卡片组件
import { ProjectCard } from "@/components/project-card"
// 导入骨架屏组件
import { Skeleton } from "@/components/ui/skeleton"
// 导入弹出框相关组件
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// 导入按钮组件
import { Button } from "@/components/ui/button"
// 导入图标组件（来自 Phosphor Icons 库）
import { DotsThreeVertical, Plus, StackSimple, Spinner, CircleNotch, CheckCircle } from "@phosphor-icons/react/dist/ssr"

// columnStatusIcon 函数：根据项目状态返回对应的图标
// 参数：status - 项目状态（backlog、planned、active、completed）
// 返回值：对应的 React JSX 元素（图标）
function columnStatusIcon(status: Project["status"]): React.JSX.Element {
  switch (status) {
    case "backlog": // 待办状态：返回堆栈图标
      return <StackSimple className="h-4 w-4 text-muted-foreground" />
    case "planned": // 已计划状态：返回旋转图标
      return <Spinner className="h-4 w-4 text-muted-foreground" />
    case "active": // 进行中状态：返回圆环图标
      return <CircleNotch className="h-4 w-4 text-muted-foreground" />
    case "completed": // 已完成状态：返回勾选圆圈图标
      return <CheckCircle className="h-4 w-4 text-muted-foreground" />
    default: // 默认状态：返回堆栈图标
      return <StackSimple className="h-4 w-4 text-muted-foreground" />
  }
}

// ProjectBoardViewProps 类型定义：项目看板视图组件的属性
type ProjectBoardViewProps = {
  projects: Project[] // 项目列表
  loading?: boolean // 是否正在加载，默认为 false
}

// COLUMN_ORDER 常量：定义看板列的显示顺序
// 按照项目状态的顺序显示：待办 → 已计划 → 进行中 → 已完成
const COLUMN_ORDER: Array<Project["status"]> = ["backlog", "planned", "active", "completed"]

// columnStatusLabel 函数：根据项目状态返回对应的标签文本
// 参数：status - 项目状态（backlog、planned、active、completed、cancelled）
// 返回值：对应的状态标签文本
function columnStatusLabel(status: Project["status"]): string {
  switch (status) {
    case "backlog": // 待办状态
      return "待办"
    case "planned": // 已计划状态
      return "已计划"
    case "active": // 进行中状态
      return "进行中"
    case "completed": // 已完成状态
      return "已完成"
    case "cancelled": // 已取消状态
      return "已取消"
    default: // 默认状态：返回原始状态值
      return status
  }
}

// ProjectBoardView 组件：项目看板视图组件
// 用于以看板形式显示项目列表，支持拖拽功能、分组显示、加载状态等
// 类似于 Trello 或 Jira 的看板视图，每个列代表一个项目状态
export function ProjectBoardView({ projects, loading = false }: ProjectBoardViewProps) {
  // items 状态：项目列表，用于内部状态管理
  const [items, setItems] = useState<Project[]>(projects)
  // draggingId 状态：正在拖拽的项目 ID，用于拖拽时的视觉反馈
  const [draggingId, setDraggingId] = useState<string | null>(null)

  // useEffect：监听 projects 属性变化，同步更新 items 状态
  // 当外部传入的 projects 变化时，更新内部状态
  useEffect(() => {
    setItems(projects)
  }, [projects])

  // groups：使用 useMemo 缓存按状态分组的项目
  // 返回一个 Map，键为项目状态，值为对应状态的项目列表
  // 使用 useMemo 避免每次渲染都重新计算
  const groups = useMemo(() => {
    // 创建一个 Map，用于存储按状态分组的项目
    const m = new Map<Project["status"], Project[]>()
    // 初始化每个状态的空数组
    for (const s of COLUMN_ORDER) m.set(s, [])
    // 将每个项目添加到对应状态的数组中
    for (const p of items) m.get(p.status)!.push(p)
    return m
  }, [items])

  // onDropTo 函数：处理拖放事件
  // 参数：status - 目标状态（项目被拖放到哪个列）
  // 返回值：拖放事件处理函数
  const onDropTo = (status: Project["status"]) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault() // 阻止默认行为
    // 从 dataTransfer 中获取拖拽的项目 ID
    const id = e.dataTransfer.getData("text/id")
    if (!id) return // 如果没有 ID，直接返回
    // 清除拖拽状态
    setDraggingId(null)
    // 更新项目状态：将拖拽的项目移动到目标状态列
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }

  // onDragOver 函数：处理拖拽悬停事件
  // 允许在该元素上放置拖拽的元素
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault() // 阻止默认行为，允许放置
  }

  // draggableCard 函数：创建可拖拽的项目卡片
  // 参数：p - 项目对象
  // 返回值：可拖拽的项目卡片 JSX 元素
  const draggableCard = (p: Project) => (
    <div
      key={p.id} // 使用项目 ID 作为 key
      draggable // 启用拖拽功能
      // 根据拖拽状态应用不同的样式
      className={`transition-all ${
        draggingId === p.id
          ? "cursor-grabbing opacity-70 shadow-lg shadow-lg/20 scale-[0.98]" // 拖拽中：抓取光标、半透明、阴影、缩小
          : "cursor-grab" // 未拖拽：抓取光标
      }`}
      // 拖拽开始事件：设置拖拽数据和拖拽状态
      onDragStart={(e) => {
        e.dataTransfer.setData("text/id", p.id) // 将项目 ID 存储到 dataTransfer 中
        setDraggingId(p.id) // 设置正在拖拽的项目 ID
      }}
      // 拖拽结束事件：清除拖拽状态
      onDragEnd={() => setDraggingId(null)}
    >
      {/* 项目卡片组件 */}
      <ProjectCard
        project={p} // 项目对象
        variant="board" // 卡片变体：看板模式
        // 操作按钮：弹出框菜单
        actions={
          <Popover>
            {/* 弹出框触发器：按钮 */}
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                <DotsThreeVertical className="h-4 w-4" /> {/* 三个垂直点图标 */}
              </Button>
            </PopoverTrigger>
            {/* 弹出框内容：移动项目到不同状态的选项 */}
            <PopoverContent className="w-40 p-2" align="end">
              <div className="space-y-1">
                {/* 遍历所有状态，生成移动选项 */}
                {COLUMN_ORDER.map((s) => (
                  <button
                    key={s}
                    className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
                    // 点击时更新项目状态
                    onClick={() => setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: s } : x)))}
                  >
                    Move to {s} {/* 移动到指定状态 */}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        }
      />
    </div>
  )

  // 加载状态：显示骨架屏
  if (loading) {
    return (
      <div className="p-4">
        {/* 网格布局：响应式，根据屏幕宽度显示不同数量的列 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* 遍历所有状态列，显示骨架屏 */}
          {COLUMN_ORDER.map((s) => (
            <div key={s} className="rounded-xl bg-background/60">
              {/* 列头骨架：标题和计数 */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
                <Skeleton className="h-4 w-24" /> {/* 标题骨架 */}
                <Skeleton className="h-3 w-6" /> {/* 计数骨架 */}
              </div>
              {/* 列内容骨架：项目卡片骨架 */}
              <div className="p-3 space-y-3">
                {/* 显示 3 个项目卡片骨架 */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 计算项目总数
  const total = items.length
  // 空状态：没有项目时显示提示
  if (total === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">No projects found</div>
    )
  }

  // 主渲染：显示看板视图
  return (
    <div className="p-4">
      {/* 网格布局：响应式，根据屏幕宽度显示不同数量的列 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 遍历所有状态列 */}
        {COLUMN_ORDER.map((status) => (
          <div
            key={status}
            className="rounded-xl bg-muted" // 列容器：圆角、灰色背景
            onDragOver={onDragOver} // 拖拽悬停事件
            onDrop={onDropTo(status)} // 拖放事件
          >
            {/* 列头：显示状态图标、标签、计数和操作按钮 */}
            <div className="flex items-center justify-between px-3 py-3">
              {/* 左侧：状态图标、标签和计数 */}
              <div className="flex items-center gap-2">
                {columnStatusIcon(status)} {/* 状态图标 */}
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  {columnStatusLabel(status)} {/* 状态标签 */}
                </span>
                <span className="text-xs text-muted-foreground">{groups.get(status)?.length ?? 0}</span> {/* 项目计数 */}
              </div>
              {/* 右侧：添加按钮和更多操作按钮 */}
              <div className="flex items-center gap-1">
                {/* 添加项目按钮 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  type="button"
                  // TODO: 连接到创建项目的流程，为该列添加项目
                  onClick={() => {
                    /* 在此列添加项目的占位符 */
                  }}
                >
                  <Plus className="h-4 w-4" /> {/* 加号图标 */}
                </Button>
                {/* 更多操作按钮 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  type="button"
                >
                  <DotsThreeVertical className="h-4 w-4" /> {/* 三个垂直点图标 */}
                </Button>
              </div>
            </div>
            {/* 列内容：显示项目卡片和添加项目按钮 */}
            <div className="px-3 pb-3 space-y-3 min-h-[120px]">
              {/* 渲染该状态下的所有项目卡片 */}
              {(groups.get(status) ?? []).map(draggableCard)}
              {/* 添加项目按钮 */}
              <Button
                variant="ghost"
                size="sm"
                type="button"
              >
                <Plus className="mr-1 h-4 w-4" /> {/* 加号图标 */}
                Add project {/* 添加项目文本 */}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

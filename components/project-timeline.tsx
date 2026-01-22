"use client"

// 导入 React 的钩子函数
import { useState, useRef, useEffect, useMemo } from "react"
// 导入项目数据和类型定义
import { projects as initialProjects, type Project } from "@/lib/data/projects"
// 导入日期处理函数（来自 date-fns 库）
import {
  differenceInCalendarDays, // 计算日历天数差
  addDays, // 添加天数
  addWeeks, // 添加周数
  subWeeks, // 减去周数
  startOfWeek, // 获取一周的开始日期
  format, // 格式化日期
  isSameDay, // 判断是否为同一天
} from "date-fns"
// 导入图标组件（来自 Phosphor Icons 库）
import {
  CaretLeft, // 左箭头图标
  CaretRight, // 右箭头图标
  MagnifyingGlassPlus, // 放大镜加号图标
  MagnifyingGlassMinus, // 放大镜减号图标
  CaretDown, // 向下箭头图标
} from "@phosphor-icons/react/dist/ssr"
// 导入 UI 组件
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
// 导入工具函数
import { cn } from "@/lib/utils"
// 导入可拖拽条形图组件
import { DraggableBar } from "@/components/project-timeline-draggable-bar"
// 导入优先级图标组件
import { PriorityGlyphIcon } from "@/components/priority-badge"

// 固定的"今天"日期，使演示在时间上保持视觉一致性
// 这控制了初始视口和垂直的"今天"线
const FIXED_TODAY = new Date(2024, 0, 23) // 2024 年 1 月 23 日

// 从 lib/data 导入项目数据

// ProjectTimeline 组件：项目时间轴组件
// 用于显示项目和任务的时间轴，支持拖拽移动、调整大小、缩放、视图模式切换等功能
export function ProjectTimeline() {
  // projects 状态：项目列表
  const [projects, setProjects] = useState(initialProjects)
  // expandedProjects 状态：展开的项目 ID 列表
  const [expandedProjects, setExpandedProjects] = useState<string[]>(initialProjects.map((p) => p.id))
  // isSidebarOpen 状态：侧边栏是否打开
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  // viewMode 状态：视图模式（Day、Week、Month、Quarter）
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month" | "Quarter">("Week")
  // zoom 状态：缩放级别
  const [zoom, setZoom] = useState(1)
  // editDialog 状态：编辑对话框状态
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean // 是否打开
    type: "project" | "task" | null // 类型（项目或任务）
    projectId: string | null // 项目 ID
    taskId: string | null // 任务 ID
  }>({ isOpen: false, type: null, projectId: null, taskId: null })
  // editStartDate 状态：编辑的开始日期
  const [editStartDate, setEditStartDate] = useState("")
  // editEndDate 状态：编辑的结束日期
  const [editEndDate, setEditEndDate] = useState("")
  // viewStartDate 状态：视图开始日期
  // 从 FIXED_TODAY 所在周的前一周开始显示可见范围
  // 这样"今天"线不会太靠近名称列
  const [viewStartDate, setViewStartDate] = useState(
    () => startOfWeek(addWeeks(FIXED_TODAY, -1), { weekStartsOn: 1 }),
  )
  // scrollContainerRef 引用：滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  // nameColRef 引用：名称列引用
  const nameColRef = useRef<HTMLDivElement>(null)
  // shouldAutoScrollToTodayRef 引用：是否自动滚动到今天
  const shouldAutoScrollToTodayRef = useRef(true)
  // nameColWidth 状态：名称列宽度
  const [nameColWidth, setNameColWidth] = useState(280)
  // todayOffsetDays 状态：今天的偏移天数
  const [todayOffsetDays, setTodayOffsetDays] = useState<number | null>(null)
  // confirmDialog 状态：确认对话框状态
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean // 是否打开
    message: string // 消息
    onConfirm: () => void // 确认回调
    onCancel: () => void // 取消回调
  }>({
    isOpen: false,
    message: "",
    onConfirm: () => { },
    onCancel: () => { },
  })

  // viewModes：视图模式列表（使用 useMemo 缓存）
  const viewModes = useMemo(() => ["Day", "Week", "Month", "Quarter"] as const, [])

  // toggleProject 函数：切换项目的展开/折叠状态
  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  // goToToday 函数：跳转到今天
  const goToToday = () => {
    shouldAutoScrollToTodayRef.current = true // 设置自动滚动标志
    setViewStartDate(startOfWeek(addWeeks(FIXED_TODAY, -1), { weekStartsOn: 1 })) // 设置视图开始日期
  }

  // navigateTime 函数：导航时间（向前或向后）
  const navigateTime = (direction: "prev" | "next") => {
    const step = direction === "next" ? 1 : -1 // 步骤（向前为 1，向后为 -1）
    const weeksStep = viewMode === "Quarter" ? 12 : viewMode === "Month" ? 4 : 1 // 根据视图模式确定周数步长
    setViewStartDate((d) => (step === 1 ? addWeeks(d, weeksStep) : subWeeks(d, weeksStep))) // 更新视图开始日期
  }

  // getDates 函数：生成时间轴的日期数组
  const getDates = (): Date[] => {
    // 根据视图模式确定要渲染的天数
    const daysToRender = viewMode === "Day" ? 21 : viewMode === "Week" ? 60 : viewMode === "Month" ? 90 : 120
    // 生成日期数组
    return Array.from({ length: daysToRender }).map((_, i) => addDays(viewStartDate, i))
  }

  // dates：日期数组（使用 useMemo 缓存）
  const dates = useMemo(() => getDates(), [viewMode, viewStartDate])

  // baseCellWidth：基础单元格宽度（根据视图模式确定）
  // 每天的宽度取决于视图模式，以便实现实用的月视图
  const baseCellWidth = viewMode === "Day" ? 140 : viewMode === "Week" ? 60 : viewMode === "Month" ? 40 : 20
  // cellWidth：单元格宽度（考虑缩放级别，最小为 20px）
  const cellWidth = Math.max(20, Math.round(baseCellWidth * zoom))
  // timelineWidth：时间轴宽度
  const timelineWidth = dates.length * cellWidth

  // useEffect：当视图模式改变时，重置缩放级别
  useEffect(() => {
    setZoom(1)
  }, [viewMode])

  // useEffect：监听名称列的大小变化
  useEffect(() => {
    const el = nameColRef.current
    if (!el) return
    // update 函数：更新名称列宽度
    const update = () => {
      setNameColWidth(Math.round(el.getBoundingClientRect().width))
    }
    update() // 立即更新一次
    const ro = new ResizeObserver(update) // 创建 ResizeObserver
    ro.observe(el) // 监听元素大小变化
    return () => ro.disconnect() // 清理：断开监听
  }, [])

  // useEffect：计算"今天"线的位置（基于固定的演示日期）
  useEffect(() => {
    const offset = differenceInCalendarDays(FIXED_TODAY, dates[0]) // 计算偏移天数
    if (offset < 0 || offset >= dates.length) { // 如果超出日期范围
      setTodayOffsetDays(null)
      return
    }
    setTodayOffsetDays(offset) // 设置偏移天数
  }, [dates])

  // useEffect：自动滚动到今天
  useEffect(() => {
    if (!shouldAutoScrollToTodayRef.current) return // 如果不需要自动滚动，直接返回
    if (todayOffsetDays == null) return // 如果偏移天数为空，直接返回

    const el = scrollContainerRef.current
    if (!el) return

    const sidebarWidth = isSidebarOpen ? nameColWidth : 0 // 侧边栏宽度
    const timelineViewportWidth = Math.max(0, el.clientWidth - sidebarWidth) // 时间轴视口宽度
    const dayX = todayOffsetDays * cellWidth // 今天的 X 坐标
    const target = Math.max(0, dayX - timelineViewportWidth / 2 + cellWidth / 2) // 目标滚动位置（将今天居中）

    el.scrollTo({ left: target, behavior: "smooth" }) // 平滑滚动到目标位置
    shouldAutoScrollToTodayRef.current = false // 清除自动滚动标志
  }, [todayOffsetDays, cellWidth, isSidebarOpen, nameColWidth])

  // toggleTaskStatus 函数：切换任务状态
  const toggleTaskStatus = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p // 如果不是目标项目，直接返回
        return {
          ...p,
          tasks: p.tasks.map((t) => {
            if (t.id !== taskId) return t // 如果不是目标任务，直接返回
            return { ...t, status: t.status === "done" ? "todo" : "done" } // 切换状态
          }),
        }
      }),
    )
  }

  // handleUpdateTask 函数：处理任务更新（移动任务）
  const handleUpdateTask = (projectId: string, taskId: string, newStart: Date) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p // 如果不是目标项目，直接返回

        const task = p.tasks.find((t) => t.id === taskId)
        if (!task) return p // 如果找不到任务，直接返回

        const taskDuration = differenceInCalendarDays(task.endDate, task.startDate) + 1 // 任务持续时间
        const newEnd = addDays(newStart, taskDuration - 1) // 新的结束日期

        const needsExpand = newStart < p.startDate || newEnd > p.endDate // 是否需要扩展项目范围
        if (needsExpand) {
          // 显示确认对话框
          showConfirmDialog(
            "This task is outside the project range. Expand project to fit?",
            () => {
              setProjects((prev) =>
                prev.map((proj) => {
                  if (proj.id !== p.id) return proj
                  return {
                    ...proj,
                    startDate: newStart < proj.startDate ? newStart : proj.startDate, // 更新开始日期
                    endDate: newEnd > proj.endDate ? newEnd : proj.endDate, // 更新结束日期
                    tasks: proj.tasks.map((t) => (t.id === taskId ? { ...t, startDate: newStart, endDate: newEnd } : t)),
                  }
                })
              )
            }
          )
          return p // 暂不更新，等待确认
        }

        return {
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, startDate: newStart, endDate: newEnd } : t)),
        }
      }),
    )
  }

  // handleUpdateProjectDuration 函数：处理项目持续时间更新
  const handleUpdateProjectDuration = (projectId: string, newStart: Date, newEnd: Date) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p // 如果不是目标项目，直接返回
        return {
          ...p,
          startDate: newStart, // 更新开始日期
          endDate: newEnd, // 更新结束日期
          tasks: p.tasks, // 暂时保持任务不变
        }
      }),
    )
  }

  // handleUpdateTaskDuration 函数：处理任务持续时间更新
  const handleUpdateTaskDuration = (projectId: string, taskId: string, newStart: Date, newEnd: Date) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p // 如果不是目标项目，直接返回
        return {
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, startDate: newStart, endDate: newEnd } : t)),
        }
      }),
    )
  }

  // showConfirmDialog 函数：显示确认对话框
  const showConfirmDialog = (message: string, onConfirm: () => void, onCancel: () => void = () => { }) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm,
      onCancel,
    })
  }

  // handleConfirmDialogClose 函数：处理确认对话框关闭
  const handleConfirmDialogClose = (confirmed: boolean) => {
    if (confirmed) {
      confirmDialog.onConfirm() // 如果确认，执行确认回调
    } else {
      confirmDialog.onCancel() // 如果取消，执行取消回调
    }
    setConfirmDialog({
      isOpen: false,
      message: "",
      onConfirm: () => { },
      onCancel: () => { },
    })
  }

  // handleUpdateProject 函数：处理项目更新（移动项目）
  const handleUpdateProject = (projectId: string, newStart: Date, confirmed: boolean = false) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p // 如果不是目标项目，直接返回

        const durationDays = differenceInCalendarDays(p.endDate, p.startDate) + 1 // 项目持续时间
        const newEnd = addDays(newStart, durationDays - 1) // 新的结束日期
        const diff = differenceInCalendarDays(newStart, p.startDate) // 天数差

        const shouldMoveChildren = p.tasks.length > 0 // 是否需要移动子任务
        if (shouldMoveChildren && !confirmed) {
          // 显示确认对话框
          showConfirmDialog(
            `Move all ${p.tasks.length} tasks along with the project?`,
            () => {
              // 使用确认重新运行更新
              handleUpdateProject(projectId, newStart, true)
            }
          )
          return p // 暂不更新，等待确认
        }

        return {
          ...p,
          startDate: newStart, // 更新开始日期
          endDate: newEnd, // 更新结束日期
          tasks: shouldMoveChildren
            ? p.tasks.map((t) => ({
              ...t,
              startDate: addDays(t.startDate, diff), // 更新任务开始日期
              endDate: addDays(t.endDate, diff), // 更新任务结束日期
            }))
            : p.tasks,
        }
      }),
    )
  }

  // handleSaveEdit 函数：保存编辑
  const handleSaveEdit = () => {
    if (!editDialog.type || !editDialog.projectId) return

    const newStart = new Date(editStartDate) // 新的开始日期
    const newEnd = new Date(editEndDate) // 新的结束日期

    if (editDialog.type === "project") {
      handleUpdateProject(editDialog.projectId, newStart) // 更新项目
    } else if (editDialog.type === "task" && editDialog.taskId) {
      handleUpdateTask(editDialog.projectId, editDialog.taskId, newStart) // 更新任务
    }

    setEditDialog({ isOpen: false, type: null, projectId: null, taskId: null }) // 关闭对话框
  }

  // handleDoubleClick 函数：处理双击事件
  const handleDoubleClick = (type: "project" | "task", projectId: string, taskId?: string) => {
    const item = type === "project"
      ? projects.find(p => p.id === projectId)
      : projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId)

    if (!item) return

    setEditDialog({
      isOpen: true,
      type,
      projectId,
      taskId: taskId || null
    })
    setEditStartDate(item.startDate.toISOString().split('T')[0]) // 设置编辑开始日期
    setEditEndDate(item.endDate.toISOString().split('T')[0]) // 设置编辑结束日期
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background min-w-0">
      {/* 时间轴控制栏 */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2 bg-background">
        <div className="flex items-center gap-2">
          {/* 侧边栏切换按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={() => setIsSidebarOpen((s) => !s)}
          >
            <CaretDown className={cn("h-4 w-4 transition-transform", isSidebarOpen ? "rotate-90" : "-rotate-90")} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {/* 当前视图日期 */}
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
            {viewStartDate.toLocaleString("en", {
              month: "long",
              year: "numeric",
            })}
          </span>
          {/* 时间导航按钮 */}
          <div className="hidden md:flex items-center gap-1 ml-4 justify-between">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => navigateTime("prev")}>
              <CaretLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-lg px-3 text-xs bg-transparent"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => navigateTime("next")}>
              <CaretRight className="h-4 w-4" />
            </Button>
          </div>
          {/* 视图模式选择器 */}
          <div className="ml-2 hidden md:flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-lg px-3 text-xs justify-between min-w-[80px]"
                >
                  {viewMode}
                  <CaretDown className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[120px] p-1" align="start">
                {viewModes.map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-8 px-2 text-xs"
                    onClick={() => setViewMode(mode)}
                  >
                    {mode}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
          {/* 缩放按钮 */}
          <div className="ml-2 hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={() => setZoom((z) => Math.max(0.5, Math.min(2.5, z * 1.2)))}
            >
              <MagnifyingGlassPlus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={() => setZoom((z) => Math.max(0.5, Math.min(2.5, z / 1.2)))}
            >
              <MagnifyingGlassMinus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 桌面端时间轴视图 */}
      <div className="hidden md:block flex-1 overflow-hidden min-w-0">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-auto min-w-0"
        >
          <div className="relative min-w-max">
            {/* 时间轴头部 - 网格布局 */}
            <div className="flex h-10 items-center border-b bg-muted/30 border-border sticky top-0 z-20">
              {/* 固定的名称列头部 */}
              <div
                ref={nameColRef}
                className={cn(
                  "shrink-0 bg-background sticky left-0 z-30 border-r border-border/20 transition-all duration-300 flex items-center",
                  isSidebarOpen ? "w-[280px] lg:w-[320px]" : "w-0 overflow-hidden px-0 border-none",
                )}
              >
                <div className="px-4">
                  <span className="text-xs font-medium text-muted-foreground">Name</span>
                </div>
              </div>

              {/* 可滚动的时间轴日期 */}
              <div className="relative shrink-0 h-full" style={{ width: timelineWidth }}>
                <div className="flex h-full items-center" style={{ width: timelineWidth }}>
                  {dates.map((day, i) => {
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6 // 是否为周末
                    const showLabel =
                      viewMode === "Day" ||
                      (viewMode === "Week" && i % 2 === 0) ||
                      (viewMode === "Month" && day.getDay() === 1) ||
                      (viewMode === "Quarter" && day.getDate() === 1)

                    const headerFormat = viewMode === "Day" ? "EEE d" : "d" // 头部格式
                    const label = viewMode === "Quarter" ? format(day, "MMM") : format(day, headerFormat) // 标签

                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex-none h-full flex items-center justify-center border-r border-border/20",
                          isWeekend && viewMode === "Day" ? "bg-muted/20" : "",
                        )}
                        style={{ width: cellWidth }}
                      >
                        {showLabel && (
                          <div className="h-full flex items-center justify-center">
                            <span
                              className={cn(
                                "block text-xs whitespace-nowrap leading-none",
                                isSameDay(day, FIXED_TODAY) ? "text-primary font-semibold" : "text-muted-foreground",
                              )}
                            >
                              {label}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {/* 右侧渐变遮罩 */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none z-10" />
              </div>
            </div>

            {/* 项目行（带固定的名称列） */}
            <div className="flex flex-col relative">
              {projects.map((project) => (
                <div key={project.id} className="w-full flex flex-col">
                  {/* 项目行 */}
                  <div className="flex h-[54px] group hover:bg-accent/20 relative border-b border-border/20">
                    {/* 项目名称列 */}
                    <div
                      className={cn(
                        "shrink-0 sticky left-0 z-30 bg-background border-r border-border/20 transition-all duration-300",
                        isSidebarOpen ? "w-[280px] lg:w-[320px]" : "w-0 overflow-hidden border-none",
                      )}
                    >
                      <div
                        className={cn(
                          "h-[54px] w-full flex items-center justify-between px-4 cursor-pointer",
                          isSidebarOpen ? "" : "px-0",
                        )}
                        onClick={() => toggleProject(project.id)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={cn("transition-transform", expandedProjects.includes(project.id) ? "rotate-0" : "-rotate-90")}>
                            <CaretDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-semibold text-md truncate">{project.name}</span>
                          <span className="ml-1 text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 shrink-0">
                            {project.taskCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 项目时间轴 */}
                    <div className="relative h-full shrink-0 overflow-hidden" style={{ width: timelineWidth }}>
                      {/* 背景网格 */}
                      <div className="absolute inset-0 flex pointer-events-none h-full">
                        {dates.map((day, i) => {
                          const isWeekend = day.getDay() === 0 || day.getDay() === 6 // 是否为周末
                          return (
                            <div
                              key={i}
                              style={{ width: cellWidth }}
                              className={cn(
                                "flex-none h-full border-r border-border/20",
                                isWeekend && viewMode === "Day" ? "bg-muted/20" : "",
                              )}
                            />
                          )
                        })}
                      </div>

                      {/* 可拖拽的项目条形图 */}
                      <DraggableBar
                        item={{
                          id: project.id,
                          name: project.name,
                          startDate: project.startDate,
                          endDate: project.endDate,
                          progress: project.progress,
                        }}
                        variant="project"
                        viewStartDate={viewStartDate}
                        cellWidth={cellWidth}
                        onUpdateStart={(id, newStart) => handleUpdateProject(id, newStart)}
                        onUpdateDuration={(id, newStart, newEnd) => handleUpdateProjectDuration(id, newStart, newEnd)}
                        onDoubleClick={() => handleDoubleClick("project", project.id)}
                      />
                    </div>
                  </div>

                  {/* 任务行（仅当项目展开时显示） */}
                  {expandedProjects.includes(project.id) &&
                    project.tasks.map((task) => (
                      <div key={task.id} className="flex h-[54px] group hover:bg-accent/10 relative border-b border-border/20">
                        {/* 任务名称列 */}
                        <div
                          className={cn(
                            "shrink-0 sticky left-0 z-30 bg-background border-r border-border/20 transition-all duration-300",
                            isSidebarOpen ? "w-[280px] lg:w-[320px]" : "w-0 overflow-hidden border-none",
                          )}
                        >
                          <div className={cn("h-[54px] w-full flex items-center gap-2 pl-10 pr-4", isSidebarOpen ? "" : "px-0")}>
                            <Checkbox
                              checked={task.status === "done"}
                              onCheckedChange={(_checked: boolean) => toggleTaskStatus(project.id, task.id)}
                              className={cn(
                                "h-4 w-4 rounded-sm",
                                "data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500 data-[state=checked]:text-white",
                              )}
                            />
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className={cn("text-md truncate", task.status === "done" && "line-through text-muted-foreground")}>
                                {task.name}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{task.assignee}</span>
                                <span>•</span>
                                <PriorityGlyphIcon level={project.priority} size="sm" />
                                <span>•</span>
                                <span>{task.status}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 任务时间轴 */}
                        <div className="relative h-full shrink-0 overflow-hidden" style={{ width: timelineWidth }}>
                          {/* 背景网格 */}
                          <div className="absolute inset-0 flex pointer-events-none h-full">
                            {dates.map((day, i) => {
                              const isWeekend = day.getDay() === 0 || day.getDay() === 6 // 是否为周末
                              return (
                                <div
                                  key={i}
                                  style={{ width: cellWidth }}
                                  className={cn(
                                    "flex-none h-full border-r border-border/20",
                                    isWeekend && viewMode === "Day" ? "bg-muted/20" : "",
                                  )}
                                />
                              )
                            })}
                          </div>

                          {/* 可拖拽的任务条形图 */}
                          <DraggableBar
                            item={{
                              id: task.id,
                              name: task.name,
                              startDate: task.startDate,
                              endDate: task.endDate,
                              status: task.status,
                            }}
                            variant="task"
                            viewStartDate={viewStartDate}
                            cellWidth={cellWidth}
                            onUpdateStart={(id, newStart) => handleUpdateTask(project.id, id, newStart)}
                            onUpdateDuration={(id, newStart, newEnd) => handleUpdateTaskDuration(project.id, id, newStart, newEnd)}
                            onDoubleClick={() => handleDoubleClick("task", project.id, task.id)}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* "今天"线 */}
            {todayOffsetDays != null && (
              <div
                className="absolute z-10 pointer-events-none overflow-hidden"
                style={{
                  left: nameColWidth,
                  top: 40,
                  bottom: 0,
                  width: timelineWidth,
                }}
              >
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-primary"
                  style={{ left: (todayOffsetDays || 0) * cellWidth + cellWidth / 2 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 移动端视图 */}
      <div className="md:hidden flex-1 overflow-auto">
        {projects.map((project) => (
          <div key={project.id} className="border-b border-border/30">
            {/* 移动端项目卡片 */}
            <div
              className="p-4 flex items-center justify-between cursor-pointer active:bg-accent/50"
              onClick={() => toggleProject(project.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {expandedProjects.includes(project.id) ? (
                  <CaretDown className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <CaretRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base truncate">{project.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 shrink-0">
                      {project.taskCount}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {project.startDate.toLocaleDateString("vi")} - {project.endDate.toLocaleDateString("vi")}
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground shrink-0 ml-2">{project.progress}%</div>
            </div>

            {/* 移动端任务列表 */}
            {expandedProjects.includes(project.id) && (
              <div className="bg-muted/20">
                {project.tasks.map((task) => (
                  <div key={task.id} className="px-4 py-3 pl-12 border-t border-border/20">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={task.status === "done"}
                        onCheckedChange={(_checked: boolean) => toggleTaskStatus(project.id, task.id)}
                        className={cn(
                          "h-4 w-4 rounded-sm mt-0.5",
                          "data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500 data-[state=checked]:text-white",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-md">{task.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{task.assignee}</span>
                          <span>•</span>
                          <PriorityGlyphIcon level={project.priority} size="sm" />
                          <span>•</span>
                          <span>{task.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 编辑日期对话框 */}
      <Dialog open={editDialog.isOpen} onOpenChange={(open) => {
        if (!open) setEditDialog({ isOpen: false, type: null, projectId: null, taskId: null });
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Date</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="item-name" className="text-sm font-medium">Name {editDialog.type === "project" ? "(Project)" : "(Task)"}</label>
              <Input
                id="item-name"
                value={editDialog.type === "project"
                  ? projects.find(p => p.id === editDialog.projectId)?.name || ''
                  : projects.find(p => p.id === editDialog.projectId)?.tasks.find(t => t.id === editDialog.taskId)?.name || ''
                }
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="start-date" className="text-sm font-medium">Start Date</label>
              <Input
                id="start-date"
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end-date" className="text-sm font-medium">End Date</label>
              <Input
                id="end-date"
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialog({ isOpen: false, type: null, projectId: null, taskId: null })}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 确认对话框 */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => {
        if (!open) handleConfirmDialogClose(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">{confirmDialog.message}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleConfirmDialogClose(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleConfirmDialogClose(true)}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

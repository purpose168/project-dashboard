"use client"

// 导入 React 的钩子函数
import { useEffect, useState, useRef, useMemo } from "react"
// 导入 Next.js 的导航钩子
import { usePathname, useRouter, useSearchParams } from "next/navigation"
// 导入项目头部组件
import { ProjectHeader } from "@/components/project-header"
// 导入项目时间轴组件
import { ProjectTimeline } from "@/components/project-timeline"
// 导入项目卡片视图组件
import { ProjectCardsView } from "@/components/project-cards-view"
// 导入项目看板视图组件
import { ProjectBoardView } from "@/components/project-board-view"
// 导入项目数据和过滤计数计算函数
import { computeFilterCounts, projects } from "@/lib/data/projects"
// 导入默认视图选项、过滤芯片类型和视图选项类型
import { DEFAULT_VIEW_OPTIONS, type FilterChip, type ViewOptions } from "@/lib/view-options"
// 导入 URL 过滤器工具函数
import { chipsToParams, paramsToChips } from "@/lib/url/filters"

// ProjectsContent 组件：项目内容组件
// 用于显示项目列表，支持多种视图模式（时间轴、列表、看板）和过滤功能
export function ProjectsContent() {
  // router：路由器实例
  const router = useRouter()
  // pathname：当前路径
  const pathname = usePathname()
  // searchParams：URL 搜索参数
  const searchParams = useSearchParams()

  // viewOptions 状态：视图选项
  const [viewOptions, setViewOptions] = useState<ViewOptions>(DEFAULT_VIEW_OPTIONS)
  // filters 状态：过滤芯片列表
  const [filters, setFilters] = useState<FilterChip[]>([])

  // isSyncingRef 引用：是否正在同步（用于避免反馈循环）
  const isSyncingRef = useRef(false)
  // prevParamsRef 引用：上一次的 URL 参数
  const prevParamsRef = useRef<string>("")

  // removeFilter 函数：移除过滤芯片
  const removeFilter = (key: string, value: string) => {
    const next = filters.filter((f) => !(f.key === key && f.value === value)) // 过滤掉要移除的芯片
    setFilters(next) // 更新过滤芯片列表
    replaceUrlFromChips(next) // 更新 URL
  }

  // applyFilters 函数：应用过滤芯片
  const applyFilters = (chips: FilterChip[]) => {
    setFilters(chips) // 更新过滤芯片列表
    replaceUrlFromChips(chips) // 更新 URL
  }

  // useEffect：同步 URL 参数到过滤芯片
  useEffect(() => {
    const currentParams = searchParams.toString() // 当前 URL 参数字符串

    // 只有在首次加载或参数实际发生变化时才同步（不是由我们自己的更新引起的）
    if (prevParamsRef.current === currentParams) return

    // 如果我们刚刚进行了更新，跳过此同步以避免反馈循环
    if (isSyncingRef.current) {
      isSyncingRef.current = false
      return
    }

    prevParamsRef.current = currentParams // 更新上一次的参数
    const params = new URLSearchParams(searchParams.toString()) // 创建 URLSearchParams 对象
    const chips = paramsToChips(params) // 将参数转换为过滤芯片
    setFilters(chips) // 更新过滤芯片列表
  }, [searchParams])

  // replaceUrlFromChips 函数：根据过滤芯片更新 URL
  const replaceUrlFromChips = (chips: FilterChip[]) => {
    const params = chipsToParams(chips) // 将过滤芯片转换为 URL 参数
    const qs = params.toString() // 参数字符串
    const url = qs ? `${pathname}?${qs}` : pathname // 完整 URL

    isSyncingRef.current = true // 设置同步标志
    prevParamsRef.current = qs // 更新上一次的参数
    router.replace(url, { scroll: false }) // 替换 URL（不滚动）
  }

  // filteredProjects：过滤后的项目列表（使用 useMemo 缓存）
  const filteredProjects = useMemo(() => {
    let list = projects.slice() // 复制项目列表

    // 应用显示已关闭项目的切换
    if (!viewOptions.showClosedProjects) {
      list = list.filter((p) => p.status !== "completed" && p.status !== "cancelled") // 过滤掉已完成和已取消的项目
    }

    // 从过滤芯片构建过滤桶
    const statusSet = new Set<string>() // 状态集合
    const prioritySet = new Set<string>() // 优先级集合
    const tagSet = new Set<string>() // 标签集合
    const memberSet = new Set<string>() // 成员集合

    // 遍历过滤芯片，填充集合
    for (const { key, value } of filters) {
      const k = key.trim().toLowerCase() // 键（小写）
      const v = value.trim().toLowerCase() // 值（小写）
      if (k.startsWith("status")) statusSet.add(v) // 状态过滤
      else if (k.startsWith("priority")) prioritySet.add(v) // 优先级过滤
      else if (k.startsWith("tag")) tagSet.add(v) // 标签过滤
      else if (k === "pic" || k.startsWith("member")) memberSet.add(v) // 成员过滤
    }

    // 应用过滤条件
    if (statusSet.size) list = list.filter((p) => statusSet.has(p.status.toLowerCase())) // 按状态过滤
    if (prioritySet.size) list = list.filter((p) => prioritySet.has(p.priority.toLowerCase())) // 按优先级过滤
    if (tagSet.size) list = list.filter((p) => p.tags.some((t) => tagSet.has(t.toLowerCase()))) // 按标签过滤
    if (memberSet.size) {
      const members = Array.from(memberSet) // 成员数组
      list = list.filter((p) => p.members.some((m) => members.some((mv) => m.toLowerCase().includes(mv)))) // 按成员过滤
    }

    // 排序
    const sorted = list.slice() // 复制列表
    if (viewOptions.ordering === "alphabetical") sorted.sort((a, b) => a.name.localeCompare(b.name)) // 按字母顺序排序
    if (viewOptions.ordering === "date") sorted.sort((a, b) => (a.endDate?.getTime() || 0) - (b.endDate?.getTime() || 0)) // 按日期排序
    return sorted
  }, [filters, viewOptions, projects])

  return (
    <div className="flex flex-1 flex-col bg-background mx-2 my-2 border border-border rounded-lg min-w-0">
      {/* 项目头部组件 */}
      <ProjectHeader
        filters={filters} // 过滤芯片列表
        onRemoveFilter={removeFilter} // 移除过滤芯片的回调
        onFiltersChange={applyFilters} // 过滤芯片变化的回调
        counts={computeFilterCounts(filteredProjects)} // 过滤计数
        viewOptions={viewOptions} // 视图选项
        onViewOptionsChange={setViewOptions} // 视图选项变化的回调
      />
      {/* 根据视图类型渲染不同的视图 */}
      {viewOptions.viewType === "timeline" && <ProjectTimeline />} {/* 时间轴视图 */}
      {viewOptions.viewType === "list" && <ProjectCardsView projects={filteredProjects} />} {/* 列表视图 */}
      {viewOptions.viewType === "board" && <ProjectBoardView projects={filteredProjects} />} {/* 看板视图 */}
    </div>
  )
}

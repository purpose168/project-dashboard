"use client"

// 导入 React Hooks
import { useEffect, useMemo, useState } from "react"
// 导入按钮组件
import { Button } from "@/components/ui/button"
// 导入弹出框相关组件
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// 导入输入框组件
import { Input } from "@/components/ui/input"
// 导入复选框组件
import { Checkbox } from "@/components/ui/checkbox"
// 导入头像组件
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// 导入工具函数
import { cn } from "@/lib/utils"
// 导入图标组件（来自 Phosphor Icons 库）
import {
  Funnel, // 漏斗图标（过滤）
  Spinner, // 旋转图标（状态）
  Tag, // 标签图标
  User, // 用户图标
  ChartBar, // 图表图标（优先级）
} from "@phosphor-icons/react/dist/ssr"

// FilterChip 类型定义：过滤芯片的数据结构
export type FilterChip = { key: string; value: string }

// FilterTemp 类型定义：临时过滤状态的数据结构
type FilterTemp = {
  status: Set<string> // 状态过滤集合
  priority: Set<string> // 优先级过滤集合
  tags: Set<string> // 标签过滤集合
  members: Set<string> // 成员过滤集合
}

// FilterCounts 接口定义：过滤项数量的数据结构
interface FilterCounts {
  status?: Record<string, number> // 状态数量
  priority?: Record<string, number> // 优先级数量
  tags?: Record<string, number> // 标签数量
  members?: Record<string, number> // 成员数量
}

// FilterPopoverProps 接口定义：过滤弹出框组件的属性
interface FilterPopoverProps {
  initialChips?: FilterChip[] // 初始芯片列表
  onApply: (chips: FilterChip[]) => void // 应用过滤的回调函数
  onClear: () => void // 清除过滤的回调函数
  counts?: FilterCounts // 过滤项数量
}

// FilterPopover 组件：过滤弹出框组件
// 用于显示过滤选项，支持状态、优先级、标签、成员等多种过滤条件
// 用户可以选择多个过滤条件，然后点击 Apply 按钮应用过滤
export function FilterPopover({ initialChips, onApply, onClear, counts }: FilterPopoverProps) {
  // open：弹出框是否打开
  const [open, setOpen] = useState(false)
  // query：搜索查询字符串（用于搜索过滤分类）
  const [query, setQuery] = useState("")
  // active：当前激活的过滤分类（status、priority、tags、members）
  const [active, setActive] = useState<
    "status" | "priority" | "tags" | "members"
  >("status")

  // temp：临时过滤状态（用户选择但未应用的过滤条件）
  const [temp, setTemp] = useState<FilterTemp>(() => ({
    status: new Set<string>(),
    priority: new Set<string>(),
    tags: new Set<string>(),
    members: new Set<string>(),
  }))

  // tagSearch：标签搜索查询字符串（用于搜索标签）
  const [tagSearch, setTagSearch] = useState("")

  // 打开弹出框时，从初始芯片预选过滤条件
  useEffect(() => {
    if (!open) return
    const next: FilterTemp = {
      status: new Set<string>(),
      priority: new Set<string>(),
      tags: new Set<string>(),
      members: new Set<string>(),
    }
    for (const c of initialChips || []) {
      const k = c.key.toLowerCase()
      if (k === "status") next.status.add(c.value.toLowerCase())
      if (k === "priority") next.priority.add(c.value.toLowerCase())
      if (k === "member" || k === "pic" || k === "members") next.members.add(c.value)
      if (k === "tag" || k === "tags") next.tags.add(c.value.toLowerCase())
    }
    setTemp(next)
  }, [open, initialChips])

  // categories：过滤分类列表（状态、优先级、标签、成员）
  const categories = [
    { id: "status", label: "Status", icon: Spinner },
    { id: "priority", label: "Priority", icon: ChartBar },
    { id: "tags", label: "Tags", icon: Tag },
    { id: "members", label: "Members", icon: User },
  ] as const

  // statusOptions：状态选项列表
  const statusOptions = [
    { id: "backlog", label: "待办", color: "#f97316" },
    { id: "planned", label: "已计划", color: "#6b7280" },
    { id: "active", label: "进行中", color: "#22c55e" },
    { id: "cancelled", label: "已取消", color: "#9ca3af" },
    { id: "completed", label: "已完成", color: "#3b82f6" },
  ]

  // priorityOptions：优先级选项列表
  const priorityOptions = [
    { id: "urgent", label: "紧急" },
    { id: "high", label: "高" },
    { id: "medium", label: "中" },
    { id: "low", label: "低" },
  ]

  // memberOptions：成员选项列表
  const memberOptions = [
    { id: "no-member", label: "无成员", avatar: undefined },
    { id: "current", label: "当前成员", avatar: undefined, hint: "1 个项目" },
    { id: "jason", label: "jason duong", avatar: "/placeholder-user.jpg", hint: "3 个项目" },
  ]

  // tagOptions：标签选项列表
  const tagOptions = [
    { id: "frontend", label: "前端" },
    { id: "backend", label: "后端" },
    { id: "bug", label: "错误" },
    { id: "feature", label: "功能" },
    { id: "urgent", label: "紧急" },
  ]

  // filteredCategories：根据搜索查询过滤的分类列表
  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.label.toLowerCase().includes(q))
  }, [categories, query])

  // toggleSet：切换 Set 集合中的元素（添加或删除）
  const toggleSet = (set: Set<string>, v: string) => {
    const n = new Set(set)
    if (n.has(v)) n.delete(v)
    else n.add(v)
    return n
  }

  // handleApply：应用过滤条件的处理函数
  const handleApply = () => {
    const chips: FilterChip[] = []
    temp.status.forEach((v) => chips.push({ key: "Status", value: capitalize(v) }))
    temp.priority.forEach((v) => chips.push({ key: "Priority", value: capitalize(v) }))
    temp.members.forEach((v) => chips.push({ key: "Member", value: v }))
    temp.tags.forEach((v) => chips.push({ key: "Tag", value: v }))
    onApply(chips)
    setOpen(false)
  }

  // handleClear：清除过滤条件的处理函数
  const handleClear = () => {
    setTemp({
      status: new Set<string>(),
      priority: new Set<string>(),
      tags: new Set<string>(),
      members: new Set<string>(),
    })
    onClear()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* 过滤按钮：点击打开弹出框 */}
        <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent">
          <Funnel className="h-4 w-4" />
          过滤
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[720px] p-0 rounded-xl">
        <div className="grid grid-cols-[260px_minmax(0,1fr)]">
          {/* 左侧：分类列表 */}
          <div className="p-3 border-r border-border/40">
            <div className="px-1 pb-2">
              {/* 搜索输入框：用于搜索过滤分类 */}
              <Input placeholder="搜索..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-8" />
            </div>
            <div className="space-y-1">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent",
                    active === cat.id && "bg-accent"
                  )}
                  onClick={() => setActive(cat.id)}
                >
                  <cat.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{cat.label}</span>
                  {/* 显示该分类的总数（如果提供了 counts） */}
                  {counts && counts[cat.id as keyof FilterCounts] && (
                    <span className="text-xs text-muted-foreground">
                      {Object.values(counts[cat.id as keyof FilterCounts] as Record<string, number>).reduce(
                        (a, b) => a + (typeof b === "number" ? b : 0),
                        0,
                      )}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧：过滤选项 */}
          <div className="p-3">
            {/* 优先级过滤选项 */}
            {active === "priority" && (
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    <Checkbox
                      checked={temp.priority.has(opt.id)}
                      onCheckedChange={() => setTemp((t) => ({ ...t, priority: toggleSet(t.priority, opt.id) }))}
                    />
                    <span className="text-sm flex-1">{opt.label}</span>
                    {counts?.priority?.[opt.id] != null && (
                      <span className="text-xs text-muted-foreground">{counts.priority[opt.id]}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {/* 状态过滤选项 */}
            {active === "status" && (
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    {/* 状态颜色指示器 */}
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                    <Checkbox
                      checked={temp.status.has(opt.id)}
                      onCheckedChange={() => setTemp((t) => ({ ...t, status: toggleSet(t.status, opt.id) }))}
                    />
                    <span className="text-sm flex-1">{opt.label}</span>
                    {counts?.status?.[opt.id] != null && (
                      <span className="text-xs text-muted-foreground">{counts.status[opt.id]}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {/* 成员过滤选项 */}
            {active === "members" && (
              <div className="space-y-2">
                {memberOptions.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    <Checkbox
                      checked={temp.members.has(m.label)}
                      onCheckedChange={() => setTemp((t) => ({ ...t, members: toggleSet(t.members, m.label) }))}
                    />
                    <span className="text-sm flex-1">{m.label}</span>
                    {counts?.members?.[m.id] != null ? (
                      <span className="text-xs text-muted-foreground">{counts.members[m.id]}</span>
                    ) : (
                      m.hint && <span className="text-xs text-muted-foreground">{m.hint}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {/* 标签过滤选项 */}
            {active === "tags" && (
              <div>
                <div className="pb-2">
                  {/* 标签搜索输入框 */}
                  <Input
                    placeholder="搜索标签..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tagOptions
                    .filter((t) => t.label.toLowerCase().includes(tagSearch.toLowerCase()))
                    .map((t) => (
                      <label key={t.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={temp.tags.has(t.id)}
                          onCheckedChange={() => setTemp((s) => ({ ...s, tags: toggleSet(s.tags, t.id) }))}
                        />
                        <span className="text-sm flex-1">{t.label}</span>
                        {counts?.tags?.[t.id] != null && (
                          <span className="text-xs text-muted-foreground">{counts.tags[t.id]}</span>
                        )}
                      </label>
                    ))}
                </div>
              </div>
            )}

            {/* 底部操作按钮 */}
            <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
              <button onClick={handleClear} className="text-sm text-primary hover:underline">
                清除
              </button>
              <Button size="sm" className="h-8 rounded-lg" onClick={handleApply}>
                应用
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// capitalize 辅助函数：将字符串首字母大写
function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

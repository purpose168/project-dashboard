"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
  Sliders,
  ListBullets,
  Kanban,
  ChartBar,
  TextIndent,
  CaretUpDown,
  ListDashes,
  Globe,
  Spinner,
  User,
  Tag,
  TextT,
  Calendar,
} from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"

interface ViewOptionsPopoverProps {
  options: {
    viewType: "list" | "board" | "timeline"
    tasks: "indented" | "collapsed" | "flat"
    ordering: "manual" | "alphabetical" | "date"
    showAbsentParent: boolean
    showClosedProjects: boolean
    groupBy: "none" | "status" | "assignee" | "tags"
    properties: string[]
  }
  onChange: (options: typeof options) => void
}

export function ViewOptionsPopover({ options, onChange }: ViewOptionsPopoverProps) {
  const [tasksOpen, setTasksOpen] = useState(false)
  const [orderingOpen, setOrderingOpen] = useState(false)
  const [groupByOpen, setGroupByOpen] = useState(false)

  const viewTypes = [
    { id: "list", label: "List", icon: ListBullets },
    { id: "board", label: "Board", icon: Kanban },
    { id: "timeline", label: "Timeline", icon: ChartBar },
  ] as const

  const taskOptions = [
    { id: "indented", label: "Indented", icon: TextIndent },
    { id: "collapsed", label: "Collapsed", icon: CaretUpDown },
    { id: "flat", label: "Flat", icon: ListDashes },
  ] as const

  const orderingOptions = [
    { id: "manual", label: "Manual" },
    { id: "alphabetical", label: "Alphabetical" },
    { id: "date", label: "Date" },
  ] as const

  const groupByOptions = [
    { id: "none", label: "None", icon: Globe },
    { id: "status", label: "Status", icon: Spinner, count: "4 status" },
    { id: "assignee", label: "Assignee", icon: User, count: "1 active" },
    { id: "tags", label: "Tags", icon: Tag, count: "4 tags" },
  ] as const

  const propertyOptions = [
    { id: "title", label: "Title", icon: TextT },
    { id: "status", label: "Status", icon: Spinner },
    { id: "assignee", label: "Assignee", icon: User },
    { id: "dueDate", label: "Due date", icon: Calendar },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent">
          <Sliders className="h-4 w-4" />
          视图
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 rounded-xl p-0" align="end">
        <div className="p-4">
          {/* View Type Tabs */}
          <div className="flex rounded-xl p-1 bg-muted">
            {viewTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => onChange({ ...options, viewType: type.id })}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg py-2.5 text-xs font-medium transition-colors shadow-none",
                  options.viewType === type.id
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <type.icon className="h-5 w-5" />
                {type.label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {/* 任务下拉框 */}
            <div className="flex items-center justify-between">
              <span className="text-sm">任务</span>
              <Popover open={tasksOpen} onOpenChange={setTasksOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent"
                  >
                    {taskOptions.find((o) => o.id === options.tasks)?.icon && <TextIndent className="h-4 w-4" />}
                    {taskOptions.find((o) => o.id === options.tasks)?.label}
                    <CaretUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 rounded-xl p-1" align="end">
                  {taskOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onChange({ ...options, tasks: option.id })
                        setTasksOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                        options.tasks === option.id && "bg-accent",
                      )}
                    >
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* 排序下拉框 */}
            <div className="flex items-center justify-between">
              <span className="text-sm">排序</span>
              <Popover open={orderingOpen} onOpenChange={setOrderingOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent"
                  >
                    <Sliders className="h-4 w-4" />
                    {orderingOptions.find((o) => o.id === options.ordering)?.label}
                    <CaretUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-36 rounded-xl p-1" align="end">
                  {orderingOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onChange({ ...options, ordering: option.id })
                        setOrderingOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                        options.ordering === option.id && "bg-accent",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* 显示缺失的父项目 */}
            <div className="flex items-center justify-between">
              <span className="text-sm">显示缺失的父项目</span>
              <Switch
                checked={options.showAbsentParent}
                onCheckedChange={(checked) => onChange({ ...options, showAbsentParent: checked })}
              />
            </div>

            {/* 显示已关闭的项目 */}
            <div className="flex items-center justify-between">
              <span className="text-sm">显示已关闭的项目</span>
              <Switch
                checked={options.showClosedProjects}
                onCheckedChange={(checked) => onChange({ ...options, showClosedProjects: checked })}
              />
            </div>

            {/* 分组方式 */}
            <div className="flex items-center justify-between">
              <span className="text-sm">分组方式</span>
              <Popover open={groupByOpen} onOpenChange={setGroupByOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent"
                  >
                    <Globe className="h-4 w-4" />
                    {groupByOptions.find((o) => o.id === options.groupBy)?.label}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-44 rounded-xl p-1" align="end">
                  {groupByOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onChange({ ...options, groupBy: option.id })
                        setGroupByOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                        options.groupBy === option.id && "bg-accent",
                      )}
                    >
                      <option.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{option.label}</span>
                      {option.count && <span className="text-xs text-muted-foreground">{option.count}</span>}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* 属性 */}
            <div className="pt-2">
              <span className="text-sm font-medium">属性</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {propertyOptions.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => {
                      const newProps = options.properties.includes(prop.id)
                        ? options.properties.filter((p) => p !== prop.id)
                        : [...options.properties, prop.id]
                      onChange({ ...options, properties: newProps })
                    }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors",
                      options.properties.includes(prop.id)
                        ? "border-border bg-background"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    <prop.icon className="h-3.5 w-3.5" />
                    {prop.label}
                  </button>
                ))}
                <button className="flex items-center justify-center rounded-md border border-dashed border-border/60 px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent">
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Globe className="h-4 w-4" />
                设置默认
              </button>
              <span className="text-sm text-muted-foreground">为所有人</span>
            </div>
            <button className="text-sm text-primary hover:underline">重置</button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

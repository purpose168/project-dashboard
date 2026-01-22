"use client"

// 导入按钮组件
import { Button } from "@/components/ui/button"
// 导入侧边栏触发器组件
import { SidebarTrigger } from "@/components/ui/sidebar"
// 导入过滤芯片组件
import { FilterChip } from "@/components/filter-chip"
// 导入视图选项弹出框组件
import { ViewOptionsPopover } from "@/components/view-options-popover"
// 导入过滤弹出框组件
import { FilterPopover } from "@/components/filter-popover"
// 导入芯片溢出组件
import { ChipOverflow } from "@/components/chip-overflow"
// 导入图标组件（来自 Phosphor Icons 库）
import { Link as LinkIcon, Plus, Sparkle } from "@phosphor-icons/react/dist/ssr"
// 导入过滤计数类型
import type { FilterCounts } from "@/lib/data/projects"
// 导入过滤芯片和视图选项类型
import type { FilterChip as FilterChipType, ViewOptions } from "@/lib/view-options"

// ProjectHeaderProps 接口定义：项目头部组件的属性
interface ProjectHeaderProps {
  filters: FilterChipType[] // 过滤芯片列表
  onRemoveFilter: (key: string, value: string) => void // 移除过滤芯片的回调函数
  onFiltersChange: (chips: FilterChipType[]) => void // 过滤芯片变化的回调函数
  counts?: FilterCounts // 过滤项数量
  viewOptions: ViewOptions // 视图选项
  onViewOptionsChange: (options: ViewOptions) => void // 视图选项变化的回调函数
}

// ProjectHeader 组件：项目头部组件
// 用于显示项目页面的头部，包含侧边栏触发器、标题、添加项目按钮、过滤功能、视图选项和 AI 助手
export function ProjectHeader({ filters, onRemoveFilter, onFiltersChange, counts, viewOptions, onViewOptionsChange }: ProjectHeaderProps) {
  return (
    <header className="flex flex-col border-b border-border/40">
      {/* 第一行：侧边栏触发器、标题、链接按钮和添加项目按钮 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        {/* 左侧：侧边栏触发器和标题 */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-accent text-muted-foreground" /> {/* 侧边栏触发器按钮 */}
          <p className="text-base font-medium text-foreground">项目</p> {/* 项目标题 */}
        </div>
        {/* 右侧：链接按钮和添加项目按钮 */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <LinkIcon className="h-4 w-4" /> {/* 链接图标 */}
          </Button>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" weight="bold" /> {/* 加号图标 */}
            添加项目 {/* 添加项目文本 */}
          </Button>
        </div>
      </div>

      {/* 第二行：过滤功能、视图选项和 AI 助手 */}
      <div className="flex items-center justify-between px-4 pb-3 pt-3">
        {/* 左侧：过滤弹出框和过滤芯片溢出 */}
        <div className="flex items-center gap-2">
          <FilterPopover
            initialChips={filters} // 初始过滤芯片列表
            onApply={onFiltersChange} // 应用过滤的回调函数
            onClear={() => onFiltersChange([])} // 清除过滤的回调函数
            counts={counts} // 过滤项数量
          />
          <ChipOverflow chips={filters} onRemove={onRemoveFilter} maxVisible={6} /> {/* 过滤芯片溢出组件，最多显示 6 个 */}
        </div>
        {/* 右侧：视图选项和 AI 助手按钮 */}
        <div className="flex items-center gap-2">
          <ViewOptionsPopover options={viewOptions} onChange={onViewOptionsChange} /> {/* 视图选项弹出框 */}
          {/* AI 助手按钮：带有特殊的渐变背景和阴影效果 */}
          <div className="relative">
            <div
              className="relative rounded-xl border border-blue-900 shadow-[inset_0_11px_19.3px_0_rgba(0,0,0,0.25)] overflow-hidden"
              style={{
                // 使用 conic-gradient 创建渐变背景
                background: 'conic-gradient(from 0deg at 50% 50%, #FFFFFF 80%, #FFFFFF 0%)',
              }}
            >
              <Button className="h-8 gap-2 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 text-white hover:from-blue-800 hover:to-blue-600 relative z-10">
                <Sparkle className="h-4 w-4" weight="fill" /> {/* 闪光图标 */}
                询问 AI {/* AI 助手文本 */}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

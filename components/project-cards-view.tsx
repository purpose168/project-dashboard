"use client"

// 导入 Project 类型定义
import type { Project } from "@/lib/data/projects"
// 导入项目卡片组件
import { ProjectCard } from "@/components/project-card"
// 导入图标组件（来自 Phosphor Icons 库）
import { Plus, FolderOpen } from "@phosphor-icons/react/dist/ssr"
// 导入骨架屏组件
import { Skeleton } from "@/components/ui/skeleton"

// ProjectCardsViewProps 类型定义：项目卡片视图组件的属性
type ProjectCardsViewProps = {
  projects: Project[] // 项目列表
  loading?: boolean // 是否正在加载，默认为 false
}

// ProjectCardsView 组件：项目卡片视图组件
// 用于以卡片网格形式显示项目列表，支持加载状态、空状态等
// 响应式布局，根据屏幕宽度自动调整列数
export function ProjectCardsView({ projects, loading = false }: ProjectCardsViewProps) {
  // isEmpty：是否为空状态（不在加载中且没有项目）
  const isEmpty = !loading && projects.length === 0

  return (
    <div className="p-4">
      {/* 加载状态：显示骨架屏 */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* 显示 8 个骨架屏卡片 */}
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : isEmpty ? (
        // 空状态：没有项目时显示提示
        <div className="flex h-60 flex-col items-center justify-center text-center">
          {/* 文件夹图标容器 */}
          <div className="p-3 bg-muted rounded-md mb-4">
            <FolderOpen className="h-6 w-6 text-foreground" /> {/* 打开的文件夹图标 */}
          </div>
          {/* 标题 */}
          <h3 className="mb-2 text-lg font-semibold text-foreground">暂无项目</h3>
          {/* 描述文本 */}
          <p className="mb-6 text-sm text-muted-foreground">创建您的第一个项目以开始使用</p>
          {/* 创建新项目按钮 */}
          <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-accent transition-colors cursor-pointer">
            <Plus className="mr-2 inline h-4 w-4" /> {/* 加号图标 */}
            创建新项目
          </button>
        </div>
      ) : (
        // 主渲染：显示项目卡片网格和创建新项目按钮
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* 渲染所有项目卡片 */}
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
          {/* 创建新项目按钮 */}
          <button className="rounded-2xl border border-dashed border-border/60 bg-background p-6 text-center text-sm text-muted-foreground hover:border-solid hover:border-border/80 hover:text-foreground transition-colors min-h-[180px] flex flex-col items-center justify-center cursor-pointer">
            <Plus className="mb-2 h-5 w-5" /> {/* 加号图标 */}
            创建新项目
          </button>
        </div>
      )}
    </div>
  )
}

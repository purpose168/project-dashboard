// NavItemId 类型：导航项 ID 类型定义
export type NavItemId = "inbox" | "my-tasks" | "projects" | "clients" | "performance"

// SidebarFooterItemId 类型：侧边栏底部项 ID 类型定义
export type SidebarFooterItemId = "settings" | "templates" | "help"

// NavItem 类型：导航项类型定义
export type NavItem = {
    id: NavItemId // 导航项 ID
    label: string // 导航项标签文本
    badge?: number // 徽章数字（可选，用于显示未读数量等）
    isActive?: boolean // 是否处于激活状态（可选）
}

// ActiveProjectSummary 类型：活跃项目摘要类型定义
export type ActiveProjectSummary = {
    id: string // 项目 ID
    name: string // 项目名称
    color: string // 项目颜色（用于显示项目标识）
    progress: number // 项目进度（0-100）
}

// SidebarFooterItem 类型：侧边栏底部项类型定义
export type SidebarFooterItem = {
    id: SidebarFooterItemId // 侧边栏底部项 ID
    label: string // 侧边栏底部项标签文本
}

// navItems 数组：导航项数据列表
export const navItems: NavItem[] = [
    { id: "inbox", label: "收件箱", badge: 24 }, // 收件箱，显示 24 条未读消息
    { id: "my-tasks", label: "我的任务" }, // 我的任务
    { id: "projects", label: "项目", isActive: true }, // 项目，当前激活
    { id: "clients", label: "客户" }, // 客户
    { id: "performance", label: "性能" }, // 性能
]

// activeProjects 数组：活跃项目摘要数据列表
export const activeProjects: ActiveProjectSummary[] = [
    { id: "ai-learning", name: "AI 学习平台", color: "#EF4444", progress: 25 }, // AI 学习平台，红色，进度 25%
    { id: "fintech-app", name: "金融科技移动应用", color: "#F97316", progress: 80 }, // 金融科技移动应用，橙色，进度 80%
    { id: "ecommerce-admin", name: "电子商务管理后台", color: "#22C55E", progress: 65 }, // 电子商务管理后台，绿色，进度 65%
    { id: "healthcare-app", name: "医疗预约应用", color: "#94A3B8", progress: 10 }, // 医疗预约应用，灰色，进度 10%
]

// footerItems 数组：侧边栏底部项数据列表
export const footerItems: SidebarFooterItem[] = [
    { id: "settings", label: "设置" }, // 设置
    { id: "templates", label: "模板" }, // 模板
    { id: "help", label: "帮助" }, // 帮助
]

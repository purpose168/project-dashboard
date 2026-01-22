"use client"

// 导入侧边栏相关的 UI 组件
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
// 导入输入框组件
import { Input } from "@/components/ui/input"
// 导入头像组件
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// 导入进度圆环组件
import { ProgressCircle } from "@/components/progress-circle"
// 导入图标组件（来自 Phosphor Icons 库）
import {
  MagnifyingGlass, // 搜索图标
  Tray, // 收件箱图标
  CheckSquare, // 任务图标
  Folder, // 文件夹图标
  Users, // 用户图标
  ChartBar, // 图表图标
  Gear, // 设置图标
  Layout, // 布局图标
  Question, // 帮助图标
  CaretRight, // 右箭头图标
  CaretUpDown, // 上下箭头图标
} from "@phosphor-icons/react/dist/ssr"
// 导入侧边栏数据（导航项、活跃项目、底部菜单项）
import { activeProjects, footerItems, navItems, type NavItemId, type SidebarFooterItemId } from "@/lib/data/sidebar"

// 导航项图标映射：将导航项 ID 映射到对应的图标组件
const navItemIcons: Record<NavItemId, React.ComponentType<{ className?: string }>> = {
  inbox: Tray, // 收件箱
  "my-tasks": CheckSquare, // 我的任务
  projects: Folder, // 项目
  clients: Users, // 客户
  performance: ChartBar, // 性能
}

// 底部菜单项图标映射：将底部菜单项 ID 映射到对应的图标组件
const footerItemIcons: Record<SidebarFooterItemId, React.ComponentType<{ className?: string }>> = {
  settings: Gear, // 设置
  templates: Layout, // 模板
  help: Question, // 帮助
}

// AppSidebar 组件：应用侧边栏主组件
// 包含 Logo、搜索框、导航菜单、活跃项目列表、底部菜单和用户信息
export function AppSidebar() {
  return (
    <Sidebar className="border-border/40 border-r-0 shadow-none border-none">
      {/* 侧边栏头部：包含 Logo、工作区名称和切换按钮 */}
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo 图标 */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-800 text-primary-foreground shadow-[inset_0_-5px_6.6px_0_rgba(0,0,0,0.25)]">
              <img src="/logo-wrapper.png" alt="Logo" className="h-4 w-4" />
            </div>
            {/* 工作区名称和计划信息 */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold">工作区</span>
              <span className="text-xs text-muted-foreground">专业计划</span>
            </div>
          </div>
          {/* 切换工作区按钮 */}
          <button className="rounded-md p-1 hover:bg-accent">
            <CaretUpDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </SidebarHeader>

      {/* 侧边栏内容区域 */}
      <SidebarContent className="px-0 gap-0">
        {/* 搜索框分组 */}
        <SidebarGroup>
          <div className="relative px-0 py-0">
            {/* 搜索图标 */}
            <MagnifyingGlass className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            {/* 搜索输入框 */}
            <Input
              placeholder="搜索"
              className="h-9 rounded-lg bg-muted/50 pl-8 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/20 border-border border shadow-none"
            />
            {/* 快捷键提示 */}
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </SidebarGroup>

        {/* 导航菜单分组 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  {(() => {
                    const Icon = navItemIcons[item.id]
                    return null
                  })()}
                  {/* 导航菜单按钮 */}
                  <SidebarMenuButton
                    isActive={item.isActive}
                    className="h-9 rounded-lg px-3 font-normal text-muted-foreground"
                  >
                    {(() => {
                      const Icon = navItemIcons[item.id]
                      return Icon ? <Icon className="h-[18px] w-[18px]" /> : null
                    })()}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {/* 徽章（如果有） */}
                  {item.badge && (
                    <SidebarMenuBadge className="bg-muted text-muted-foreground rounded-full px-2">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 活跃项目分组 */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground">
            活跃项目
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeProjects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  {/* 项目菜单按钮 */}
                  <SidebarMenuButton className="h-9 rounded-lg px-3 group">
                    {/* 进度圆环 */}
                    <ProgressCircle progress={project.progress} color={project.color} size={18} />
                    {/* 项目名称 */}
                    <span className="flex-1 truncate text-sm">{project.name}</span>
                    {/* 更多选项按钮（悬停时显示） */}
                    <span className="opacity-0 group-hover:opacity-100 rounded p-0.5 hover:bg-accent">
                      <span className="text-muted-foreground text-lg">···</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 侧边栏底部：包含底部菜单和用户信息 */}
      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              {/* 底部菜单按钮 */}
              <SidebarMenuButton className="h-9 rounded-lg px-3 text-muted-foreground">
                {(() => {
                  const Icon = footerItemIcons[item.id]
                  return Icon ? <Icon className="h-[18px] w-[18px]" /> : null
                })()}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* 用户信息区域 */}
        <div className="mt-2 flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer">
          {/* 用户头像 */}
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar-profile.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {/* 用户名称和邮箱 */}
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium">Jason D</span>
            <span className="text-xs text-muted-foreground">jason.duong@mail.com</span>
          </div>
          {/* 右箭头图标 */}
          <CaretRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

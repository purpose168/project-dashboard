'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import { PanelLeftIcon } from 'lucide-react'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// 侧边栏状态 Cookie 名称：用于在浏览器中存储侧边栏的展开/折叠状态
const SIDEBAR_COOKIE_NAME = 'sidebar_state'
// 侧边栏状态 Cookie 最大存活时间：7天（60秒 × 60分钟 × 24小时 × 7天）
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
// 侧边栏展开时的宽度：16rem（256px）
const SIDEBAR_WIDTH = '16rem'
// 移动端侧边栏宽度：18rem（288px）
const SIDEBAR_WIDTH_MOBILE = '18rem'
// 侧边栏折叠为图标模式时的宽度：3rem（48px）
const SIDEBAR_WIDTH_ICON = '3rem'
// 侧边栏切换的键盘快捷键：按 Ctrl/Cmd + B 可以切换侧边栏的展开/折叠状态
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

// 侧边栏上下文属性类型定义：定义侧边栏上下文提供的所有属性和方法
type SidebarContextProps = {
  state: 'expanded' | 'collapsed' // 侧边栏状态：expanded（展开）或 collapsed（折叠）
  open: boolean // 侧边栏是否打开（桌面端）
  setOpen: (open: boolean) => void // 设置侧边栏打开状态的方法
  openMobile: boolean // 移动端侧边栏是否打开
  setOpenMobile: (open: boolean) => void // 设置移动端侧边栏打开状态的方法
  isMobile: boolean // 是否为移动端设备
  toggleSidebar: () => void // 切换侧边栏展开/折叠状态的方法
}

// 侧边栏上下文：使用 React Context API 创建侧边栏的全局状态管理
// 允许所有子组件访问侧边栏的状态和方法
const SidebarContext = React.createContext<SidebarContextProps | null>(null)

// useSidebar Hook：用于在子组件中访问侧边栏上下文
// 如果在 SidebarProvider 外部使用，会抛出错误
function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar 必须在 SidebarProvider 内部使用。')
  }

  return context
}

// SidebarProvider 组件：侧边栏提供者组件
// 使用 React Context API 为所有子组件提供侧边栏的状态和方法
// 支持受控和非受控模式，以及键盘快捷键切换
function SidebarProvider({
  defaultOpen = true, // 默认打开状态（非受控模式）
  open: openProp, // 外部控制的打开状态（受控模式）
  onOpenChange: setOpenProp, // 外部控制的打开状态变化回调（受控模式）
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile() // 检测是否为移动端设备
  const [openMobile, setOpenMobile] = React.useState(false) // 移动端侧边栏打开状态

  // 这是侧边栏的内部状态。
  // 我们使用 openProp 和 setOpenProp 来从外部组件进行控制。
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // 这会设置 Cookie 以保持侧边栏状态。
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  // 辅助函数：切换侧边栏的展开/折叠状态
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // 添加键盘快捷键来切换侧边栏
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // 我们添加一个状态，以便我们可以使用 data-state="expanded" 或 "collapsed"。
  // 这使得使用 Tailwind 类名来设置侧边栏样式变得更容易。
  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

// Sidebar 组件：侧边栏主容器组件
// 支持多种布局模式：sidebar（侧边栏）、floating（浮动）、inset（内嵌）
// 支持多种折叠模式：offcanvas（画布外）、icon（图标）、none（不折叠）
// 在移动端自动转换为 Sheet（抽屉）组件
function Sidebar({
  side = 'left', // 侧边栏位置：'left'（左侧）或 'right'（右侧），默认为 'left'
  variant = 'sidebar', // 侧边栏变体：'sidebar'（侧边栏）、'floating'（浮动）、'inset'（内嵌），默认为 'sidebar'
  collapsible = 'offcanvas', // 折叠模式：'offcanvas'（画布外）、'icon'（图标）、'none'（不折叠），默认为 'offcanvas'
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  // 如果折叠模式为 'none'，则侧边栏始终显示，不支持折叠
  if (collapsible === 'none') {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          'bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  // 如果是移动端，则使用 Sheet 组件（抽屉式侧边栏）
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>侧边栏</SheetTitle>
            <SheetDescription>显示移动端侧边栏。</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // 桌面端侧边栏：支持折叠和多种变体
  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* 这是处理桌面端侧边栏间距的元素 */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // 调整浮动和内嵌变体的内边距。
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// SidebarTrigger 组件：侧边栏触发器按钮
// 点击按钮可以切换侧边栏的展开/折叠状态
// 显示一个面板图标（PanelLeftIcon）
function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn('size-7', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">切换侧边栏</span>
    </Button>
  )
}

// SidebarRail 组件：侧边栏轨道/手柄
// 位于侧边栏边缘的可点击区域，用于切换侧边栏的展开/折叠状态
// 提供鼠标悬停效果和光标变化
function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="切换侧边栏"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="切换侧边栏"
      className={cn(
        'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  )
}

// SidebarInset 组件：侧边栏内容区域
// 主内容区域，位于侧边栏旁边
// 根据侧边栏状态和变体自动调整样式
function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'bg-background relative flex w-full flex-1 flex-col min-w-0',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className,
      )}
      {...props}
    />
  )
}

// SidebarInput 组件：侧边栏输入框
// 用于在侧边栏中显示输入框（如搜索框）
// 使用 Input 组件并添加侧边栏特定的样式
function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn('bg-background h-8 w-full shadow-none', className)}
      {...props}
    />
  )
}

// SidebarHeader 组件：侧边栏头部
// 侧边栏的顶部区域，通常包含标题、Logo 或其他导航元素
function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

// SidebarFooter 组件：侧边栏底部
// 侧边栏的底部区域，通常包含用户信息、设置或其他辅助功能
function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

// SidebarSeparator 组件：侧边栏分隔线
// 用于在侧边栏中创建视觉分隔，提高内容的可读性
function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn('bg-sidebar-border mx-2 w-auto', className)}
      {...props}
    />
  )
}

// SidebarContent 组件：侧边栏内容区域
// 侧边栏的主要内容区域，包含可滚动的菜单项
// 支持折叠模式下的内容隐藏
function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  )
}

// SidebarGroup 组件：侧边栏分组
// 用于将相关的菜单项分组显示
function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  )
}

// SidebarGroupLabel 组件：侧边栏分组标签
// 分组的标题或标签，用于描述分组内容
// 支持折叠模式下隐藏标签
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className,
      )}
      {...props}
    />
  )
}

// SidebarGroupAction 组件：侧边栏分组操作按钮
// 分组右上角的操作按钮（如展开/折叠、更多选项等）
// 支持折叠模式下隐藏按钮
function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // 增加移动端按钮的点击区域。
        'after:absolute after:-inset-2 md:after:hidden',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
}

// SidebarGroupContent 组件：侧边栏分组内容
// 分组的内容区域，包含菜单项或其他内容
function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn('w-full text-sm', className)}
      {...props}
    />
  )
}

// SidebarMenu 组件：侧边栏菜单
// 用于创建侧边栏菜单列表，包含多个菜单项
function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  )
}

// SidebarMenuItem 组件：侧边栏菜单项
// 单个菜单项，可以包含按钮、子菜单等
function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  )
}

// 侧边栏菜单按钮变体：使用 CVA 库定义菜单按钮的样式变体
// 支持不同的变体（variant）和尺寸（size）
const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

// SidebarMenuButton 组件：侧边栏菜单按钮
// 菜单项的主按钮，支持图标、文本、徽章等
// 支持工具提示（tooltip）功能
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : 'button'
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  // 如果没有工具提示，直接返回按钮
  if (!tooltip) {
    return button
  }

  // 如果工具提示是字符串，转换为对象格式
  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    }
  }

  // 返回带工具提示的按钮（仅在折叠状态且非移动端时显示）
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

// SidebarMenuAction 组件：侧边栏菜单操作按钮
// 菜单项右侧的操作按钮（如展开/折叠、更多选项等）
// 支持悬停显示功能
function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  showOnHover?: boolean
}) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // 增加移动端按钮的点击区域。
        'after:absolute after:-inset-2 md:after:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
        className,
      )}
      {...props}
    />
  )
}

// SidebarMenuBadge 组件：侧边栏菜单徽章
// 菜单项右侧的徽章，用于显示通知数量、状态等
function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
        'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
}

// SidebarMenuSkeleton 组件：侧边栏菜单骨架屏
// 用于在加载时显示占位符，提升用户体验
// 支持显示图标和随机宽度的文本骨架
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean
}) {
  // 随机宽度在 50% 到 90% 之间。
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

// SidebarMenuSub 组件：侧边栏子菜单
// 用于创建嵌套的子菜单列表
function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
}

// SidebarMenuSubItem 组件：侧边栏子菜单项
// 单个子菜单项
function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    />
  )
}

// SidebarMenuSubButton 组件：侧边栏子菜单按钮
// 子菜单项的按钮，支持不同的尺寸和激活状态
function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
  size?: 'sm' | 'md'
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
}

// 导出所有侧边栏相关组件和 Hook
export {
  Sidebar, // 侧边栏主容器组件
  SidebarContent, // 侧边栏内容区域
  SidebarFooter, // 侧边栏底部
  SidebarGroup, // 侧边栏分组
  SidebarGroupAction, // 侧边栏分组操作按钮
  SidebarGroupContent, // 侧边栏分组内容
  SidebarGroupLabel, // 侧边栏分组标签
  SidebarHeader, // 侧边栏头部
  SidebarInput, // 侧边栏输入框
  SidebarInset, // 侧边栏内容区域（主内容）
  SidebarMenu, // 侧边栏菜单
  SidebarMenuAction, // 侧边栏菜单操作按钮
  SidebarMenuBadge, // 侧边栏菜单徽章
  SidebarMenuButton, // 侧边栏菜单按钮
  SidebarMenuItem, // 侧边栏菜单项
  SidebarMenuSkeleton, // 侧边栏菜单骨架屏
  SidebarMenuSub, // 侧边栏子菜单
  SidebarMenuSubButton, // 侧边栏子菜单按钮
  SidebarMenuSubItem, // 侧边栏子菜单项
  SidebarProvider, // 侧边栏提供者组件
  SidebarRail, // 侧边栏轨道/手柄
  SidebarSeparator, // 侧边栏分隔线
  SidebarTrigger, // 侧边栏触发器按钮
  useSidebar, // useSidebar Hook
}

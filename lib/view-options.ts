// ViewType 类型：视图类型定义
export type ViewType = "list" | "board" | "timeline" // 列表视图、看板视图、时间轴视图

// TaskViewMode 类型：任务视图模式定义
export type TaskViewMode = "indented" | "collapsed" | "flat" // 缩进显示、折叠显示、平铺显示

// Ordering 类型：排序方式定义
export type Ordering = "manual" | "alphabetical" | "date" // 手动排序、字母顺序排序、日期排序

// GroupBy 类型：分组方式定义
export type GroupBy = "none" | "status" | "assignee" | "tags" // 不分组、按状态分组、按负责人分组、按标签分组

// ViewOptions 类型：视图选项类型定义
export type ViewOptions = {
    viewType: ViewType // 视图类型
    tasks: TaskViewMode // 任务视图模式
    ordering: Ordering // 排序方式
    showAbsentParent: boolean // 是否显示缺失的父项目
    showClosedProjects: boolean // 是否显示已关闭的项目
    groupBy: GroupBy // 分组方式
    properties: string[] // 显示的属性列表
}

// FilterChip 类型：过滤芯片类型定义
export type FilterChip = {
    key: string // 过滤键名（如 Status、Priority、Tag、Member）
    value: string // 过滤值
}

// DEFAULT_VIEW_OPTIONS 常量：默认视图选项配置
export const DEFAULT_VIEW_OPTIONS: ViewOptions = {
    viewType: "list", // 默认视图类型：列表视图
    tasks: "indented", // 默认任务视图模式：缩进显示
    ordering: "manual", // 默认排序方式：手动排序
    showAbsentParent: false, // 默认不显示缺失的父项目
    showClosedProjects: true, // 默认显示已关闭的项目
    groupBy: "none", // 默认分组方式：不分组
    properties: ["title", "status", "assignee", "dueDate"], // 默认显示的属性：标题、状态、负责人、截止日期
}

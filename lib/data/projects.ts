// Project 类型：项目类型定义
export type Project = {
  id: string // 项目 ID
  name: string // 项目名称
  taskCount: number // 任务数量
  progress: number // 进度百分比（0-100）
  startDate: Date // 开始日期
  endDate: Date // 结束日期
  status: "backlog" | "planned" | "active" | "cancelled" | "completed" // 项目状态：待办、计划中、进行中、已取消、已完成
  priority: "urgent" | "high" | "medium" | "low" // 优先级：紧急、高、中、低
  tags: string[] // 标签列表
  members: string[] // 成员列表
  // 可选的副标题字段，用于卡片/列表视图
  client?: string // 客户名称
  typeLabel?: string // 类型标签
  durationLabel?: string // 持续时间标签
  tasks: Array<{ // 任务列表
    id: string // 任务 ID
    name: string // 任务名称
    assignee: string // 负责人
    status: "todo" | "in-progress" | "done" // 任务状态：待办、进行中、已完成
    startDate: Date // 开始日期
    endDate: Date // 结束日期
  }>
}

// 固定参考日期，使演示时间轴随时间保持稳定
// 如果您想在新日期周围"重新快照"项目，请调整此值
const _today = new Date(2024, 0, 23) // 2024年1月23日
const _base = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate() - 7) // 基准日期：今天的前7天
const _d = (offsetDays: number) => new Date(_base.getFullYear(), _base.getMonth(), _base.getDate() + offsetDays) // 根据偏移天数计算日期的辅助函数

// projects 数组：项目数据列表
export const projects: Project[] = [
  {
    id: "1",
    name: "Fintech Mobile App Redesign", // 金融科技移动应用重新设计
    taskCount: 4,
    progress: 35,
    startDate: _d(3),
    endDate: _d(27),
    status: "active",
    priority: "high",
    tags: ["frontend", "feature"],
    members: ["jason duong"],
    client: "Acme Bank",
    typeLabel: "MVP",
    durationLabel: "2 weeks",
    tasks: [
      {
        id: "1-1",
        name: "Discovery & IA", // 发现与信息架构
        assignee: "JD",
        status: "done",
        startDate: _d(3),
        endDate: _d(10),
      },
      {
        id: "1-2",
        name: "Wireframe layout", // 线框布局
        assignee: "JD",
        status: "in-progress",
        startDate: _d(7),
        endDate: _d(12),
      },
      {
        id: "1-3",
        name: "UI kit & visual design", // UI 组件库和视觉设计
        assignee: "HP",
        status: "todo",
        startDate: _d(13),
        endDate: _d(19),
      },
      {
        id: "1-4",
        name: "Prototype & handoff", // 原型和交接
        assignee: "HP",
        status: "todo",
        startDate: _d(20),
        endDate: _d(27),
      },
    ],
  },
  {
    id: "2",
    name: "Internal PM System", // 内部项目管理系统
    taskCount: 6,
    progress: 20,
    startDate: _d(3),
    endDate: _d(24),
    status: "active",
    priority: "medium",
    tags: ["backend"],
    members: ["jason duong"],
    client: "Acme Corp Internal",
    typeLabel: "Improvement",
    durationLabel: "2 weeks",
    tasks: [
      {
        id: "2-1",
        name: "Define MVP scope", // 定义 MVP 范围
        assignee: "PM",
        status: "done",
        startDate: _d(3),
        endDate: _d(5),
      },
      {
        id: "2-2",
        name: "Database schema", // 数据库架构
        assignee: "BE",
        status: "in-progress",
        startDate: _d(6),
        endDate: _d(10),
      },
      {
        id: "2-3",
        name: "API endpoints", // API 端点
        assignee: "BE",
        status: "todo",
        startDate: _d(11),
        endDate: _d(15),
      },
      {
        id: "2-4",
        name: "Roles & permissions", // 角色和权限
        assignee: "BE",
        status: "todo",
        startDate: _d(16),
        endDate: _d(18),
      },
      {
        id: "2-5",
        name: "UI implementation", // UI 实现
        assignee: "FE",
        status: "todo",
        startDate: _d(19),
        endDate: _d(21),
      },
      {
        id: "2-6",
        name: "QA & rollout", // 质量保证和发布
        assignee: "QA",
        status: "todo",
        startDate: _d(22),
        endDate: _d(24),
      },
    ],
  },
  {
    id: "3",
    name: "AI Learning Platform", // AI 学习平台
    taskCount: 3,
    progress: 40,
    startDate: _d(14),
    endDate: _d(28),
    status: "active",
    priority: "urgent",
    tags: ["feature", "urgent"],
    members: ["jason duong"],
    client: "Acme Learning",
    typeLabel: "Revamp",
    durationLabel: "3 weeks",
    tasks: [
      {
        id: "3-1",
        name: "Course outline", // 课程大纲
        assignee: "JD",
        status: "done",
        startDate: _d(14),
        endDate: _d(16),
      },
      {
        id: "3-2",
        name: "Lesson player UI", // 课程播放器 UI
        assignee: "HP",
        status: "in-progress",
        startDate: _d(17),
        endDate: _d(23),
      },
      {
        id: "3-3",
        name: "Payment integration", // 支付集成
        assignee: "BE",
        status: "todo",
        startDate: _d(24),
        endDate: _d(28),
      },
    ],
  },
  {
    id: "4",
    name: "Internal CRM System", // 内部客户关系管理系统
    taskCount: 4,
    progress: 0,
    startDate: _d(18),
    endDate: _d(35),
    status: "backlog",
    priority: "low",
    tags: ["bug"],
    members: [],
    client: "Acme Corp Internal",
    typeLabel: "New",
    durationLabel: "—",
    tasks: [
      {
        id: "4-1",
        name: "Requirements gathering", // 需求收集
        assignee: "PM",
        status: "todo",
        startDate: _d(18),
        endDate: _d(21),
      },
      {
        id: "4-2",
        name: "Data model", // 数据模型
        assignee: "BE",
        status: "todo",
        startDate: _d(22),
        endDate: _d(25),
      },
      {
        id: "4-3",
        name: "Core screens", // 核心界面
        assignee: "FE",
        status: "todo",
        startDate: _d(26),
        endDate: _d(31),
      },
      {
        id: "4-4",
        name: "QA & UAT", // 质量保证和用户验收测试
        assignee: "QA",
        status: "todo",
        startDate: _d(32),
        endDate: _d(35),
      },
    ],
  },
  {
    id: "5",
    name: "Ecommerce website", // 电子商务网站
    taskCount: 5,
    progress: 100,
    startDate: _d(-7),
    endDate: _d(0),
    status: "completed",
    priority: "medium",
    tags: ["frontend"],
    members: ["jason duong"],
    client: "Acme Retail",
    typeLabel: "Audit",
    durationLabel: "1 week",
    tasks: [
      {
        id: "5-1",
        name: "IA & sitemap", // 信息架构和站点地图
        assignee: "JD",
        status: "done",
        startDate: _d(-7),
        endDate: _d(-5),
      },
      {
        id: "5-2",
        name: "Product listing UI", // 产品列表 UI
        assignee: "HP",
        status: "done",
        startDate: _d(-5),
        endDate: _d(-3),
      },
      {
        id: "5-3",
        name: "Cart & checkout flow", // 购物车和结账流程
        assignee: "HP",
        status: "done",
        startDate: _d(-3),
        endDate: _d(-1),
      },
      {
        id: "5-4",
        name: "Payment gateway", // 支付网关
        assignee: "BE",
        status: "done",
        startDate: _d(-1),
        endDate: _d(0),
      },
      {
        id: "5-5",
        name: "Launch checklist", // 发布检查清单
        assignee: "QA",
        status: "done",
        startDate: _d(-2),
        endDate: _d(0),
      },
    ],
  },
  {
    id: "6",
    name: "Marketing Site Refresh", // 营销网站更新
    taskCount: 3,
    progress: 10,
    startDate: _d(5),
    endDate: _d(18),
    status: "planned",
    priority: "medium",
    tags: ["frontend", "feature"],
    members: ["jason duong"],
    client: "Acme Marketing",
    typeLabel: "Phase 1",
    durationLabel: "2 weeks",
    tasks: [
      {
        id: "6-1",
        name: "Landing page layout", // 落地页布局
        assignee: "JD",
        status: "todo",
        startDate: _d(5),
        endDate: _d(9),
      },
      {
        id: "6-2",
        name: "Hero illustrations", // 主视觉插图
        assignee: "HP",
        status: "todo",
        startDate: _d(10),
        endDate: _d(14),
      },
      {
        id: "6-3",
        name: "Content QA", // 内容质量保证
        assignee: "QA",
        status: "todo",
        startDate: _d(15),
        endDate: _d(18),
      },
    ],
  },
  {
    id: "7",
    name: "Design System Cleanup", // 设计系统清理
    taskCount: 4,
    progress: 0,
    startDate: _d(8),
    endDate: _d(20),
    status: "planned",
    priority: "low",
    tags: ["backend"],
    members: ["jason duong"],
    client: "Acme Corp Internal",
    typeLabel: "Refactor",
    durationLabel: "1 week",
    tasks: [
      {
        id: "7-1",
        name: "Token audit", // 令牌审计
        assignee: "JD",
        status: "todo",
        startDate: _d(8),
        endDate: _d(10),
      },
      {
        id: "7-2",
        name: "Component inventory", // 组件清单
        assignee: "JD",
        status: "todo",
        startDate: _d(11),
        endDate: _d(13),
      },
      {
        id: "7-3",
        name: "Deprecation plan", // 弃用计划
        assignee: "PM",
        status: "todo",
        startDate: _d(14),
        endDate: _d(17),
      },
      {
        id: "7-4",
        name: "Docs update", // 文档更新
        assignee: "JD",
        status: "todo",
        startDate: _d(18),
        endDate: _d(20),
      },
    ],
  },
  {
    id: "8",
    name: "Onboarding Flow A/B Test", // 入门流程 A/B 测试
    taskCount: 3,
    progress: 100,
    startDate: _d(-10),
    endDate: _d(-3),
    status: "completed",
    priority: "high",
    tags: ["feature", "urgent"],
    members: ["jason duong"],
    client: "Acme SaaS",
    typeLabel: "Experiment",
    durationLabel: "1 week",
    tasks: [
      {
        id: "8-1",
        name: "Hypothesis & metrics", // 假设和指标
        assignee: "PM",
        status: "done",
        startDate: _d(-10),
        endDate: _d(-8),
      },
      {
        id: "8-2",
        name: "Variant design", // 变体设计
        assignee: "JD",
        status: "done",
        startDate: _d(-8),
        endDate: _d(-5),
      },
      {
        id: "8-3",
        name: "Analysis & learnings", // 分析和学习
        assignee: "PM",
        status: "done",
        startDate: _d(-5),
        endDate: _d(-3),
      },
    ],
  },
  {
    id: "9",
    name: "Support Center Revamp", // 支持中心更新
    taskCount: 4,
    progress: 100,
    startDate: _d(-15),
    endDate: _d(-5),
    status: "completed",
    priority: "medium",
    tags: ["frontend"],
    members: ["jason duong"],
    client: "Acme Helpdesk",
    typeLabel: "Revamp",
    durationLabel: "2 weeks",
    tasks: [
      {
        id: "9-1",
        name: "Content IA", // 内容信息架构
        assignee: "JD",
        status: "done",
        startDate: _d(-15),
        endDate: _d(-13),
      },
      {
        id: "9-2",
        name: "Search UX", // 搜索用户体验
        assignee: "JD",
        status: "done",
        startDate: _d(-13),
        endDate: _d(-10),
      },
      {
        id: "9-3",
        name: "Article template", // 文章模板
        assignee: "HP",
        status: "done",
        startDate: _d(-10),
        endDate: _d(-7),
      },
      {
        id: "9-4",
        name: "Rollout & feedback", // 发布和反馈
        assignee: "PM",
        status: "done",
        startDate: _d(-7),
        endDate: _d(-5),
      },
    ],
  },
  {
    id: "10",
    name: "Billing Dashboard Polish", // 计费仪表板优化
    taskCount: 2,
    progress: 100,
    startDate: _d(-6),
    endDate: _d(-1),
    status: "completed",
    priority: "low",
    tags: ["bug"],
    members: ["jason duong"],
    client: "Acme Finance",
    typeLabel: "Polish",
    durationLabel: "3 days",
    tasks: [
      {
        id: "10-1",
        name: "Error state review", // 错误状态审查
        assignee: "QA",
        status: "done",
        startDate: _d(-6),
        endDate: _d(-4),
      },
      {
        id: "10-2",
        name: "Charts clean-up", // 图表清理
        assignee: "JD",
        status: "done",
        startDate: _d(-3),
        endDate: _d(-1),
      },
    ],
  },
]

// FilterCounts 类型：过滤计数类型定义
export type FilterCounts = {
  status?: Record<string, number> // 状态计数：状态名称到计数的映射
  priority?: Record<string, number> // 优先级计数：优先级名称到计数的映射
  tags?: Record<string, number> // 标签计数：标签名称到计数的映射
  members?: Record<string, number> // 成员计数：成员名称到计数的映射
}

// computeFilterCounts 函数：计算过滤计数
// 参数 list：项目列表
// 返回值：过滤计数对象，包含状态、优先级、标签和成员的计数
export function computeFilterCounts(list: Project[]): FilterCounts {
  // res：结果对象，初始化为空的计数对象
  const res: FilterCounts = {
    status: {},
    priority: {},
    tags: {},
    members: {},
  }
  // 遍历项目列表
  for (const p of list) {
    // 状态计数
    res.status![p.status] = (res.status![p.status] || 0) + 1
    // 优先级计数
    res.priority![p.priority] = (res.priority![p.priority] || 0) + 1
    // 标签计数
    for (const t of p.tags) {
      const id = t.toLowerCase() // 将标签转换为小写
      res.tags![id] = (res.tags![id] || 0) + 1
    }
    // 成员计数分类
    if (p.members.length === 0) {
      // 如果没有成员，增加"no-member"计数
      res.members!["no-member"] = (res.members!["no-member"] || 0) + 1
    }
    if (p.members.length > 0) {
      // 如果有成员，增加"current"计数
      res.members!["current"] = (res.members!["current"] || 0) + 1
    }
    if (p.members.some((m) => m.toLowerCase() === "jason duong")) {
      // 如果成员包含"jason duong"，增加"jason"计数
      res.members!["jason"] = (res.members!["jason"] || 0) + 1
    }
  }
  return res
}

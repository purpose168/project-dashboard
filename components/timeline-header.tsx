"use client"

// TimelineHeaderProps 接口：时间轴头部组件的属性类型定义
interface TimelineHeaderProps {
  dates: Date[] // 时间轴显示的日期数组
}

// TimelineHeader 组件：时间轴头部组件
// 用于显示时间轴的日期头部，包含固定的名称列和可滚动的日期列
export function TimelineHeader({ dates }: TimelineHeaderProps) {
  // formatDate 函数：格式化日期为星期名称和日期数字
  const formatDate = (date: Date) => {
    const dayName = date.toLocaleString("default", { weekday: "short" }) // 获取星期名称（简写，如 Mon、Tue）
    const dayNum = date.getDate() // 获取日期数字（1-31）
    return { dayName, dayNum }
  }

  return (
    <div className="flex border-b bg-muted/30 border-border sticky top-0 z-20">
      {/* 固定的名称列头部 */}
      <div className="w-[280px] lg:w-[320px] shrink-0 px-4 py-2 bg-muted/30 sticky left-0 z-10 border-r border-border/40">
        <span className="text-xs font-medium text-muted-foreground">Name</span>
      </div>

      {/* 可滚动的时间轴日期头部 */}
      <div className="flex flex-1 min-w-[600px] relative">
        <div className="flex flex-1">
          {/* 遍历日期数组，渲染每个日期的头部 */}
          {dates.map((date, index) => {
            const { dayName, dayNum } = formatDate(date)
            return (
              <div key={index} className="flex flex-1 flex-col items-center justify-center py-2">
                <span className="text-xs text-muted-foreground">
                  {dayName} {dayNum}
                </span>
              </div>
            )
          })}
        </div>
        {/* 右侧渐变遮罩效果，用于提示用户可以滚动 */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

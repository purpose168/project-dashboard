"use client"

// ProgressCircleProps 接口定义：进度圆环组件的属性
interface ProgressCircleProps {
  progress: number // 进度值（0-100）
  color: string // 进度条颜色
  size?: number // 圆环大小（直径），默认为 18
  strokeWidth?: number // 描边宽度，默认为 2
}

// ProgressCircle 组件：进度圆环组件
// 用于显示圆形进度条，常用于显示任务完成度、加载进度等场景
// 支持自定义颜色、大小、描边宽度，并带有平滑的过渡动画
export function ProgressCircle({ progress, color, size = 18, strokeWidth = 2 }: ProgressCircleProps) {
  // 强制使用整数几何形状以避免子像素抗锯齿问题
  // Math.round：四舍五入到最近的整数
  const s = Math.round(size) // 圆环的直径（整数）
  const r = Math.floor((s - strokeWidth) / 2) // 圆环的半径（向下取整）
  const cx = s / 2 // 圆心的 x 坐标
  const cy = s / 2 // 圆心的 y 坐标

  // 计算圆的周长：2πr
  const circumference = 2 * Math.PI * r
  // 计算进度条的偏移量：根据进度值（0-100）计算需要隐藏的圆弧长度
  // 进度为 0 时，dashOffset = circumference（完全隐藏）
  // 进度为 100 时，dashOffset = 0（完全显示）
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
      {/* SVG 容器：用于绘制圆环 */}
      {/* width/height：SVG 的显示大小 */}
      {/* viewBox：定义 SVG 的坐标系 */}
      {/* aria-hidden：标记为辅助技术不可见（纯装饰性元素） */}
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
        {/* 背景圆环：显示完整的灰色圆环 */}
        {/* cx/cy：圆心坐标 */}
        {/* r：半径 */}
        {/* fill="none"：不填充颜色 */}
        {/* stroke="currentColor"：使用当前文本颜色作为描边颜色 */}
        {/* strokeWidth：描边宽度 */}
        {/* className="text-border"：使用边框颜色类 */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />

        {/* 进度圆环：显示进度的彩色圆环 */}
        {/* cx/cy：圆心坐标 */}
        {/* r：半径 */}
        {/* fill="none"：不填充颜色 */}
        {/* stroke={color}：使用传入的颜色作为描边颜色 */}
        {/* strokeWidth：描边宽度 */}
        {/* strokeLinecap="round"：线端点样式为圆形（使进度条端点圆润） */}
        {/* strokeDasharray：虚线数组，设置为周长，使圆环可以分段显示 */}
        {/* strokeDashoffset：虚线偏移量，用于控制进度条的显示长度 */}
        {/* transform：旋转 -90 度，使进度条从顶部开始（默认从右侧开始） */}
        {/* style.transition：添加过渡动画，使进度变化时有平滑的动画效果 */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            transition: "stroke-dashoffset 0.3s ease",
          }}
        />
      </svg>
    </div>
  )
}

import * as React from 'react'

// MOBILE_BREAKPOINT：移动设备断点（像素）
// 当窗口宽度小于此值时，设备被视为移动设备
const MOBILE_BREAKPOINT = 768

// useIsMobile 函数：自定义 React Hook，用于检测当前设备是否为移动设备
// 返回一个布尔值，表示当前设备是否为移动设备
export function useIsMobile() {
  // isMobile 状态：当前设备是否为移动设备
  // 初始值为 undefined，表示尚未检测
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // useEffect 钩子：在组件挂载时执行一次，用于设置媒体查询监听器
  React.useEffect(() => {
    // mql：媒体查询列表对象，用于监听窗口宽度变化
    // 查询条件为窗口宽度小于移动设备断点减 1 像素（即 767px）
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // onChange 函数：媒体查询变化时的回调函数
    // 当窗口宽度变化时，更新 isMobile 状态
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // 添加媒体查询变化事件监听器
    mql.addEventListener('change', onChange)
    
    // 初始化 isMobile 状态
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // 清理函数：在组件卸载时移除事件监听器
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // 返回 isMobile 的布尔值（使用 !! 将 undefined 转换为 false）
  return !!isMobile
}

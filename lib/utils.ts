import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// cn 函数：合并 Tailwind CSS 类名的工具函数
// 参数 inputs：类名数组，可以是字符串、对象、数组等各种格式
// 返回值：合并后的类名字符串
// 使用 clsx 处理条件类名和类名合并，使用 tailwind-merge 解决 Tailwind CSS 类名冲突
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// getAvatarUrl 函数：根据用户名获取头像 URL
// 参数 name：用户名（可选）
// 返回值：头像 URL 字符串或 undefined（如果没有匹配的头像）
export function getAvatarUrl(name?: string): string | undefined {
  // 如果没有提供用户名，返回 undefined
  if (!name) return undefined
  
  // key：将用户名转换为小写并去除首尾空格
  // 这样可以确保匹配时不区分大小写和空格
  const key = name.trim().toLowerCase()

  // 与 SidebarFooter 中的头像配置保持同步
  // 在此演示中，只有主用户使用真实照片，其他用户使用首字母作为头像
  // 如果用户名是 "jason duong"、"jason d" 或 "jd"，返回真实头像的 URL
  if (key === "jason duong" || key === "jason d" || key === "jd") {
    return "/avatar-profile.jpg"
  }

  // 如果没有匹配的用户名，返回 undefined
  return undefined
}

import type { FilterChip } from "@/lib/view-options"

// normalizeKey 函数：规范化键名
// 参数 key：原始键名
// 返回值：规范化后的键名
// 将各种可能的键名变体统一为标准键名
function normalizeKey(key: string): string {
    const s = key.trim().toLowerCase() // 去除首尾空格并转换为小写
    if (s.startsWith("status")) return "status" // 如果以 "status" 开头，返回 "status"
    if (s.startsWith("priority")) return "priority" // 如果以 "priority" 开头，返回 "priority"
    if (s.startsWith("tag")) return "tags" // 如果以 "tag" 开头，返回 "tags"
    if (s.startsWith("member") || s === "pic") return "members" // 如果以 "member" 开头或等于 "pic"，返回 "members"
    return s // 否则返回原始键名
}

// chipsToParams 函数：将过滤芯片数组转换为 URL 搜索参数
// 参数 chips：过滤芯片数组
// 返回值：URLSearchParams 对象
export function chipsToParams(chips: FilterChip[]): URLSearchParams {
    const params = new URLSearchParams() // 创建 URL 搜索参数对象
    const buckets: Record<string, string[]> = {} // 桶对象，用于按键名分组存储值

    // 遍历过滤芯片数组
    for (const chip of chips) {
        const key = normalizeKey(chip.key) // 规范化键名
        buckets[key] = buckets[key] || [] // 初始化桶（如果不存在）
        buckets[key].push(chip.value) // 将值添加到对应的桶中
    }

    // 遍历桶对象，将键值对添加到 URL 参数中
    for (const [key, values] of Object.entries(buckets)) {
        if (values.length) { // 如果值数组不为空
            params.set(key, values.join(",")) // 将值数组用逗号连接后设置到参数中
        }
    }

    return params // 返回 URL 搜索参数对象
}

// paramsToChips 函数：将 URL 搜索参数转换为过滤芯片数组
// 参数 params：URLSearchParams 对象
// 返回值：过滤芯片数组
export function paramsToChips(params: URLSearchParams): FilterChip[] {
    const chips: FilterChip[] = [] // 初始化过滤芯片数组

    // add 函数：添加过滤芯片
    // 参数 key：键名
    // 参数 values：值字符串（用逗号分隔）
    const add = (key: string, values?: string | null) => {
        if (!values) return // 如果值为空，直接返回

        // 用逗号分割值字符串，遍历每个值
        values.split(",").forEach((value) => {
            if (!value) return // 如果值为空，跳过
            chips.push({ key, value }) // 将键值对添加到过滤芯片数组中
        })
    }

    // 添加各种类型的过滤芯片
    add("Status", params.get("status")) // 添加状态过滤芯片
    add("Priority", params.get("priority")) // 添加优先级过滤芯片
    add("Tag", params.get("tags")) // 添加标签过滤芯片
    add("Member", params.get("members")) // 添加成员过滤芯片

    return chips // 返回过滤芯片数组
}

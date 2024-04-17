/**
 * 项目信息
 */
export interface ProductItem {
  name: string
  id: number | string
}

/**
 * 项目、集群切换信息
 */
export type SwitchInfo = ProductItem

export interface NavigationItem {
  key: string // 子产品唯一标识符
  category: string // 组类别
  order: number // 组排序
  name: string // 子产品名
  iconName: string | Function // 图标名或渲染函数
  url: string // 子产品地址
  prefixIcon?: string // 后缀图标，逗号分隔：'new'
  clickAction?: 0 | 1 // 鼠标点击后的行为，0: 当前页面跳转，1: 新开页面跳转
}

export interface NavigationGroup {
  category: string
  order: number
  navItems: NavigationItem[]
}

export interface OuterLinkItem {
  name: string // 模块名
  url: string // 地址
  prefixIcon: string // 后缀图标，逗号分隔：'new'
}

export type UserActionItem =
  | {
      type: 'link'
      name: string
      url: string
      clickAction?: 0 | 1 // 鼠标点击后的行为，0: 当前页面跳转，1: 新开页面跳转
    }
  | {
      type: 'button'
      name: string
      onClick: Function
    }

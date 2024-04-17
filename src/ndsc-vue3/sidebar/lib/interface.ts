/**
 * 菜单信息
 */
export interface NavListDto {
  id: string
  name: string
  to: string // 路由
  hide?: boolean // 是否隐藏
  // 支持slot和函数
  icon?: any // ant-design icon 名称， 优先级：icon > iconFont
  // iconType?: 'antdIcon' | 'svgIcon' | 'iconFont' | 'slot' // icon 的类型，支持 antd 、svgicon、iconFont、自定义slot
  children?: NavListDto[]
  includeTab?: string[] // 需要菜单高亮的路由标识数组
  [propName: string]: any // 组件内部使用
}

/**
 * 菜单key的数组item
 */
export interface MenuIncludeDto {
  id: string
  tab: string[] // id 下包含的 array
}

export interface ProjectDto {
  // 项目logo的名字
  iconName?: string
  icon?: any
  // 项目名
  name: string
  to?: string
}

export interface ConfigDto {
  hide: boolean
  to: string
  name: string
}

export interface NavConfigDto {
  // 项目信息
  project?: ProjectDto
  // 主菜单信息
  menu: NavListDto[]
  // 是否业务设置页
  isConfigPage?: boolean
  // 底部业务设置
  config?: ConfigDto
}

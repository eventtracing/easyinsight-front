export interface User {
  id?: string | number
  email: string
  userName: string
}

// 分页请求
export type Pagination = {
  currentPage: number
  pageSize: number
}

// 排序请求
export type Order = {
  orderBy: string
  orderRule: 'ascend' | 'descend'
}

// 搜索请求
export type Search = {
  search: string
}

// 分页响应结果
export type PaginationList<T> = {
  totalNum: number
  pageNum: number
  list: T[]
}

export type BaseObjectDto = {
  id: number
  code: string
  name: string
  description: string
  creator: User
  createTime: number
  updateTime: number
  updater: User
}

export type TagAggreDto = {
  key: number | string // 传递值
  value: string // 展示值
}

export type ItemDto = {
  id: number
  name: string
}

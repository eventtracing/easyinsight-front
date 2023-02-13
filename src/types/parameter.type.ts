import { BaseObjectDto, Pagination, Order, Search } from './common.type'
import { ObjSimpleDto } from './object.type'

export enum ParamTypeEnum {
  GLOBAL_PUBLIC_PARAM = 1, // 全局公参
  EVENT_PARAM = 2, // 事件公参
  OBJ_NORMAL_PARAM = 3, // 对象标准私参
  OBJ_BUSINESS_PARAM = 4 // 对象业务私参
}

export const paramTypeNameMap = {
  [ParamTypeEnum.GLOBAL_PUBLIC_PARAM]: '全局公参',
  [ParamTypeEnum.EVENT_PARAM]: '事件公参',
  [ParamTypeEnum.OBJ_NORMAL_PARAM]: '对象标准私参',
  [ParamTypeEnum.OBJ_BUSINESS_PARAM]: '对象业务私参'
}

export enum ParamValueTypeEnum {
  CONSTANT = 1, // 常量
  VARIABLE = 2 // 变量
}

export interface ParameterDto extends BaseObjectDto {
  valueType: ParamValueTypeEnum
}

export type ParamValueDto = BaseObjectDto & {
  paramId: number
  used: boolean // 是否被使用, 被使用不可被编辑
}

export interface ParameterDetailDto extends ParameterDto {
  paramType: ParamTypeEnum
  values: ParamValueDto[]
}

export interface ParamListItemObj {
  paramType: ParamTypeEnum
  code: string
  items: ParameterDto[]
}

/** ----------------------------- 对象业务私参 -------------------------- */

// 私参参数名
export type ParamPoolItemDto = Omit<BaseObjectDto, 'name' | 'description'>
// 私参具体含义项
export interface BusinessPrivateParamDto extends ParameterDto {
  binds: ObjSimpleDto[] // 关联对象
}

// 私参具体含义项详情
export interface BusinessPrivateParamDetailDto extends BusinessPrivateParamDto {
  paramType: ParamTypeEnum
  valueType: ParamValueTypeEnum
  values: ParamValueDto[]
}

/** ----------------------------- Requst Parameter Type -------------------------- */

// 获取对象业务私参列表
export type GetBusinessParameListReq = Pagination &
  Order &
  Search & {
    code: string // 私参code
    createEmails: string[] // 创建人筛选
    valueTypes: ParamValueTypeEnum[] // 参数类型筛选
  }

// 获取全局公参、事件公参、对象标准私参列表
export type GetParameterListReq = Pagination &
  Order &
  Search & {
    paramType?: Omit<ParamTypeEnum, ParamTypeEnum.OBJ_BUSINESS_PARAM>
    createEmails: string[] // 创建人筛选
    valueTypes: ParamValueTypeEnum[] // 参数类型筛选
  }

// 创建全局公参、事件公参、对象标准私参
export type NewParamReq = {
  paramType: Omit<ParamTypeEnum, ParamTypeEnum.OBJ_BUSINESS_PARAM>
  code: string
  name: string
  description: string
  valueType: ParamValueTypeEnum
}

// 对象取值模版
export interface VariableParamReq {
  id?: number
  name: string
  rule: string
  creator?: {
    email: string
    userName: string
  }
  updater?: {
    email: string
    userName: string
  }
  createTime?: number
  updateTime?: number
}

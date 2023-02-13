import { BaseObjectDto, Pagination, Order, Search } from './common.type'
import { ParamValueTypeEnum, ParamValueDto, ParamTypeEnum, ParameterDto } from './parameter.type'

export type TemplateSimpleDto = Omit<BaseObjectDto, 'code'>

export interface ParamBindItemDto {
  uuid: string // 展示所构造的唯一值
  id: number // param id
  code: string
  name: string
  paramType: ParamTypeEnum
  valueType: ParamValueTypeEnum
  notEmpty: boolean // 非空
  must?: boolean // 必传
  description: string // 取值描述
  selectedValues: number[] // 选中的值
  values: ParamValueDto[] // 可选择的值
  names: ParameterDto[] // 对象业务私参可选的参数集合
  needTest?: boolean // 用于测试
}

export interface ParamBindSimpleDto {
  paramId: number
  values: number[]
  description: string
  notEmpty: boolean
  must: boolean // 必传
}

export interface TemplateDetailDto extends TemplateSimpleDto {
  binds: Omit<ParamBindItemDto, 'uuid' | 'names'>[]
}

/** ----------------------------- Requst Parameter Type -------------------------- */

export type GetTemplateListReq = Pagination & Search & Partial<Order>

export type NewTemplateReq = {
  name: string
  description: string
  binds: ParamBindSimpleDto[]
}

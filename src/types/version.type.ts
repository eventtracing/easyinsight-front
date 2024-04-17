import { ParamBindSimpleDto } from '@/types/template.type'

export interface VersionDto {
  id: string
  name: string
  preset: boolean // 是否是预置版本
  currentUsing: boolean // 是否是当前使用版本
  used: boolean // 是否被使用过，被使用过不可删除
}

export enum EntityTypeEnum {
  TERMINAL = 1, // 终端
  EVENT = 2, // 事件类型
  OBJ = 3, // 对象
  TEMPLATE = 4 // 模板
}

/** ----------------------------- Requst Parameter Type -------------------------- */

export type GetVersionListReq = {
  search: string
  entityId: number
  entityType: EntityTypeEnum
}

export interface NewVersionReq {
  entityId: number
  entityType: EntityTypeEnum
  name: string
}

export interface DelVersionReq {
  entityId: number
  entityType: EntityTypeEnum
  versionId: number
}

export interface UpdateVersionBindsReq {
  entityId: number
  entityType: EntityTypeEnum
  versionId: number
  version: string // 版本名称
  paramBinds: ParamBindSimpleDto[]
}

export interface CopyVersionReq {
  name: string
  entityId: number
  entityType: EntityTypeEnum
  versionId: number
}

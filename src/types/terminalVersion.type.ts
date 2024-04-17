import { User, Pagination, Order, Search } from './common.type'
import {
  ObjTypeEnum,
  SchemaTypeEnum,
  ParamWithValueItemDto,
  ChangeTypeEnum,
  ObjDetailDto
} from './object.type'
import { ReqObjectTypeEnum, ReqStatusEnum } from './requirement.type'

export enum TerminalVersionStatusEnum {
  DEVELOP = 1, // 待上线
  ONLINE = 2 // 已上线
}

export interface TerminalVersionDto {
  id: number
  version: string // 端解决版本
  versionNum: string // 版本号
  status: TerminalVersionStatusEnum
  creator: User
  createTime: number
}

export interface TerminalVersionNode {
  id: number
  name: string
  status: TerminalVersionStatusEnum
}

export interface TerminalVersionEdge {
  from: number
  to: number
  isMaster: boolean // 是否属于主干分支路径
}

export interface TvDeployObjs {
  oid: string
  name: string
  type: ObjTypeEnum
  reqType: SchemaTypeEnum
  owner: string
  verifier: string
  objStatus: ReqStatusEnum
}

export interface TvReqTaskVO {
  requirement: string
  task: string
  owner: string
  verifier: string
  objs: TvDeployObjs[]
  taskStatus: ReqStatusEnum
}

export interface ConflictTrackerItem {
  requirementName: string
  taskName: string
  historyId: number
}

export interface ConflictObj {
  oid: number
  name: string
  unMergedObjList: ConflictTrackerItem[]
  mergeResult: boolean // 是否已合并
  objId: number
  historyId: number // 对象在合并之前为空，合并后会有historyId
}

export interface VersionConflictResult {
  checkTime: number // 检测时间
  checkResult: boolean // 是否有冲突
  conflictList: ConflictObj[] // 冲突结果
}

// 不同端版本的冲突对象
export interface DiffBaseConflictObjVO {
  objId: number
  oid: string
  trackerId: number
  historyId: number
  name: string
  type: ObjTypeEnum
  reqType: ReqObjectTypeEnum
  baseTerminalVersionId: number // 原基准版本id
  baseTerminalVersionName: string // 原基准版本名称
}

// 事件类型 diff
export interface EventDiffVO {
  eventId: number
  code: string
  paramChangeType: ChangeTypeEnum
  terminalVersionName: string // 当前最新端版本名
  isNewestTerminalVersion: boolean // diff是否来自最新端版本
  isCurrentTask: boolean // diff是否来自当前需求的终态
}

// 血缘配置 diff
export interface ParentObjDiffVO {
  parentObjId: number
  parentObjName: string
  paramChangeType: ChangeTypeEnum
  terminalVersionName: string // 当前最新端版本名
  isNewestTerminalVersion: boolean // diff是否来自最新端版本
  isCurrentTask: boolean // diff是否来自当前需求的终态
}

// 参数配置 diff
export type ParamDiffVO = ParamWithValueItemDto & {
  terminalVersionName: string // 当前最新端版本名
  isNewestTerminalVersion: boolean // diff是否来自最新端版本
  isCurrentTask: boolean // diff是否来自当前需求的终态
}

// 跨版本对象 diff 详情
export type DiffBaseConflictDetailVO = Omit<
  ObjDetailDto,
  'trackers' | 'consistency' | 'editOidOrType'
> & {
  terminalName: string
  requirementAndTaskName: string
  diffEvents: EventDiffVO[]
  diffParentObjs: ParentObjDiffVO[]
  diffParams: ParamDiffVO[]
}

/** ----------------------------- Requst Parameter Type -------------------------- */

export type GetVersionListReq = Pagination &
  Order &
  Search & {
    terminalId: number
  }

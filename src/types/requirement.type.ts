import { FilterDto } from './app.type'
import { User, Pagination, Search } from './common.type'
import { SchemaTypeEnum } from './object.type'

export enum ReqStatusEnum {
  START = 1, // 开始
  WAIT_VRFY = 2, // 待审核
  VRFY_FINISHED = 3, // 已审核
  DEV_FINISHED = 4, // 已完成
  TEST_FINISHED = 5, // 测试通过
  ONLINE = 6, // 已上线
  NO = 10 // 未指派
}

export enum TaskOperateEnum {
  FINISH_DSN = 'FINISH_DSN', // 设计完成
  FINISH_VERIFY = 'FINISH_VERIFY', // 审核确认
  FINISH_DEV = 'FINISH_DEV', // 开发完成
  FINISH_TEST = 'FINISH_TEST', // 测试完成
  DEPLOY = 'DEPLOY' // 发布上线
}

export const reqStatusNameMap = {
  [ReqStatusEnum.START]: '开始',
  [ReqStatusEnum.WAIT_VRFY]: '待审核',
  [ReqStatusEnum.VRFY_FINISHED]: '已审核',
  [ReqStatusEnum.DEV_FINISHED]: '已完成',
  [ReqStatusEnum.TEST_FINISHED]: '测试通过',
  [ReqStatusEnum.ONLINE]: '已上线',
  [ReqStatusEnum.NO]: '未指派'
}

export const reqStatusColorMap = {
  [ReqStatusEnum.START]: '#6AB2F5',
  [ReqStatusEnum.WAIT_VRFY]: '#13C2C2',
  [ReqStatusEnum.VRFY_FINISHED]: '#FB8D18',
  [ReqStatusEnum.DEV_FINISHED]: '#A0D911',
  [ReqStatusEnum.TEST_FINISHED]: '#FA541C',
  [ReqStatusEnum.ONLINE]: '#26BD71',
  [ReqStatusEnum.NO]: '#d4b106'
}

export const reqStatusOptions = [
  {
    key: ReqStatusEnum.START,
    value: '开始'
  },
  {
    key: ReqStatusEnum.WAIT_VRFY,
    value: '待审核'
  },
  {
    key: ReqStatusEnum.VRFY_FINISHED,
    value: '已审核'
  },
  {
    key: ReqStatusEnum.DEV_FINISHED,
    value: '已完成'
  },
  {
    key: ReqStatusEnum.TEST_FINISHED,
    value: '测试通过'
  },
  {
    key: ReqStatusEnum.ONLINE,
    value: '已上线'
  }
]

export const objectTypeEnum = [
  {
    key: 'page',
    value: '页面'
  },
  {
    key: 'element',
    value: '元素'
  }
]

export const taskOperateTextMap = {
  [ReqStatusEnum.START]: '设计完成',
  [ReqStatusEnum.WAIT_VRFY]: '审核确认',
  [ReqStatusEnum.VRFY_FINISHED]: '开发完成',
  [ReqStatusEnum.DEV_FINISHED]: '测试完成',
  [ReqStatusEnum.TEST_FINISHED]: '',
  [ReqStatusEnum.ONLINE]: ''
}

export const taskOperateMap = {
  [ReqStatusEnum.START]: TaskOperateEnum.FINISH_DSN,
  [ReqStatusEnum.WAIT_VRFY]: TaskOperateEnum.FINISH_VERIFY,
  [ReqStatusEnum.VRFY_FINISHED]: TaskOperateEnum.FINISH_DEV,
  [ReqStatusEnum.DEV_FINISHED]: TaskOperateEnum.FINISH_TEST,
  [ReqStatusEnum.TEST_FINISHED]: TaskOperateEnum.DEPLOY,
  [ReqStatusEnum.ONLINE]: '-'
}

export interface RequirementDto {
  id: number
  reqIssueKey: string // 需求jira key
  issueUrl: string // overmind url
  name: string
  versions: string // 多版本，逗号分隔的字符串
  status: ReqStatusEnum
  creator: User
  reporter?: User // 需求报告人
  dataOwners: User[]
  createTime: number
  updateUser: User
  updateTime: number
  description: string
}

// 转交相关人类型
export enum DeliverTypeEnum {
  OWNER = 'OWNER',
  VERIFIER = 'VERIFIER'
}

export enum DeliverTargetEnum {
  TASK = 'TASK',
  OBJECT = 'OBJECT'
}

// 对象类型
export enum TaskRelObjectTypeEnum {
  PAGE = 'PAGE',
  ELEMENT = 'ELEMENT'
}

// 需求类型
export enum ReqObjectTypeEnum {
  CHANGE = 'CHANGE',
  CREATE = 'CREATE'
}

export interface TaskRelObjDto {
  id: number
  objId: number // 对象ID
  trackerId: number // 对象埋点ID
  historyId: number // 对象变更ID
  oid: string
  name: string
  objType: TaskRelObjectTypeEnum
  reqType: ReqObjectTypeEnum
  status: ReqStatusEnum
  relObjMaxStatus?: ReqStatusEnum // 对象存在spm上的最高状态
  verifier: User
  owner: User
  objName?: string
  consistency: boolean // 是否多端一致
  procInstId: string // 流转实例
  isReuse?: boolean // 是否复用
  parent?: Array<string> // 父级唯一Id,
  otherAppId?: number
}

export interface TaskDto {
  taskType: number
  id: number
  name: string
  requirementId: number // 关联的需求id
  reqIssueKey: string // 关联的需求 key
  taskIssueKey: string // task的 key
  status: ReqStatusEnum
  terminal: string // 终端
  terminalId: number
  version: string
  owner: User
  verifier: User
  relObjs: TaskRelObjDto[] // 管理对象
  procInstId: string
  operating?: boolean
  refTaskId?: string | number // RN端特有标志
  flatrelObjLists?: any
  reqPoolId?: number // 需求组ID
}

export interface TaskObjDto {
  childs: TaskDto[]
  historyId: number
  id: number
  objId: number
  objName: string
  objType: string
  oid: string
  reqType: string
  taskId: number
  trackerId: number
}

// task - 对象埋点方案的基本信息（树状展开）
export interface ObjTrackerSchemaSimpleDto {
  objId: number
  trackerId: number
  schemaType: SchemaTypeEnum
  objName?: string
  childs?: ObjTrackerSchemaSimpleDto[]
}

/** ----------------------------- Requst Parameter Type -------------------------- */

export interface GetReqListReq {
  search?: string
  status?: ReqStatusEnum
  creator?: string
  owner?: string
  version?: string
  filter?: boolean // 是否过滤已上线需求
}

export interface NewRequirementReq {
  requirement: {
    reqIssueKey: string
    name: string
    versions: string
    creator: User
    dataOwners: User[]
    description: string // 富文本
  }
  tasks: TaskDto[]
}

export interface UpdateRequirementReq {
  id: number
  dataOwners: User[]
  description: string
}

export type GetTaskListReq = Search &
  Pagination & {
    reqIssueKeys: string[]
    status: ReqStatusEnum
    owner: string // 负责人
    verifier: string // 验证人
    version: string // 端版本
  }

export interface DeliverTaskAndObjectReq {
  deliverType: DeliverTypeEnum
  userDTO: User
  taskIds: number[]
  processIds: number[]
  // targetList: {
  //   id: number
  //   type: DeliverTargetEnum
  // }[]
}

/** *****************************************  需求组  ********************************************* */
export interface RequirementGroupParams {
  dataOwnerEmail: string
  creatorEmail: string
  from: string
  order: 'desc' | 'asc'
}
export interface RequirementGroupRes {
  id: number
  name: string
  dataOwners: string
  creatorName: string
  createTime: number
  requirements: Record<string, unknown>[]
}

// 来源需求状态枚举
export enum SourceMap {
  '未开始' = -1,
  '开始' = 1,
  '解决中' = 3,
  '未解决' = 4,
  '已解决' = 5,
  '关闭 ' = 6,
  '已完成' = 12102,
  '已排期' = 11301,
  '策划中' = 10616,
  '交互中' = 10617,
  '视觉中' = 10301,
  '验证中' = 10303,
  '需求池' = 10410,
  '开发中' = 10600,
  '待上线' = 10605,
  '代码审核' = 11113,
  '待评审' = 12600,
  '待排期' = 12601,
  '已取消' = 11100
}
// 任务状态来源枚举
export const enum TaskSourceStatus {
  OTHER = -9999,
  START = 1,
  TO_REVIEW = 12600,
  TO_ARRANGE = 12601,
  ARRANGED = 11301,
  ONLINE = 80025,
  LOOKED_BACK = 80026,
  LOOKED_BACK_AND_ACCEPTED = 80027,
  CLOSED = 6
}
export const taskSourceStatusOptions = [
  {
    key: TaskSourceStatus.OTHER,
    value: '其他'
  },
  {
    key: TaskSourceStatus.START,
    value: '开始'
  },
  {
    key: TaskSourceStatus.TO_REVIEW,
    value: '待评审'
  },
  {
    key: TaskSourceStatus.TO_ARRANGE,
    value: '待排期'
  },
  {
    key: TaskSourceStatus.ARRANGED,
    value: '已排期'
  },
  {
    key: TaskSourceStatus.ONLINE,
    value: '已上线'
  },
  {
    key: TaskSourceStatus.LOOKED_BACK,
    value: '已回顾'
  },
  {
    key: TaskSourceStatus.LOOKED_BACK_AND_ACCEPTED,
    value: '已回顾验收'
  },
  {
    key: TaskSourceStatus.CLOSED,
    value: '关闭'
  }
]
// 版本来源枚举
export const enum VersionSourceStatus {
  OTHER = -9999,
  WAIT_FOR_TEST = 10,
  WAIT_FOR_RELEASE = 25,
  RELEASED = 30,
  TERMINATED = 35
}
export const versionSourceStatusOptions = [
  {
    key: VersionSourceStatus.OTHER,
    value: '其他'
  },
  {
    key: VersionSourceStatus.WAIT_FOR_TEST,
    value: '待上线'
  },
  {
    key: VersionSourceStatus.WAIT_FOR_RELEASE,
    value: '上线中'
  },
  {
    key: VersionSourceStatus.RELEASED,
    value: '已上线'
  },
  {
    key: VersionSourceStatus.TERMINATED,
    value: '已终止'
  }
]

export interface RequirementSelectOptionsDto {
  users: FilterDto[]
  terminals: { id: number; name: string }[]
}

type StringKey = 'name' | 'priority' | 'description'

export type NewRequirementDto = {
  from: 1 | 2
  creator: User
  omState?: SourceMap
} & Record<StringKey, string> &
  Partial<Record<'reqIssueKey' | 'team' | 'businessArea' | 'views', string>>

export interface NewTaskDto {
  taskIssueKey?: string // om任务key
  reqIssueKey?: string // om需求key
  name: string
  terminalId: number
  owner: User
  verifier: User
}
// 添加编辑需求类型
export interface OptionRequirementDto {
  reqPoolId: number
  requirement: NewRequirementDto
  tasks: NewTaskDto[]
}

/** *****************************************  需求任务  ********************************************* */
export interface TaskAggreDto extends Record<'reqName' | 'reqKeys' | 'reqInfos', string[]> {
  terminals: { id: number; name: string }[]
  termnialVersions: string[]
  sprints: string[]
}

// 任务列表传参结构
export type TaskParamsDto = Partial<{
  reqIssueKey: string
  reqName: string
  dataOwnerEmail: string
  terminalId: number
  objSearch: string
  status: number
  taskOwner: string
  taskVerifier: string
  processStatus: number
  processOwner: string
  processVerifier: string
  terminalVersion: string
  sprint: string
  currentPage: number
  pageSize: number
  orderBy: string
  orderRule: string
}>

// 任务列表响应结构
export interface TaskResponseDto {
  id: number
  reqPoolId: number
  reqIssueKey: string
  reqName: string
  taskName: string
  terminal: string
  terminalVersion: string
  status: number
  owner: string
  verifier: string
  dataOnwers: string
  sprint: string
}

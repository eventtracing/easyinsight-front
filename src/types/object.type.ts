import {
  BaseObjectDto,
  Pagination,
  Order,
  Search,
  User,
  ItemDto,
} from "./common.type";
import { ParamBindItemDto, ParamBindSimpleDto } from "./template.type";
import { TerminalSimpleDto } from "./terminal.type";
import { EventSimpleDto } from "./event.type";
import { ParamValueTypeEnum } from "./parameter.type";
import { ReqStatusEnum, RequirementDto, TaskDto } from "./requirement.type";

export enum ObjTypeEnum {
  PAGE = 1, // 页面
  ELEMENT = 2, // 元素
  POPOVER = 3, // 浮层
  page = 1,
  element = 2,
  popover = 3,
  bridge = 4,
}

export type TrackerCreateParam<T = ParamBindSimpleDto> = {
  terminalId: number;
  terminalName?: string; // 展示所需
  requireId: number; // 需求id
  taskId: number; // 任务id
  eventIds: number[];
  parentObjs: number[]; // 父对象
  status?: ReqStatusEnum; // 端对象状态
  paramBinds: T[];
  taskType?: number;
  refTaskId?: number;
  pubParamPackageId?: number;
  eventParamsVersionIdMap?: any;
  eventParamssVersionIdMap?: any;
};

export type ObjSimpleDto = Omit<BaseObjectDto, "code"> & {
  oid: string;
  historyId: number;
  type: ObjTypeEnum;
};

export interface TrackerItemDto {
  terminalName: string;
  terminalVersionName: string; // 端版本
  terminalVersionNum: string; // 端版本号
  eventNames: string[];
  // // 兼容合并后的对象（存在多个需求及任务）
  requireNames: string[]; // 需求名
  taskNames: string[]; // 任务名
  taskOwners: User[];
  taskVerifiers: User[];
}

// 对象列表 item
export interface ObjItemDto extends ObjSimpleDto {
  level?: number;
  type: ObjTypeEnum;
  trackers: TrackerItemDto[];
  hisrotyId: number;
  change: boolean; // 是否可以变更
  edit: boolean; // 是否能编辑，对象的某个端已审核，则改对象不能被编辑
  children: ObjItemDto[] | false;
  childs?: ObjItemDto[] | false;
  child: boolean; // 是否有子级
  isRoot?: boolean;
  otherAppId?: number;
}

export interface TrackerItemDetailDto {
  id: number;
  terminal: TerminalSimpleDto;
  events: EventSimpleDto[];
  parentObjs: ObjSimpleDto[];
  paramBinds: ParamBindItemDto[];
  require: RequirementDto; // 需求
  task: TaskDto; // 任务
  status: ReqStatusEnum; // 埋点状态
}

// 对象详情
export interface ObjDetailDto extends ObjSimpleDto {
  id: number;
  trackers: TrackerItemDetailDto[];
  type: ObjTypeEnum;
  imgUrls: string[];
  tags: ItemDto[];
  consistency: boolean;
  priority: string; // 优先级
  editOidOrType: boolean; // 是否能编辑oid,type字段, true表示能编辑，false表示不能编辑
  routePaths?: Array<any>;
}

// 创建对象时前端展示交互所用的临时对象
export interface CreateTempObjDto {
  basics: {
    uuid: string; // 展示用作key
    type: ObjTypeEnum;
    oid: string;
    name: string;
    description: string;
    imgUrls: string[];
    tags: ItemDto[];
    priority: string; // 优先级
    routePathIds?: Array<any>; // 路由id集合
    pathMap?: Array<string>; // 路径名称
    bridgeSubAppId?: any;
  }[];
  consistency: boolean; // 是否多端一致
  disabled: boolean; // 多端一致可选
  parentObjs: number[]; // 用于切换多端一致时数据展示
  paramBinds: ParamBindItemDto[]; // 用于切换多端一致时数据展示
  trackers: (TrackerCreateParam<ParamBindItemDto> & {
    uuid: string; // 展示用作key
    terminalName: string; // 终端名称，tab 展示的标题
  })[];
}

// 编辑对象时前端展示交互所用的临时对象
export interface EditTempObjDto {
  id: number; // 正在编辑的对象 id
  type: ObjTypeEnum;
  oid: string;
  name: string;
  description: string;
  imgUrls: string[];
  priority: string; // 优先级
  tags: ItemDto[];
  consistency: boolean; // 是否多端一致
  parentObjs: number[]; // 用于切换多端一致时数据展示
  paramBinds: ParamBindItemDto[]; // 用于切换多端一致时数据展示
  trackers: (TrackerCreateParam<ParamBindItemDto> & {
    id?: number; // 有 id 表示编辑已存在的终端埋点，无 id 表示新添加的终端埋点
    uuid: string; // 展示用作key
    terminalName: string; // 终端名称，tab 展示的标题
  })[];
  disabled?: boolean;
  routePathIds?: Array<any>; // 路由id集合
  pathMap?: Array<string>; // 路径名称
}

export enum SchemaTypeEnum {
  CREATE = 1,
  CHANGE = 2,
}

export enum ChangeTypeEnum {
  SAME = 0,
  CREATE = 1,
  DELETE = 2,
}

export interface ParamWithValueItemDto {
  id: number;
  code: string;
  name: string;
  description: string;
  valueType: ParamValueTypeEnum;
  values: string[];
  notEmpty: boolean;
  must: boolean; // 必传
  paramChangeType: ChangeTypeEnum;
}

export interface ObjTrackerDto {
  objId: number;
  historyId: number;
  trackerId: number;
  oid: string;
  name: string;
  type: ObjTypeEnum;
  createTime: number;
  updateTime: number;
  schemaType: SchemaTypeEnum;
  globalPublicParam: {
    versionName: string;
    params: ParamWithValueItemDto[];
  };
  eventParam: {
    eventName: string;
    versionName: string;
    params: ParamWithValueItemDto[];
  }[];
  objNormalParam: ParamWithValueItemDto[];
  objBusinessPrivateParam: ParamWithValueItemDto[];
  tags?: { id: string | number; name: string }[];
}

// 对象类型
export interface ObjType {
  [params: string]: string | number;
}

// 对象参数配置
export interface ObjParamDto {
  globalPublicParam: {
    versionName: string;
    params: ParamWithValueItemDto[];
  };
  eventParam: {
    eventName: string;
    versionName: string;
    params: ParamWithValueItemDto[];
    id?: string | number;
  }[];
  eventIds?: any;
  objNormalParam: ParamWithValueItemDto[];
  objBusinessPrivateParam: ParamWithValueItemDto[];
}

export interface ObjHistoryTrackerItemDto {
  terminalName: string; // 终端名称
  terminalVersionName: string; // 端版本名称
  eventNames: string[]; // 事件名称
  // 兼容合并后的对象（存在多个需求及任务）
  taskNames: string[]; // 任务名称
  requireNames: string[]; // 需求名称
  taskOwners: User[];
  taskVerifiers: User[];
}

// 历史版本
export interface ObjHistoryTrackerDto {
  id: number; // 对象id
  historyId: number; // 唯一id
  objId: number;
  objVersionName: string;
  name: string;
  description: string;
  creator: User;
  updater: User;
  dataOwner: User;
  createTime: number;
  updateTime: number;
  edit: boolean; // 能否编辑，对象版本对应端已上线后不可编辑
  trackers: ObjHistoryTrackerItemDto[];
}

// 对象树 Item
export interface ObjTreeItemDto {
  id: number;
  name: string;
  oid: string;
  historyId?: number;
  objId?: number;
  type: ObjTypeEnum;
  canChange: boolean; // 能否变更
  child: boolean; // 是否有子级
  children: ObjTreeItemDto[] | false;
  center?: boolean;
  spmLink: string;
  otherAppId?: number;
}

/** ----------------------------- Requst Parameter Type -------------------------- */

export type GetObjListReq = Order &
  Record<"releasedId" | "type" | "tagIds" | "search", string>;
export type NewObjectReq = {
  basics: {
    type: ObjTypeEnum;
    oid: string;
    name: string;
    description: string;
    imgUrls: string[];
    tagIds: number[];
    priority: string; // 优先级
  }[];
  consistency: boolean; // 是否多端一致
  trackers: TrackerCreateParam[];
};

export interface UpdateBasics {
  id: number;
  historyId?: number;
  type: ObjTypeEnum;
  oid: string;
  name: string;
  description: string;
  imgUrls: string[];
  priority: string; // 优先级
  tagIds: number[];
  tags?: ItemDto[];
  routePathIds?: Array<any>;
}

export interface UpdateTrackers {
  basics: Array<UpdateBasics>;
  consistency: boolean; // 是否多端一致
  trackers: (TrackerCreateParam & {
    id?: number; // 如果是更新，就将此id值带着，如果是新增，这个字段保持为空
  })[];
}

export type UpdateObjectReq = {
  id: number;
  historyId?: number;
  type: ObjTypeEnum;
  oid: string;
  name: string;
  description: string;
  imgUrls: string[];
  priority: string; // 优先级
  consistency: boolean; // 是否多端一致
  tagIds: number[];
  trackers: (TrackerCreateParam & {
    id?: number; // 如果是更新，就将此id值带着，如果是新增，这个字段保持为空
  })[];
  tags?: ItemDto[];
  routePathIds?: Array<any>;
};

/** ----------------------------- 对象血缘 -------------------------- */

// 血缘图节点
export interface ObjLineageNodeDto {
  id: number;
  oid: string;
  name: string;
  type: ObjTypeEnum;
  terminalVersionId: number;
  terminalId: number;
  historyId: number;
  expandParent: boolean; // 能否展开父节点
  expandSon: boolean; // 能否展开子节点
  trackerId?: number | string;
}

// 血缘图边
export interface ObjLineageEdgeDto {
  fromObjId: number;
  toObjId: number;
  style?: any;
  changeType?: ChangeTypeEnum; // 相对上一版本边是删除还是新增，或者不变的
}

// 中心节点
export interface CenterObjDto {
  id: number;
  oid: string;
  name: string;
  type: ObjTypeEnum;
  imgUrls: string[];
}

// 血缘图
export interface ObjLineageDto {
  objs: ObjLineageNodeDto[];
  relations: ObjLineageEdgeDto[];
  center: CenterObjDto;
}

export interface ObjLineageNumberDto {
  parentNum: number; // 上一级父对象数
  sonNum: number; // 下一级子对象数
  allParentNum: number; // 全部父对象数
  allSonNum: number; // 全部子对象数
}

export type GetObjLineageReq = {
  objId: number;
  terminalId: number | null; // null 表示全部
  terminalVersionId: number | null; // null 表示全部
  parentDepth: number;
  sonDepth: number;
  comparePreTracker?: boolean; // 是否与前一个对象版本的对象埋点进行对比， 默认是false
};

export type GetObjTrackerLineageReq = {
  trackerId: number;
  parentDepth: number;
  sonDepth: number;
  comparePreTracker?: boolean; // 是否与前一个对象版本的对象埋点进行对比， 默认是false
};

export type ExpandObjReq = {
  objId: number;
  terminalId: number;
  terminalVersionId: number;
  direction: 1 | 2; // 1 展开父节点，2 展开子节点
};

/* -------------------------- 对象详情 -----------------------------------  */

export interface ExampleDataDto {
  objId: number;
  terminalId: number;
  terminalVersionId: number;
}

export type ExampleDataResponseDto = Array<{
  data: string | Array<any>;
  event_code: string;
  event_name: string;
}>;

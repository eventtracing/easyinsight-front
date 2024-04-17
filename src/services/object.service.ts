import request from "@/utils/request";
import { TagAggreDto, Pagination, Search } from "@/types/common.type";
import {
  GetObjListReq,
  ObjSimpleDto,
  NewObjectReq,
  ObjDetailDto,
  ObjLineageDto,
  ExampleDataDto,
  ExampleDataResponseDto,
} from "@/types/object.type";

export async function getObjList(
  data: GetObjListReq
): Promise<{ tree: any[]; objInfoMap: any; spmsToExpand: any[] }> {
  return request.get("/eis/v2/obj/list", { params: data });
}

export async function getObjFilterAggre(): Promise<{
  types: TagAggreDto[];
  terminals: TagAggreDto[];
  releases: Array<TagAggreDto & { associatedKey: string }>;
  tags: TagAggreDto[];
}> {
  return request.get("/eis/v2/obj/aggregate");
}

// 返回不包含自身的其他所有对象集合，用于血缘配置关联父对象
export async function getAllObject(params: {
  terminalIds: number[];
  requireIds?: number[];
  reqPoolId?: number;
  id?: number;
}): Promise<ObjSimpleDto[]> {
  return request.get("/eis/v2/obj/candidate/parents/get", { params: params });
}

export async function addNewObject(data: NewObjectReq) {
  return request.post("/eis/v2/obj/create", data, { handleError: false });
}

// 获取对象详情
export async function getHistoryObjectDetail(params: {
  objId: number;
  historyId?: number;
  reqPoolId?: number;
}): Promise<ObjDetailDto> {
  return request.get("/eis/v2/obj/get", { params });
}

// 获取基线对象详情
export async function getBaseLineDiff(params: {
  objId: number;
  historyId?: number;
  reqPoolId?: number;
}): Promise<ObjDetailDto> {
  return request.get("/eis/v2/obj/getBaseLineDiff", { params });
}

// 获取对象diff详情
export async function getByReqPoolIdWithDiff(params: {
  objId: number;
  reqPoolId: number;
}): Promise<ObjDetailDto> {
  return request.get("/eis/v2/obj/getByReqPoolIdWithDiff", { params });
}

// 获取对象diff详情
export async function getByReqPoolIdAndHistoryIdWithDiff(params: {
  objId: number;
  historyId: number;
  reqPoolId: number;
}): Promise<ObjDetailDto> {
  return request.get("/eis/v2/obj/getByReqPoolIdAndHistoryIdWithDiff", {
    params,
  });
}

// 点击变更获取详情
export async function getChangeDetail(params: {
  objId: number;
  historyId?: number;
}): Promise<ObjDetailDto> {
  return request.get("/eis/v2/obj/get/for/change", { params });
}

// 对象编辑
export async function updateObject(data: any) {
  return request.post("/eis/v2/obj/edit", data, { handleError: false });
}

// 变更对象
export async function changeObject(data: any) {
  return request.post("/eis/v2/obj/change", data, { handleError: false });
}

// 基础信息编辑
export async function UpdateBasicsInfo(data: any) {
  return request.post("/eis/v2/obj/basic/edit", data, { handleError: false });
}

// 获取对象树
export async function getObjTreeList(
  params: Pagination &
    Search & {
      terminalId: number;
      reqPoolId: number;
    }
) {
  return request.get("/eis/v2/obj/base/tree", { params });
}

// 获取需求组下对象埋点的血缘（需求详情-埋点方案）
export async function getObjTrackerLineage(
  params: Record<"objId" | "terminalId" | "reqPoolId", number>
): Promise<{ tree: any; objInfoMap: any }> {
  return request.get("/eis/v2/obj/req/graph/get", { params });
}

// 获取已上线对象埋点的血缘（需求详情-埋点方案）
export async function getOnlineObjTrackerLineage(
  params: Record<"objId" | "releaseId", number> & { terminalId?: number }
): Promise<ObjLineageDto> {
  return request.get("/eis/v2/obj/released/graph/get", { params });
}

// 获取单个对象的终端和版本可选集合（用于对象血缘处筛选）
export async function getSingleObjFilterAggre(
  objId: number,
  reqPoolId: number
): Promise<{ terminal: TagAggreDto }[]> {
  return request.get(
    `/eis/v2/obj/cascade/aggregate?objId=${objId}&reqPoolId=${reqPoolId}`
  );
}

// 获取对象样例数据
export function getObjectRecordData(
  conditions: Omit<ExampleDataDto, "terminalVersionId"> & {
    releaseId: number | string;
  }
): Promise<ExampleDataResponseDto> {
  return request.get("/eis/v2/obj/example/data/get", { params: conditions });
}

// 获取对象历史发布数据
export function getObjectHistoryList(params: {
  terminalId: number;
  objId: number;
}) {
  return request.get("/eis/v2/obj/release/history/get", { params });
}

// 获取拷贝数据
export function getCopyData(params: {
  reqPoolId: number;
  objId: number;
  historyId?: number;
}) {
  return request.get("/eis/v2/obj/code-copy/get", { params });
}

// 批量复用开发
export function reuseObj(params) {
  return request.post("/eis/v2/obj/batch/change", params);
}

// 获取可复制参数的类型
export function getCopyTypes(): Promise<string> {
  return request.get("/eis/v2/obj/code-copy/types");
}

// 获取SPM
export function getSpm(spmByObjId) {
  return request.post("/eis/reqDesign/spm", { spmByObjId });
}

// 新老埋点映射查询
export function getOldOidMapDetail(data): Promise<{
  trackerId: number;
  spm: string;
  spmOldList: string[];
}> {
  return request.post("/et/v1/spm/mappingItem/get", data);
}

// 新老埋点映射保存
export function saveOldOidMap(data): Promise<boolean> {
  return request.post("/et/v1/spm/mappingItem/create", data);
}

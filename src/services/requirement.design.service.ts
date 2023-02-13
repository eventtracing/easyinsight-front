import request from "@/utils/request";
import type { StatDto } from "@/types/requirement.design.type";

// 需求对象列表
export function getRequirementObject(
  params: Partial<{
    reqPoolId: any;
    order: string;
    rule: boolean;
    searchStr: string;
  }>
) {
  return request.get("/eis/reqDesign/objs", { params });
}

// 待开发待下线对象列表
export function getRequirementPendingObject(
  params: Partial<{
    reqPoolId: any;
    reqPoolType: number;
    showCompleteTree: boolean;
  }>
) {
  return request.get("/eis/reqDesign/spmTrees", { params });
}

// 待办统计
export function getRequirementStat(id): Promise<StatDto> {
  return request.get("/eis/reqDesign/stat", { params: { id } });
}

// 指派任务的列表
export function getTerminalTask(params: {
  assignEntities: {
    id: number;
    poolType: 1 | 2 | 3;
  }[];
  reqPoolId: string;
  syncAllTerminal: boolean;
}) {
  return request.post("/eis/reqDesign/assignAggre", params);
}
// 指派任务
export function setTaskOrigin(data: {
  assignEntities: {
    id: number;
    poolType: 1 | 2 | 3;
  }[];
  taskIds: number[];
  syncAllTerminal: boolean;
  reqPoolId: any;
}) {
  return request.post("/eis/reqDesign/assign", data);
}

// 取消事件的指派
export function cancelTaskOrigin(taskIds: number[]) {
  return request.post("/eis/reqDesign/cancleAssign", { ids: taskIds });
}
// 取消对象的指派
export function cancelObjOrigin(
  params: { reqPoolId: any; taskId: any; spmByObjId: any }[]
) {
  return request.post("/eis/reqDesign/spm/cancleAssign", params);
}
// 事件待办删除
export function deletePendEvent(id: number): Promise<boolean> {
  return request.get("/eis/reqDesign/eventpool/delete", {
    params: { id },
  });
}

// 删除对象
export function deleteObject(objId: number, reqPoolId: string | number) {
  return request.get("/eis/reqDesign/objpool/delete", {
    params: { objId, reqPoolId },
  });
}

// 任务列表
export function getReqTasks(reqPoolId) {
  return request.get("/eis/reqDesign/tasks", { params: { reqPoolId } });
}
// 全量任务列表
export function getReqTasksFull(reqPoolId) {
  return request.get("/eis/reqDesign/tasks/full", { params: { reqPoolId } });
}

// 基线列表
export function getBaseLineList(reqPoolId) {
  return request.get("/eis/reqDesign/rebaseView", { params: { reqPoolId } });
}

// 基线历史列表
export function getBaseLineHistoryList(reqPoolId, terminalId) {
  return request.get("/eis/reqDesign/rebaseHistory", {
    params: { reqPoolId, terminalId },
  });
}

// 发布基线
export function publishBaseLine(data: {
  reqPoolId: string;
  details: {
    terminalId: number;
    newReleaseId: number;
  }[];
}) {
  return request.post("/eis/reqDesign/rebase", data);
}

// 是否可以编辑需求设计
export function hasEditAuth(reqPoolId) {
  return request.get("/eis/reqDesign/editable", { params: { reqPoolId } });
}

// new取消指派
export function cancelOrigin(params) {
  return request.post("/eis/reqDesign/cancleAssignBatch", params);
}

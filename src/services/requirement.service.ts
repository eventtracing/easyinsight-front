import request from "@/utils/request";
import { PaginationList } from "@/types/common.type";
import {
  TaskParamsDto,
  DeliverTaskAndObjectReq,
  RequirementGroupParams,
  RequirementGroupRes,
  OptionRequirementDto,
  TaskAggreDto,
  NewRequirementDto,
  NewTaskDto,
  TaskResponseDto,
} from "@/types/requirement.type";
import type { FilterDto } from "@/types/app.type";

//  获取测试List
export async function getTestList(taskId) {
  return request.post("/realtime/test/task/history", taskId);
}

// 获取qrCodeId
export async function getQrcodeId(status: number, appId: string) {
  return request.post("/realtime/test/history/save", { status, appId });
}

// 需求组列表
export function getRequirementGroup(
  params: Partial<RequirementGroupParams>,
  search: string
): Promise<RequirementGroupRes[]> {
  return request.get("/eis/reqPool/query", { params: { search, ...params } });
}

export function getRequirementFilterMap(): Promise<{
  dataOwners: FilterDto[];
  creators: FilterDto[];
}> {
  return request.get("/eis/reqPool/searchAggre");
}

// 新增需求组
export function addRequirementGroup(params: {
  name: string;
  owners: string[];
  desc: string;
}): Promise<boolean> {
  return request.post("/eis/reqPool/create", params);
}

// 编辑需求组
export function editRequirementGroup(params: {
  id: number;
  name: string;
  owners: string[];
  desc: string;
}): Promise<boolean> {
  return request.post("/eis/reqPool/edit", params);
}

// 删除需求组
export function removeRequirementGroup(id: number): Promise<boolean> {
  return request.get("/eis/reqPool/delete", { params: { id } });
}

// 查看需求组
export function getRequirementGroupDetail(id) {
  return request.get("/eis/reqPool/editView", { params: { id } });
}

// 删除需求
export function removeRequirement(id: number): Promise<boolean> {
  return request.get("/eis/reqPool/req/delete", { params: { id } });
}

// 往需求组里添加新需求
export function addRequirement(params: OptionRequirementDto): Promise<boolean> {
  return request.post("/eis/reqPool/addReq", params);
}

// 获取需求详情
export function getRequirmentDetail(id): Promise<{
  reqInfo: NewRequirementDto;
  tasks: NewTaskDto[];
}> {
  return request.get("/eis/reqPool/req/editView", { params: { id } });
}

// 编辑需求
export function editRequirement(
  params: OptionRequirementDto
): Promise<boolean> {
  return request.post("/eis/reqPool/req/edit", params);
}

// 分页获取 task list
export async function getTaskList(
  data: TaskParamsDto
): Promise<PaginationList<TaskResponseDto>> {
  return request.post("/eis/task/list", data, { supportCancel: true });
}

// 分页获取全量 task list
export async function getTaskListFull(
  data: TaskParamsDto
): Promise<PaginationList<TaskResponseDto>> {
  return request.post("/eis/task/list/full", data, { supportCancel: true });
}

export async function batchDeliverTaskAndObject(data: DeliverTaskAndObjectReq) {
  return request.post("/eis/task/deliverBatch", data, { handleError: false });
}

// 设置版本号
export function setVersion(params: {
  taskId: number[];
  terminalVersion: string;
}): Promise<boolean> {
  return request.get("/eis/task/setTerminalVersion", { params });
}

// 需求任务下拉数据聚合
export function getTaskOptions(): Promise<TaskAggreDto> {
  return request.get("/eis/task/aggre");
}

// 任务下的关联数据列表
export function getTaskRelateObject(
  params: Partial<
    Record<"taskId" | "status", number> &
      Record<"owner" | "verifier" | "objSearch", string>
  >
) {
  return request.post("/eis/task/processView", params);
}

// 任务前进
export function forwardTask(
  id: number,
  code?: number | null,
  comment?: string
) {
  return request.get("/eis/task/forward", { params: { id, code, comment } });
}

// 任务后退
export function backTask(id: number) {
  return request.get("/eis/task/backward", { params: { id } });
}

// 任务关联对象前进
export function forwardTaskData(id: number) {
  return request.get("/eis/task/process/forward", { params: { id } });
}

// 任务关联对象后退
export function backTaskData(id: number) {
  return request.get("/eis/task/process/backward", { params: { id } });
}

// 批量任务驳回
export async function batchRejectTask(processIds, taskIds, targetStatus) {
  return request.post("/eis/task/backwardBatch", {
    processIds,
    taskIds,
    targetStatus,
  });
}

// 批量任务下一步
export async function batchGoNextTask(processIds, taskIds) {
  return request.post("/eis/task/forwardBatch", { processIds, taskIds });
}

// 设置迭代
export async function setSprint(
  taskId: number,
  sprint: string
): Promise<boolean> {
  return request.get("/eis/task/setSprint", {
    params: { taskId, sprint },
  });
}

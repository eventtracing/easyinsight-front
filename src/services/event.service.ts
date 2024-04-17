import request from "@/utils/request";
import { PaginationList } from "@/types/common.type";
import {
  GetEventListReq,
  EventSimpleDto,
  NewEventReq,
} from "@/types/event.type";

export async function getEventList(
  params: GetEventListReq
): Promise<PaginationList<EventSimpleDto>> {
  return request.get("/et/v1/event/list", { params });
}

export async function deleteEvent(id: number) {
  return request.delete(`/et/v1/event/delete?id=${id}`, { handleError: false });
}

export async function addNewEvent(data: NewEventReq) {
  return request.post("/et/v1/event/create", data, { handleError: false });
}

export async function updateEvent(data: NewEventReq & { id: number }) {
  return request.put("/et/v1/event/edit", data, { handleError: false });
}

export async function getEventDetail(id: number): Promise<EventSimpleDto> {
  return request.get(`/et/v1/event/get?id=${id}`);
}

export function getEventsFilter() {
  return request.get("/eis/v2/event/pool/released/aggregate/get");
}

// 获取事件列表
export function getEventLists(params: {
  terminalId: string;
  releaseId: string;
  search: string;
}) {
  return request.get("/eis/v2/event/pool/released/list", { params });
}

// 获取事件列表
export function getPoolReleaseList() {
  return request.get("/eis/v2/event/pool/released/aggregation/get");
}

// 创建事件埋点
export function createEventTracker(params) {
  return request.post("/eis/v2/event/pool/create", params);
}

// 删除事件埋点
export function removeEventTracker(reqPoolEventId: number) {
  return request.get("/eis/v2/event/pool/delete", {
    params: { reqPoolEventId },
  });
}

// 事件历史埋点
export function getHistoryEventList(eventBuryPointId: number) {
  return request.get("/eis/v2/event/pool/released/history/get", {
    params: { eventBuryPointId },
  });
}

// 获取需求组下事件埋点列表
export function getReqEventList(reqPoolId: string) {
  return request.get("/eis/v2/event/pool/list", { params: { reqPoolId } });
}

// 获取事件详情
export function getReqEventDetail(eventBuryPointId: number) {
  return request.get("/eis/v2/event/pool/released/get", {
    params: { eventBuryPointId },
  });
}

// 编辑事件埋点
export function editReqEvent(data) {
  return request.post("/eis/v2/event/pool/edit", data);
}

// 事件样例数据
export function getExampleData(params: { eventBuryPointId: number }) {
  return request.get("/eis/v2/event/pool/released/example/data/get", {
    params,
  });
}

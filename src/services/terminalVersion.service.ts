import request from "@/utils/request";

// 查看产品各端前置版本列表
export async function getPreTerminalVersion(reqPoolId: number): Promise<
  {
    terminalId: number;
    terminalVersionId: number;
    terminalName: string;
    terminalVersionName: string;
    baseReleaseId: string;
  }[]
> {
  return request.get("/eis/v2/obj/base/version/get", { params: { reqPoolId } });
}

// 有端版本
export function getVersionList(params) {
  return request.get("/eis/v2/release/aggregate/tasks/get", { params });
}

// 无端版本
export function getNoVersionList(params) {
  return request.get("/eis/v2/release/tasks/get", { params });
}

// 历史列表
export function getHistoryList(params: {
  terminalId: number | string;
  ascend: boolean;
}) {
  return request.get("/eis/v2/release/tasks/history/get", { params });
}

// 发布端版本上线
export function publishVersion(data: {
  terminalId: string | number;
  terminalVersionId: number;
  taskIds: number[];
}) {
  return request.post("/eis/v2/release/releaseByVersion", data);
}

// 发布任务上线
export function publishTaskVersion(params: {
  taskId: number;
  terminalId: string | number;
}) {
  return request.get("/eis/v2/release/releaseByTask", { params });
}

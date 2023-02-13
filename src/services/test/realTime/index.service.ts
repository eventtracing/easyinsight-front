import request from "@/utils/request";
import type { StatisticsDto, LogInfoDto } from "@/types/realtime.type";

export function getClientBasicInfo(data): Promise<any> {
  return request.get("/processor/realtime/exam/basicinfo/client", {
    params: data,
  });
}

export function clearRule(conversation): Promise<any> {
  // 清空规则
  return request.delete(
    `/processor/realtime/exam/clear/log?conversation=${conversation}`,
    {
      handleError: false,
    }
  );
}

export function sendMetaInfo(data): Promise<any> {
  let queryString = "";
  Object.keys(data).forEach((key) => {
    const value = data[key];
    queryString += `${key}=${value}&`;
  });

  return request.post(`/processor/realtime/test/set/metaInfo?${queryString}`);
}

export function getLogInfo(data): Promise<LogInfoDto> {
  return request.get(`/processor/realtime/test/query/data`, {
    params: data,
  });
}

export function getStatistics(data): Promise<StatisticsDto> {
  return request.get("/processor/realtime/test/statistics", { params: data });
}

export function stopLiveTest(data): Promise<StatisticsDto> {
  return request.get("/processor/realtime/test/upload/end", { params: data });
}

export function setLiveTestQueryParams(data): Promise<any> {
  return request.post("/processor/realtime/test/set/userInfo", data);
}

export function setSnapshot(data): Promise<any> {
  return request.post("/processor/realtime/test/set/snapshot", data);
}

// 筛选字典
export function getRealTimeConfig(): Promise<any> {
  return request.get("/et/v1/realtime/aggre");
}

export function getLists(data): Promise<any> {
  return request.post("/et/v1/realtime/list", data);
}

export function getTestObject(data) {
  return request.get("/et/v1/realtime/relobjlevel", {
    params: data,
  });
}

// 校验规则
export function validateRealTime(data): Promise<any> {
  return request.post("/et/v1/realtime/validate", data);
}

export function getTaskTree(params): Promise<any> {
  return request.get("/et/v1/realtime/reqTree", { params });
}
export function getBaseTree(params): Promise<any> {
  return request.get("/et/v1/realtime/baseTree", { params }).then((res) => {
    return res.roots || [];
  });
}

// 保存规则
export function saveRule(data): Promise<any> {
  return request.post(`/et/v1/realtime/validate/save`, data);
}

// 删除规则
export function cancelSaveRule(id): Promise<any> {
  return request.delete(
    `/et/v1/realtime/validate/cancel?checkHistoryId=${id}`,
    {
      handleError: false,
    }
  );
}

export function getHistoryAggre(data): Promise<any> {
  return request.get("/et/v1/realtime/checkresult/aggre", {
    params: data,
  });
}

export function getHistoryList(data): Promise<any> {
  return request.post("/et/v1/realtime/checkresult/list", data);
}

export function getQueryHistoryList(data): Promise<any> {
  return request.post("/et/v1/realtime/query/checkresult/list", data);
}

export function deleteRecordHistory(data): Promise<any> {
  return request.post("/et/v1/realtime/checkresult/delete", data);
}

// 分支覆盖忽略
export function ignoreCheck(data): Promise<{
  spm: string;
  eventCode: string;
  paramCode: string;
  paramValue: string;
}> {
  return request.post("/et/v1/realtime/branchCover/ignore", data);
}

export function getTheData(data): Promise<any> {
  return request.post("/eis/task/processView", data);
}

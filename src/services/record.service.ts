import request from "@/utils/request";

// 获取测试需求
export function getAllRequire() {
  return request.get("/eis/reqPool/query/all");
}

export function getRecordList(data) {
  return request.post("/realtime/test/history/search", data);
}

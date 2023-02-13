import request from "@/utils/request";

// 获取用户权限菜单列表
export function getAppManagers(appId): Promise<any> {
  return request.get("/et/v1/auth/user/managers", { params: { appId } });
}

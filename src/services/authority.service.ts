import request from "@/utils/request";
import { UserDto, RoleDto, DomainDetailVo } from "../types/authority.type";

type PageDataType = {
  list: UserDto[];
  pageNum: number;
  totalNum: number;
};

// 产品增加
export function addApp(data) {
  return request.post("/eis/v1/app/create", data);
}

// 产品列表
export function appList(data) {
  return request.get("/eis/v1/app/list", { params: data });
}

// 产品编辑
export function editApp(data) {
  return request.put("/eis/v1/app/edit", data);
}

// 产品详情
export function getAppDetail(data) {
  return request.get("/eis/v1/app/get", data);
}

// 产品删除
export function removeApp(id) {
  return request.delete("/eis/v1/app/delete?id=" + id);
}

// 获取用户列表
export function getUserLists(params): Promise<PageDataType> {
  return request.get("/et/v1/auth/user/base/page", { params });
}

// 新增成员
export function addUser(data): Promise<boolean> {
  return request.post("/et/v1/auth/user/create", data);
}

// 编辑成员
export function editUser(data): Promise<boolean> {
  return request.post("/et/v1/auth/user/base/update", {
    location: window.localStorage.domainId,
    range: 1,
    ...data,
  });
}

// 删除成员
export function removeUser(data): Promise<boolean> {
  return request.post("/et/v1/auth/user/remove", {
    location: window.localStorage.domainId,
    range: 1,
    ...data,
  });
}

// 获取角色列表
export function getRoleLists(data): Promise<RoleDto[]> {
  return request.get("/et/v1/auth/role/list", { params: data });
}

// 删除角色
export function removeRole(data): Promise<boolean> {
  return request.post("/et/v1/auth/user/remove", data);
}

// 更新角色
export function editRole(data): Promise<boolean> {
  return request.post("/et/v1/auth/role/update", data);
}

// 域详情
export function getDomainDetail(data): Promise<DomainDetailVo> {
  return request.get("/eis/v1/domain/get", { params: data });
}

// 获取成员列表
export function getAppUserLists() {
  return request.get("/et/v1/auth/user/list", {
    params: { range: 1, location: window.localStorage.domainId },
  });
}

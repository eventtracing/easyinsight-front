import request from "@/utils/request";

export function getAppInfo(data): Promise<any> {
  return request.get("/eis/v1/app/get", {
    params: data,
  });
}

export function getUserList() {
  return request.get("/eis/v1/user/getall");
}

export function getAuthUserList(params): Promise<any> {
  return request.get("/et/v1/auth/user/base/page", { params });
}

export function updateAuthUser(data): Promise<any> {
  return request.post("/et/v1/auth/user/base/update", data);
}

export function createAuthUser(data): Promise<any> {
  return request.post("/et/v1/auth/user/create", data);
}

export function removeAuthUser(data): Promise<any> {
  return request.post("/et/v1/auth/user/remove", data);
}

export function getAuthRoleList(params): Promise<any> {
  return request.get("/et/v1/auth/role/list", { params });
}

export function createAuthRole(data): Promise<any> {
  return request.post("/et/v1/auth/role/create", data);
}

export function updateAuthRole(data): Promise<any> {
  return request.post("/et/v1/auth/role/update", data);
}

export function deleteAuthRole(data): Promise<any> {
  return request.post("/et/v1/auth/role/delete", data);
}

export function getAuthMenuList(data) {
  return request.get("/et/v1/auth/menu/list", {
    params: data,
  });
}

export function assignAuthRole(data): Promise<any> {
  return request.post("/et/v1/auth/role/assign", data);
}

export function getDomainList(params) {
  return request.get("/eis/v1/domain/list", { params });
}

export function createDomain(data): Promise<any> {
  return request.post("/eis/v1/domain/create", data);
}

export function deleteDomain(id) {
  return request.delete(`/eis/v1/domain/delete?id=${id}`);
}

export function editDomain(data) {
  return request.put("/eis/v1/domain/edit", data);
}

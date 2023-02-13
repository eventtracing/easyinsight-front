import request from "@/utils/request";
import {
  VersionDto,
  GetVersionListReq,
  NewVersionReq,
  DelVersionReq,
  UpdateVersionBindsReq,
  CopyVersionReq,
} from "@/types/version.type";
import { ParamBindItemDto } from "@/types/template.type";

// 获取版本绑定的参数列表
export async function getVersionParamDetail(
  params: DelVersionReq
): Promise<Omit<ParamBindItemDto, "uuid" | "names">[]> {
  return request.get("/et/v1/parambind/get", { params });
}

// 更新版本名称及绑定参数列表
export async function updateVersionParam(data: UpdateVersionBindsReq) {
  return request.put("/et/v1/parambind/edit", data, { handleError: false });
}

// 创建、复制新的参数版本
export async function copyVersion(data: CopyVersionReq) {
  return request.post("/et/v1/parambind/copy", data, { handleError: false });
}

export async function getVersionList(
  params: Partial<GetVersionListReq>
): Promise<VersionDto[]> {
  return request.get("/et/v1/version/list", { params });
}

export async function addNewVersion(data: NewVersionReq): Promise<number> {
  return request.post("/et/v1/version/create", data, { handleError: false });
}

export async function deleteVersion(params: DelVersionReq) {
  return request.delete("/et/v1/version/delete", {
    params,
    handleError: false,
  });
}

export async function setCurrentVersion(data: DelVersionReq) {
  return request.put("/et/v1/version/setusing", data, { handleError: false });
}

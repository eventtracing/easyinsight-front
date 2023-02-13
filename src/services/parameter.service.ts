import request from "@/utils/request";
import { PaginationList, TagAggreDto } from "@/types/common.type";
import {
  ParamTypeEnum,
  GetParameterListReq,
  ParameterDto,
  ParamPoolItemDto,
  GetBusinessParameListReq,
  BusinessPrivateParamDto,
  NewParamReq,
  ParameterDetailDto,
  BusinessPrivateParamDetailDto,
  ParamListItemObj,
  ParamValueDto,
  VariableParamReq,
} from "@/types/parameter.type";

// 全量获取参数
export async function getAllParamList(
  paramTypes: ParamTypeEnum[],
  search = ""
): Promise<ParamListItemObj[]> {
  return request.get(`/et/v1/param/listAll`, {
    params: { search, paramTypes },
  });
}

// 获取业务私参code列表
export async function getBusinessParamPool(
  search: string
): Promise<ParamPoolItemDto[]> {
  return request.get(
    `/et/v1/param/obj_business_private/pool/list?search=${search}`
  );
}

export async function getAllBusinessParamPool(search: string): Promise<any> {
  return request.get(
    `/et/v1/param/obj_business_private/pool/list_with_param?search=${search}`
  );
}

// 创建业务私参
export async function addNewBusinessParamPoolItem(code: string) {
  const path = "/et/v1/param/obj_business_private/pool/create";

  return request.post(path, { code }, { handleError: false });
}

// 删除业务私参
export async function deleteBusinessParamPoolItem(id: number) {
  return request.delete(
    `/et/v1/param/obj_business_private/pool/delete?id=${id}`,
    {
      handleError: false,
    }
  );
}

// 编辑业务私参
export async function editBusinessParamPoolItem(id: number, code: string) {
  return request.put(`/et/v1/param/obj_business_private/pool/edit`, {
    id,
    code,
  });
}

// 根据code获取业务私参含义列表
export async function getBusinessParamList(
  params: GetBusinessParameListReq
): Promise<PaginationList<BusinessPrivateParamDto>> {
  return request.get(`/et/v1/param/obj_business_private/list`, { params });
}

// 创建对象业务私参含义项
export async function addNewBusinessParam(
  data: Omit<NewParamReq, "paramType">
) {
  return request.post("/et/v1/param/obj_business_private/create", data, {
    handleError: false,
  });
}

// 编辑对象业务私参含义项
export async function updateBusinessParam(data: NewParamReq & { id: number }) {
  return request.put("/et/v1/param/obj_business_private/edit", data, {
    handleError: false,
  });
}

// 获取对象业务私参含义项详情
export async function getBusinessParamDetail(
  id: number
): Promise<BusinessPrivateParamDetailDto> {
  return request.get(`/et/v1/param/obj_business_private/get?id=${id}`);
}

// 删除对象业务私参含义项
export async function deleteBusinessParam(id: number) {
  return request.delete(`/et/v1/param/obj_business_private/delete?id=${id}`, {
    handleError: false,
  });
}

// 获取全局公参、事件公参、对象标准私参列表
export async function getParameterList(
  params: GetParameterListReq
): Promise<PaginationList<ParameterDto>> {
  return request.get("/et/v1/param/list", {
    params,
    supportCancel: true,
  });
}

// 创建全局公参、事件公参、对象标准私参
export async function addNewParam(data: NewParamReq) {
  return request.post("/et/v1/param/create", data, { handleError: false });
}

// 编辑全局公参、事件公参、对象标准私参
export async function updateParam(data: NewParamReq & { id: number }) {
  return request.put("/et/v1/param/edit", data, { handleError: false });
}

// 获取全局公参、事件公参、对象标准私参详情
export async function getParamDetail(id: number): Promise<ParameterDetailDto> {
  return request.get(`/et/v1/param/get?id=${id}`);
}

// 删除全局公参、事件公参、对象标准私参
export async function deleteParam(id: number) {
  return request.delete(`/et/v1/param/delete?id=${id}`, { handleError: false });
}

// 设置参数取值集合
export function getVariableParamSelect(): Promise<VariableParamReq[]> {
  return request.get("/et/v1/param/ruletemplate/get");
}

// 获取参数列表（创建人）聚合项，用于筛选
export async function getParamFilterAggre(
  paramType: ParamTypeEnum,
  code?: string,
  aggreTypes = [1]
): Promise<{ creators: TagAggreDto[] }> {
  return request.get("/et/v1/param/aggre", {
    params: { paramType, code, aggreTypes },
  });
}

// 添加规则
export async function addRuleTemplate(data: { name: string; rule: string }) {
  return request.post("/et/v1/param/ruletemplate/add", data, {
    handleError: false,
  });
}

// 删除规则
export async function deleteRuleTemplate(id: number) {
  return request.get("/et/v1/param/ruletemplate/delete", {
    params: { id },
  });
}

// 设置参数取值集合
export async function setParamValue(
  paramId: number,
  values: {
    // 有id表示修改，无id表示新增
    id?: number;
    code: string;
    name: string;
    description: string;
  }[]
) {
  return request.put(
    "/et/v1/paramvalue/edit",
    { paramId, values },
    { handleError: false }
  );
}

// 获取参数的取值集合
export async function getParamValues(
  paramId: number,
  search = ""
): Promise<ParamValueDto[]> {
  return request.get("/et/v1/paramvalue/list", { params: { paramId, search } });
}

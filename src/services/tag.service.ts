import request from "@/utils/request";
import {
  Pagination,
  Search,
  PaginationList,
  ItemDto,
} from "@/types/common.type";

// 获取标签列表
export async function getTagList(
  params: Pagination & Search & { type: number }
): Promise<PaginationList<ItemDto>> {
  return request.get("/et/v1/tag/list", { params: { type: 1, ...params } });
}

// 创建标签
export async function createTag(name: string, type = 1): Promise<number> {
  return request.post("/et/v1/tag/create", { type, name });
}

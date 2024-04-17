import request from "@/utils/request";
import { AppDto } from "@/types/app.type";
import { User } from "@/types/common.type";

// 获取用户权限菜单列表
export function getAuthorMenu(userEmail): Promise<any> {
  return request.get("/et/v1/auth/menu/authorized/list", {
    params: { userEmail },
  });
}

// 获取用户可选产品
export async function getAppList(): Promise<AppDto[]> {
  return request.get("/eis/v1/domain/getByEmail", { useToken: true });
}

// 获取该产品下所有成员
export async function getAllUsers(): Promise<User[]> {
  return request.get("/eis/v1/user/getall");
}

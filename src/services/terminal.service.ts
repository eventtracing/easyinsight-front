import request from "@/utils/request";
import { PaginationList } from "@/types/common.type";
import {
  GetTerminalListReq,
  TerminalSimpleDto,
  NewTerminalReq,
} from "@/types/terminal.type";

export async function getTerminalList(
  data: GetTerminalListReq
): Promise<PaginationList<TerminalSimpleDto>> {
  return request.post("/et/v1/terminal/list", data);
}

export async function deleteTerminal(id: number) {
  return request.delete(`/et/v1/terminal/delete?id=${id}`, {
    handleError: false,
  });
}

export async function addNewTerminal(data: NewTerminalReq) {
  return request.post("/et/v1/terminal/create", data, { handleError: false });
}

export async function updateTerminal(data: NewTerminalReq & { id: number }) {
  return request.put("/et/v1/terminal/edit", data, { handleError: false });
}

export async function getTerminalDetail(
  id: number
): Promise<TerminalSimpleDto> {
  return request.get(`/et/v1/terminal/get?id=${id}`);
}

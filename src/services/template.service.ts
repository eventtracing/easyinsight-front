import request from '@/utils/request'
import { PaginationList } from '@/types/common.type'
import {
  TemplateSimpleDto,
  GetTemplateListReq,
  NewTemplateReq,
  TemplateDetailDto
} from '@/types/template.type'

export async function getTempalteList(
  params: GetTemplateListReq
): Promise<PaginationList<TemplateSimpleDto>> {
  return request.get('/et/v1/template/list', { params, supportCancel: true })
}

export async function deleteTemplate(id: number) {
  return request.delete(`/et/v1/template/delete?id=${id}`, {
    handleError: false
  })
}

export async function addNewTemplate(data: NewTemplateReq) {
  return request.post('/et/v1/template/create', data, { handleError: false })
}

export async function updateTemplate(data: NewTemplateReq & { id: number }) {
  return request.put('/et/v1/template/edit', data, { handleError: false })
}

export async function getTemplateDetail(id: number): Promise<TemplateDetailDto> {
  return request.get(`/et/v1/template/get?id=${id}`)
}

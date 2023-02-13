import { BaseObjectDto, Pagination, Order, Search } from './common.type'
import { ObjTypeEnum } from './object.type'

export type EventSimpleDto = BaseObjectDto & {
  selectedByDefault: boolean // 是否默认选中
  applicableObjTypes: ObjTypeEnum[]
}

/** ----------------------------- Requst Parameter Type -------------------------- */

export type GetEventListReq = Pagination & Partial<Order> & Search

export type NewEventReq = {
  code: string
  name: string
  description: string
  selectedByDefault: boolean // 是否默认选中
  applicableObjTypes: ObjTypeEnum[]
}

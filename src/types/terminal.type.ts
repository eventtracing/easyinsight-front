import { BaseObjectDto, Pagination, Order, Search } from './common.type'

export enum TerminalTypeEnum {
  PC = 1,
  WIRELESS = 2, // 无线
  SERVER = 3 // 服务端
}

export const terminalTypeNameMap = {
  [TerminalTypeEnum.PC]: 'PC',
  [TerminalTypeEnum.WIRELESS]: '客户端',
  [TerminalTypeEnum.SERVER]: '服务端'
}

export type TerminalSimpleDto = BaseObjectDto & {
  type: TerminalTypeEnum
  terminalType?: string
  preset: boolean // 是否是预置信息
}

/** ----------------------------- Requst Parameter Type -------------------------- */

export type GetTerminalListReq = Pagination &
  Partial<Order> &
  Search & {
    terminalTypes?: TerminalTypeEnum[]
  }

export interface NewTerminalReq {
  type: TerminalTypeEnum
  name: string
}

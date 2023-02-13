interface SPMIds {
  spmIds: number[]
}

export interface ConditionDTO {
  terminalId: string | number | null
  isMapped?: boolean
  mapStatus?: number[]
  spmStatus?: number
  tagId?: number
}

export interface SPMListsResponseDTO {
  id: number
  spm: string
  spmOldList: string[]
  name: string
  tags: string
  mapStatus: number
  spmStatus: number
  version: string
  note: string
}

export interface SPMListsRequestDTO extends ConditionDTO {
  spmOldOrMapVersion?: string
  spmOrName?: string
}

export interface OldSPMMapRequestDTO {
  spmId: number
  spmOldList: string[]
  terminalId: number
}

export interface BindSPMTagRequestDTO extends SPMIds {
  tagIds: number[]
  terminalId: number
}

export interface UpdateSPMStatusRequestDTO extends SPMIds {
  status: number
  terminalId: number
}

export interface UpdateSPMVersionRequestDTO extends SPMIds {
  version: string
  terminalId: number
}

export interface UpdateSPMRemarkRequestDTO {
  spmId: number
  note: string
}
export interface CreateSPMRequestDTO {
  spmId?: number
  spm: string
  name: string
  appId: number
  terminalId: number
  spmStatus?: number
  status?: number
}

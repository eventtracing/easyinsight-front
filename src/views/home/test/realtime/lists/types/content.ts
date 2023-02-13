import { TagAggreDto } from '@/types/common.type'

type configKeys = 'requirementName' | 'taskName' | 'status' | 'objType' | 'owner' | 'terminal'

export type configDto = {
  [P in configKeys]: TagAggreDto[]
}

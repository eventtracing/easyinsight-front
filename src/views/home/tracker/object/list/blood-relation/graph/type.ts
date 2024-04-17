import { NodeConfig, EdgeConfig } from '@antv/g6-core/lib/types'

export type CustomNodeConfig = NodeConfig & {
  objType: 'page' | 'element' | 'popover' | 'bridge'
  spaceType: 'otherSpace' | 'currentSpace'
  showName: string
  expandParent: boolean
  expandSon: boolean
  edges: EdgeConfig[]
  terminalId: number
  versionId: number
  naturalWidth?: number
  naturalHeight?: number
}

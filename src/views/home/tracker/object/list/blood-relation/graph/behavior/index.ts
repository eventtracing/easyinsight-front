import G6 from '@antv/g6'
import canvasClick from './click-canvas'
import clickNode from './click-node'
import hoverNode from './hover-node'

const behavors = {
  'click-node': clickNode,
  'click-canvas': canvasClick,
  'hover-node': hoverNode
}

export const initBehaviors = () => {
  for (const key in behavors) {
    G6.registerBehavior(key, behavors[key])
  }
}

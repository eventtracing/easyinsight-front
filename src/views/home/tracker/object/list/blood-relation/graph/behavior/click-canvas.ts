export default {
  getEvents() {
    return {
      'canvas:click': 'onClick'
    }
  },
  onClick() {
    const graph = this.graph
    // 将所有当前是 click 状态的节点置为非 click 状态
    const clickNodes = graph.findAllByState('node', 'click')
    clickNodes.forEach((cn) => {
      graph.setItemState(cn, 'click', false)
    })
    // 将所有当前是 click 状态的边置为非 click 状态
    const clickEdges = graph.findAllByState('edge', 'click')
    clickEdges.forEach((ce) => {
      graph.setItemState(ce, 'click', false)
    })
  }
}

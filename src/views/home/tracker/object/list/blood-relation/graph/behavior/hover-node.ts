import { INode } from "@antv/g6-core/lib/interface/item";

export default {
  getEvents() {
    return {
      "node:mouseover": "onMouseOver",
      "node:mouseleave": "onMouseLeave",
    };
  },
  onMouseOver(e) {
    const graph = this.graph;
    const item: INode = e.item;

    graph.setItemState(item, "hover", true);
  },
  onMouseLeave(e) {
    const graph = this.graph;
    const item: INode = e.item;

    graph.setItemState(item, "hover", false);
  },
};

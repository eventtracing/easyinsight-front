import { INode } from "@antv/g6-core/lib/interface/item";
import { CustomNodeConfig } from "../type";

const startAnchors = ["start-anchor", "start-anchor-icon"];
const endAnchors = ["end-anchor", "end-anchor-icon"];

export default {
  getEvents() {
    return {
      "node:click": "onClick",
    };
  },
  onClick(e) {
    const graph = this.graph;
    const name = e.shape?.cfg?.name;

    if (!startAnchors.concat(endAnchors).includes(name)) return;

    const item: INode = e.item;
    const cfg = item.getModel() as CustomNodeConfig;
    const { id, edges } = cfg;
    const isSource = edges.findIndex((e) => e.source === id) > -1;
    const eventEmitter = graph.eventEmitter;

    if (startAnchors.includes(name)) {
      const args = isSource ? ["fold-node", id] : ["expand-node", id, "son"];

      eventEmitter.emit(...args);
    } else {
      cfg.expandParent && eventEmitter.emit("expand-node", id, "parent");
    }
  },
};

import G6, { IGroup } from "@antv/g6";
import { INode } from "@antv/g6-core/lib/interface/item";
import { CustomNodeConfig } from "../type";
import {
  fittingWrapString,
  getTopSemiCirclePath,
  getBottomSemiCirclePath,
  getBottomMinusPath,
  getTopPlusPath,
  getBottomPlusPath,
} from "../share/util";
import { nodeBgColorMap, nodeBdColorMap } from "../share/color";

export const registerNode = () => {
  const config = {
    draw: (cfg: CustomNodeConfig, group) => {
      const rect = group.addShape("rect", {
        attrs: {
          stroke: nodeBdColorMap?.[cfg.spaceType],
          fill: nodeBgColorMap?.[cfg.objType],
          lineWidth: 2,
        },
        name: "node-rect",
        draggable: true,
      });
      const text = group.addShape("text", {
        attrs: {
          textAlign: "left",
          textBaseline: "middle",
          text: fittingWrapString(`${cfg.oid}(${cfg.showName})`, 168, 12),
          fill: "#7880A0",
          fontSize: 12,
          lineHeight: 18,
        },
        name: "node-name",
        draggable: true,
      });
      const bbox = text.getBBox();
      // x, y 为节点中心，所以 rect 中心对齐的话，x,y 需为宽高一半
      rect.attr({ width: bbox.width + 16, height: bbox.height + 12 });
      text.attr({ x: 8, y: (bbox.height + 12) / 2 });

      return rect;
    },
    afterDraw(cfg: CustomNodeConfig, group: IGroup) {
      this.updateAnchors(cfg, group);
    },
    afterUpdate(cfg: CustomNodeConfig, item: INode) {
      const group = item.getContainer();
      const rect = item.getKeyShape();
      const text = group.find((e) => e.cfg.name === "node-name");
      const bbox = text.getBBox();

      rect.attr("stroke", nodeBdColorMap?.[cfg.spaceType]);
      rect.attr("fill", nodeBgColorMap?.[cfg.objType]);
      // x, y 为节点中心，所以 rect 中心对齐的话，x,y 需为宽高一半
      rect.attr({ width: bbox.width + 16, height: bbox.height + 12 });

      text.attr({ x: 8, y: (bbox.height + 12) / 2 });
      text.attr(
        "text",
        fittingWrapString(`${cfg.oid}(${cfg.showName})`, 168, 12)
      );

      this.updateAnchors(cfg, group);
    },
    addRightAnchor(group: IGroup, expand = false) {
      if (!expand) return;

      const { maxY, maxX, minY } = group.getBBox();
      const point = { x: maxX, y: (minY + maxY) / 2 };
      const anchorPath = getTopSemiCirclePath(point);
      const endAnchor = group.addShape("path", {
        attrs: {
          path: anchorPath,
          lineWidth: 0,
          fill: "#C4C4C4",
          cursor: expand ? "pointer" : "",
        },
        name: "end-anchor",
      });
      const iconPath = getTopPlusPath(point);

      group.addShape("path", {
        attrs: {
          path: iconPath,
          lineWidth: 0,
          fill: "#fff",
          cursor: "pointer",
        },
        name: "end-anchor-icon",
      });

      return endAnchor;
    },
    addLeftAnchor(group: IGroup, fold = true, readonly = false) {
      if (readonly) return;

      const { minX, maxY, minY } = group.getBBox();
      const point = { x: minX, y: (minY + maxY) / 2 };
      const startAnchorPath = getBottomSemiCirclePath(point);
      const startAnchor = group.addShape("path", {
        attrs: {
          path: startAnchorPath,
          lineWidth: 0,
          fill: "#C4C4C4",
          cursor: "pointer",
        },
        name: "start-anchor",
      });

      const iconPath = fold
        ? getBottomMinusPath(point)
        : getBottomPlusPath(point);

      group.addShape("path", {
        attrs: {
          path: iconPath,
          lineWidth: 0,
          fill: "#fff",
          cursor: "pointer",
        },
        name: "start-anchor-icon",
      });

      return startAnchor;
    },
    clearAnchors(group: IGroup) {
      const anchors = [
        "start-anchor",
        "start-anchor-icon",
        "end-anchor",
        "end-anchor-icon",
      ];
      anchors.forEach((v) => {
        const p = group.find((e) => e.cfg.name === v);

        p && group.removeChild(p);
      });
    },
    updateAnchors(cfg: CustomNodeConfig, group: IGroup) {
      this.clearAnchors(group);
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  };

  G6.registerNode("obj-node", config, "single-node");
};

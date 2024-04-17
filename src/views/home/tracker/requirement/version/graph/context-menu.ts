import G6 from "@antv/g6";
import { Item } from "@antv/g6-core/lib/types";

export const getContextMenu = (eventEmitter) => {
  const nodeContextMenu = new G6.Menu({
    getContent() {
      return `
        <ul>
        <li data-title='set-main-version'>设为主分支</li>
        </ul>
      `;
    },
    handleMenuClick: (target: HTMLElement, item: Item) => {
      const title = target.getAttribute("data-title");

      title === "set-main-version" &&
        eventEmitter.emit("set-main-version", item.getID());
    },
    shouldBegin: (e) => {
      const model: any = e.item?.getModel();

      return model?.canSetMainVersion;
    },
    offsetX: 8,
    offsetY: 8,
    itemTypes: ["node"],
  });
  return [nodeContextMenu];
};

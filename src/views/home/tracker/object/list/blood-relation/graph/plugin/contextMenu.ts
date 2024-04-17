import G6 from "@antv/g6";
import { Item } from "@antv/g6-core/lib/types";

export const getContextMenu = (eventEmitter, supportSwitchCurrent = true) => {
  const nodeContextMenu = new G6.Menu({
    getContent(e) {
      const model = e.item?.getModel();

      return `
        <ul>
          <li data-title='view-detail'>查看对象详情</li>
          ${
            supportSwitchCurrent && model?.objType !== "cur"
              ? "<li data-title='set-current'>切换为当前对象</li>"
              : ""
          }
        </ul>
      `;
    },
    handleMenuClick: (target: HTMLElement, item: Item) => {
      const title = target.getAttribute("data-title");

      title && eventEmitter.emit(title, item?.getModel());
    },
    offsetX: 8,
    offsetY: 8,
    // 在哪些类型的元素上响应
    itemTypes: ["node"],
  });
  return [nodeContextMenu];
};

// @ts-nocheck
import "./v-drag-size.less";

const directions = ["top", "bottom", "left", "right"];

const clear = (el) => {
  if (Array.isArray(el._anchors)) {
    el._anchors.forEach((anchor) => {
      if (anchor._mousedownHandler) {
        anchor.removeEventListener("mousedown", anchor._mousedownHandler);
      }
      delete anchor._mousedownHandler;
    });
  }
  delete el._sizeLimit;
  delete el._dragInfo;
  delete el._anchors;
  delete el._mousemoveHandler;
  delete el._mouseupHandler;
};

export default {
  mounted: (el, { modifiers, value = {} as any }) => {
    clear(el);

    el._sizeLimit = {
      minWidth: value?.minWidth || 0,
      maxWidth: value?.maxWidth || Number.MAX_SAFE_INTEGER,
      minHeight: value?.minHeight || 0,
      maxHeight: value?.maxHeight || Number.MAX_SAFE_INTEGER,
    };

    el._dragInfo = {
      isDragging: false,
      direction: null,
      initialPageX: 0,
      initialPageY: 0,
      initialWidth: 0,
      initialHeight: 0,
    };

    el._anchors = [];

    el._mousemoveHandler = function mousemoveHandler(e: MouseEvent) {
      e.preventDefault();
      if (!el._dragInfo || !el._dragInfo.isDragging) return;

      const { minWidth, maxWidth, minHeight, maxHeight } = el._sizeLimit;
      const {
        direction,
        initialPageX,
        initialPageY,
        initialWidth,
        initialHeight,
      } = el._dragInfo;

      if (direction === "left") {
        requestAnimationFrame(() => {
          const width = initialWidth - (e.pageX - initialPageX);
          if (width >= minWidth && width <= maxWidth) {
            el.style.width = `${width}px`;
          }
        });
      } else if (direction === "right") {
        requestAnimationFrame(() => {
          const width = initialWidth + (e.pageX - initialPageX);
          if (width >= minWidth && width <= maxWidth) {
            el.style.width = `${width}px`;
          }
        });
      } else if (direction === "top") {
        requestAnimationFrame(() => {
          const height = initialHeight - (e.pageY - initialPageY);
          if (height >= minHeight && height <= maxHeight) {
            el.style.height = `${height}px`;
          }
        });
      } else {
        requestAnimationFrame(() => {
          const height = initialHeight + (e.pageY - initialPageY);
          if (height >= minHeight && height <= maxHeight) {
            el.style.height = `${height}px`;
          }
        });
      }
    };

    el._mouseupHandler = function mouseupHandler(e: MouseEvent) {
      e.preventDefault();
      el._dragInfo = {
        isDragging: false,
        direction: null,
        initialPageX: 0,
        initialPageY: 0,
        initialWidth: 0,
        initialHeight: 0,
      };
      document.removeEventListener("mousemove", el._mousemoveHandler);
      document.removeEventListener("mouseup", el._mouseupHandler);
    };

    directions
      .filter((v) => modifiers?.[v])
      .forEach((direction) => {
        const anchor: any = document.createElement("div");
        anchor.setAttribute(
          "class",
          `v-drag-size-anchor v-drag-size-anchor__${direction}`
        );

        anchor._mousedownHandler = function mousedownHandler(e: MouseEvent) {
          e.preventDefault();
          el._dragInfo = {
            isDragging: true,
            direction: direction,
            initialPageX: e.pageX,
            initialPageY: e.pageY,
            initialWidth: el.clientWidth,
            initialHeight: el.clientHeight,
          };

          document.addEventListener("mousemove", el._mousemoveHandler);
          document.addEventListener("mouseup", el._mouseupHandler);
        };

        anchor.addEventListener("mousedown", anchor._mousedownHandler);
        el.appendChild(anchor);
        el._anchors.push(anchor);
      });
  },
  unmounted: (el) => {
    clear(el);
  },
};

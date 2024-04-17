<template>
  <div class="tool-container flex-ac">
    <span class="tool-icon-wrapper" @click="zoomIn">
      <u-icon-button
        iconFont="zoom-in"
        title="放大"
        placement="left"
        class="tool-icon"
      ></u-icon-button>
    </span>
    <span class="tool-icon-wrapper" @click="zoomOut">
      <u-icon-button
        iconFont="zoom-out"
        title="缩小"
        placement="left"
        class="tool-icon"
      ></u-icon-button>
    </span>
    <span class="tool-icon-wrapper" @click="reset">
      <u-icon-button
        iconFont="origin-size"
        title="原始大小"
        placement="left"
        class="tool-icon"
      ></u-icon-button>
    </span>
    <span class="tool-icon-wrapper" @click="fullscreen">
      <u-icon-button
        iconFont="fullscreen"
        title="全屏"
        placement="left"
        class="tool-icon"
      ></u-icon-button>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IGraph } from "@antv/g6";

function getCenter(graph: IGraph) {
  const width = graph.getWidth();
  const height = graph.getHeight();

  return { x: width / 2, y: height / 2 };
}

export default defineComponent({
  name: "ToolBar",
  props: {
    graph: {},
  },
  methods: {
    autoLayout() {
      this.graph.updateLayout({
        type: "dagre",
        rankdir: "TB",
        nodesep: 100,
        ranksep: 40,
        controlPoints: false,
      });

      this.graph.fitCenter();
      this.$nextTick(() => {
        this.graph.updateLayout({ type: "invalid-layout" });
      });
    },

    zoomIn() {
      const currentZoom = this.graph.getZoom();
      const ratioOut = 1 + 0.05 * 5;

      if (ratioOut * currentZoom > 5) return;

      this.graph.zoomTo(currentZoom * 1.1, getCenter(this.graph));
    },

    zoomOut() {
      const currentZoom = this.graph.getZoom();
      const ratioIn = 1 - 0.05 * 5;

      if (ratioIn * currentZoom < 0.3) return;

      this.graph.zoomTo(currentZoom * 0.9, getCenter(this.graph));
    },

    reset() {
      this.graph.zoomTo(1);
      this.graph.fitCenter();
    },

    // 全屏展示
    fullscreen() {
      const el: any = this.graph.cfg.container.parentNode;

      try {
        document.fullscreen
          ? document.exitFullscreen()
          : el.requestFullscreen();
      } catch (err) {
        this.$message.error(err.stack);
      }
    },
  },
});
</script>

<style lang="less" scoped="true">
.tool-container {
  position: absolute;
  right: 16px;
  bottom: 16px;
  flex-direction: column;
  line-height: 1;
  background-color: #e7e9ee;
  z-index: 9;
  padding: 0 4px;
}

.tool-icon-wrapper {
  margin: 6px;
}

.tool-icon {
  color: #777;
  font-size: 20px;
  cursor: pointer;
}
</style>
<style lang="less">
.icon-tooltip {
  .ant-tooltip-inner {
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 4px;
    line-height: 1.2;
    min-height: auto;
  }
}
</style>

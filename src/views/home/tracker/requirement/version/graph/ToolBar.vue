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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IGraph } from "@antv/g6";

function getCenter(graph: IGraph) {
  const x = graph.getWidth() / 2;
  const y = graph.getHeight() / 2;

  return { x, y };
}

export default defineComponent({
  name: "ToolBar",
  props: {
    graph: {},
  },
  methods: {
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
  },
});
</script>

<style lang="less" scoped="true">
.tool-container {
  position: absolute;
  right: 10px;
  bottom: 10px;
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

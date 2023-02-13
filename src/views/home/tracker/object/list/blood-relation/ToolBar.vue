<template>
  <div class="tool-bar flex-ac">
    <span class="text-title">当前操作对象</span>
    <div class="g-ml-24 flex-1 flex-ac">
      <a-dropdown>
        <u-icon-button
          iconFont="add"
          class="g-m-lr-4 tool-icon"
        ></u-icon-button>
        <template #overlay
          ><a-menu @click="onExpandMenuClick">
            <a-menu-item key="son"> 全部子对象 </a-menu-item>
            <a-menu-item key="parent"> 全部父对象 </a-menu-item>
            <a-menu-item key="all"> 全部父子对象 </a-menu-item>
          </a-menu></template
        >
      </a-dropdown>
      <u-divider></u-divider>
      <a-dropdown>
        <u-icon-button
          iconFont="remove_square"
          class="g-m-lr-4 tool-icon"
        ></u-icon-button>
        <template #overlay
          ><a-menu @click="onFoldMenuClick">
            <a-menu-item key="son"> 全部子对象 </a-menu-item>
            <a-menu-item key="parent"> 全部父对象 </a-menu-item>
            <a-menu-item key="all"> 全部父子对象 </a-menu-item>
          </a-menu></template
        >
      </a-dropdown>
    </div>
    <div>
      <u-icon-button
        iconFont="zoom-in"
        title="放大"
        class="g-mr-16 tool-icon"
        @click="zoomIn"
      ></u-icon-button>
      <u-icon-button
        iconFont="zoom-out"
        title="缩小"
        class="g-mr-16 tool-icon"
        @click="zoomOut"
      ></u-icon-button>
      <u-icon-button
        iconFont="fullscreen"
        title="全屏"
        class="g-mr-16 tool-icon"
        @click="fullscreen"
      ></u-icon-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BindOrUnbindSonObjModal from "./BindOrUnbindParentObjModal.vue";
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
    id: {},
    terminalId: {},
    versionId: {},
  },
  methods: {
    onBind() {
      this.$createInstance(BindOrUnbindSonObjModal, {
        id: this.id,
        terminalId: this.terminalId,
        versionId: this.versionId,
        onOk: () => {
          this.$emit("sync");
        },
      });
    },

    onUnbind() {
      this.$createInstance(BindOrUnbindSonObjModal, {
        bind: false,
        id: this.id,
        terminalId: this.terminalId,
        versionId: this.versionId,
        onOk: () => {
          this.$emit("sync");
        },
      });
    },

    // 展开对象拉取接口
    onExpandMenuClick({ key }) {
      const arr =
        key === "all" ? [-1, -1] : key === "parent" ? [-1, 0] : [0, -1];

      this.$emit("setDepth", ...arr);
    },

    // 收起对象
    onFoldMenuClick({ key }) {
      this.$emit("fold", key);
    },

    zoomIn() {
      if (!this.graph) return;

      const currentZoom = this.graph.getZoom();
      const ratioOut = 1 + 0.05 * 5;

      if (ratioOut * currentZoom > 5) return;

      this.graph.zoomTo(currentZoom * 1.1, getCenter(this.graph));
    },

    zoomOut() {
      if (!this.graph) return;

      const currentZoom = this.graph.getZoom();
      const ratioIn = 1 - 0.05 * 5;

      if (ratioIn * currentZoom < 0.3) return;

      this.graph.zoomTo(currentZoom * 0.9, getCenter(this.graph));
    },

    // 全屏展示
    fullscreen() {
      // @ts-ignore
      const el = this.graph.cfg.container.parentNode;

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
.tool-bar {
  padding: 8px 0 8px 12px;
  border-bottom: 1px solid @border-color-split;

  .tool-icon {
    font-size: 18px;
  }
}
</style>

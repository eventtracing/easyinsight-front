<template>
  <div class="fill" style="background: #f6f7fa; position: relative">
    <div
      :id="containerId"
      ref="g6-container"
      class="fill"
      style="user-select: none; overflow: hidden"
    ></div>
    <div class="legend">
      <div class="flex-ac"><i class="online g-mr-12"></i>已上线</div>
    </div>
    <ToolBar :graph="graph"></ToolBar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import G6 from "@antv/g6";
import ToolBar from "./ToolBar.vue";
import { IGraph } from "@antv/g6-pc/lib/interface/graph";
import { getContextMenu } from "./context-menu";
import { cloneDeep, debounce } from "lodash";
import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import elementResizeDetectorMaker from "element-resize-detector";

const erdUltraFast = elementResizeDetectorMaker();

export default defineComponent({
  name: "Graph",
  components: { ToolBar },
  props: {
    nodes: {
      required: true,
    },
    edges: {
      required: true,
    },
  },
  computed: {
    gdata() {
      return {
        nodes: this.nodes || [],
        edges: this.edges || [],
      };
    },

    g6Container() {
      const g6Container: typeof HTMLDivElement = this.$refs["g6-container"];

      return g6Container;
    },
  },

  data() {
    const _containerId = "random";
    const _resizeFn: (width: number, height: number) => void = null;
    const _graph: IGraph & { eventEmitter?: any } = null;
    const _eventEmitter = null;

    return {
      containerId: _containerId,
      resizeFn: _resizeFn,
      graph: _graph,
      eventEmitter: _eventEmitter,
    };
  },

  created() {
    this.containerId = uuidv4();
    this.eventEmitter = new EventEmitter();

    const func = (width, height) => {
      if (!width || !height) return;

      this.graph
        ? this.graph.changeSize(width, height)
        : this.initGraph(width, height);
    };

    this.resizeFn = debounce(func, 200);
  },

  mounted() {
    erdUltraFast.listenTo(this.g6Container, () => {
      const width = this.g6Container.offsetWidth;
      const height = this.g6Container.offsetHeight;
      this.resizeFn(width, height);
    });
  },

  methods: {
    initGraph(width = 1000, height = 800) {
      const plugins = getContextMenu(this.eventEmitter);
      this.graph = new G6.Graph({
        container: this.containerId,
        width: width,
        height: height,
        renderer: "canvas",
        fitCenter: true,
        modes: {
          default: [
            "drag-canvas",
            "click-canvas",
            "drag-node",
            "hover-node",
            "click-node",
            "hover-edge",
            "click-edge",
          ],
        },
        plugins: plugins,
        defaultNode: {
          type: "rect",
          x: 0,
          y: 0,
        },
        layout: {
          type: "dagre",
          rankdir: "LR",
          nodesepFunc: () => 1,
          ranksepFunc: () => 1,
          controlPoints: false,
        },
      });
      this.graph.eventEmitter = this.eventEmitter;
      this.draw(true);
    },

    draw(first = false) {
      const edges = cloneDeep(this.gdata.edges);
      const method = first ? "read" : "changeData";

      this.graph.node((node) => ({ ...node, edges: edges }));
      this.graph[method](cloneDeep(this.gdata));
    },

    watchGraphData() {
      this.graph && this.draw();
    },
  },
  watch: {
    gdata: {
      handler: "watchGraphData",
      deep: true,
    },
  },
});
</script>

<style lang="less" scoped="true">
.legend-node {
  display: inline-block;
  width: 28px;
  height: 14px;
}

.legend {
  position: absolute;
  bottom: 12px;
  left: 16px;
  z-index: 9;

  .online {
    .legend-node();
    background: #e9f8f1;
    border: 1px solid #26bd71;
  }
}
</style>
<style lang="less">
.g6-component-contextmenu {
  padding: 4px 0px !important;
  border: none !important;
  border-radius: 0 !important;
  background: #ffffff !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25) !important;
  li {
    padding: 4px 10px !important;
    cursor: pointer !important;
    &:hover {
      background-color: #e6efff !important;
    }
  }
}
</style>

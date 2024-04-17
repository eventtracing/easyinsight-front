<template>
  <div class="fill" style="background: #f6f7fa; position: relative">
    <div
      :id="containerId"
      ref="g6-container"
      class="fill"
      style="user-select: none; overflow: hidden"
    ></div>
    <div class="legend" v-if="!mini">
      <div class="flex-ac"><i class="cur g-mr-12"></i>当前对象</div>
      <div class="flex-ac g-mt-4">
        <i class="parent-space g-mr-12"></i>父空间对象
      </div>
      <div class="flex-ac g-mt-4"><i class="page g-mr-12"></i>页面</div>
    </div>
    <div class="legend-right legend" v-if="!mini">
      <div class="flex-ac g-mt-4"><i class="element g-mr-12"></i>元素</div>
      <div class="flex-ac g-mt-4"><i class="popover g-mr-12"></i>浮层</div>
    </div>
    <s-upload-image
      class="image-upload"
      v-model:imgUrls="objImage"
      size="mini"
      :disabled="true"
      :isDetail="true"
      v-if="objImage && objImage.length"
    ></s-upload-image>
    <u-drawer
      title="对象参数"
      placement="right"
      :width="1000"
      :visible="visible"
      :class="
        $attrs.fromObjectManage && activeKey === 3 ? 'c-object__container' : ''
      "
      @handlerClose="visible = false"
    >
      <template #title
        ><div class="flex-ac">
          <span style="flex: none">对象详情</span>
          <template v-if="spmContent.length">
            <a-tooltip placement="top">
              <template #title>
                <span>{{ getSpmContent().join(" | ") }}</span>
              </template>
              <div class="flex-1 flex-ac">
                <div
                  class="g-ml-8"
                  ref="spm"
                  v-ellipsis-title
                  style="
                    color: rgb(169, 169, 184);
                    font-weight: normal;
                    font-size: 14px;
                  "
                >
                  {{ getSpmContent().join(" | ") }}
                </div>
                <icon-font
                  title="复制"
                  class="icon-copy"
                  type="icon-fuzhi"
                  @click="copySpm"
                >
                </icon-font>
              </div>
            </a-tooltip>
          </template></div
      ></template>
      <ObjectEditDrawer
        :fromObjectManage="$attrs.fromObjectManage"
        from="blood"
        :conditions="conditions"
        :propsTerminalId="terminalId"
        :reqPoolId="reqPoolId"
        @change="spmContent = []"
        @changeActiveKey="changeActiveKey"
        @handlerClose="handleClose"
        v-bind="objectdetail"
        v-if="visible"
        isPreview="true"
      ></ObjectEditDrawer>
    </u-drawer>
    <ToolBar :graph="graph" v-if="compare"></ToolBar>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ToolBar from "./ToolBar.vue";
import G6 from "@antv/g6";
import { IGraph } from "@antv/g6-pc/lib/interface/graph";
import { CustomNodeConfig } from "./type";
import { cloneDeep, debounce } from "lodash";
import { registerItems } from "./item/index";
import { initBehaviors } from "./behavior/index";
import { getContextMenu } from "./plugin/index";
import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import ObjectEditDrawer from "../../ObjectEditDrawer.vue";
import elementResizeDetectorMaker from "element-resize-detector";
const erdUltraFast = elementResizeDetectorMaker();

function getCenter(graph: IGraph) {
  const width = graph.getWidth();
  const height = graph.getHeight();

  return { x: width / 2, y: height / 2 };
}

export default defineComponent({
  name: "Graph",
  components: { ToolBar, ObjectEditDrawer },
  props: {
    terminalId: {
      type: Number as PropType<number>,
    },
    nodes: {
      required: true,
    },
    conditions: {},
    edges: {
      required: true,
    },
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    objImage: {
      required: false,
      default: () => [],
    },
    mini: {
      type: Boolean,
      default: false,
    },
    compare: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    gdata() {
      this.nodeDedupMap = {};
      const { nodeDedupMap } = this;
      const nodes = [...this.nodes] || [];
      const edges = (this.edges || []).reduce((edge, item) => {
        const { target } = item;
        const node = nodeDedupMap[target];

        if (node) {
          const randomKey = Math.random().toString(36).substr(2);
          const id = `${(node as CustomNodeConfig).id}-${randomKey}`;
          nodes.push({ ...nodeDedupMap[target], id } as CustomNodeConfig);
          edge.push({ ...item, target: id });
        } else {
          nodeDedupMap[target] = nodes.find((node) => node.id === target) || {};
          edge.push(item);
        }

        return edge;
      }, []);

      return { nodes, edges };
    },

    g6Container() {
      const g6Container: typeof HTMLDivElement = this.$refs["g6-container"];

      return g6Container;
    },
  },

  data() {
    const _objectdetail = {};
    const _visible = false;
    const _containerId = "random";
    const _resizeFn: (width: number, height: number) => void = null;
    const _graph: IGraph & { eventEmitter?: any } = null;
    const _eventEmitter = null;
    const _nodeDedupMap: {
      [propsName: string]: CustomNodeConfig | Record<string, unknown>;
    } = {};
    const _trackerId: string | number = "";

    return {
      spmContent: [],
      activeKey: 1,
      objectdetail: _objectdetail,
      visible: _visible,
      containerId: _containerId,
      resizeFn: _resizeFn,
      graph: _graph,
      eventEmitter: _eventEmitter,
      nodeDedupMap: _nodeDedupMap,
      trackerId: _trackerId,
    };
  },

  created() {
    this.containerId = uuidv4();
    this.eventEmitter = new EventEmitter();

    const func = (width, height) => {
      if (width === 0 || height === 0) return;

      this.graph
        ? this.graph.changeSize(width, height)
        : this.initGraph(width, height);
    };

    this.resizeFn = debounce(func, 200);
    registerItems();
    initBehaviors();
  },

  mounted() {
    erdUltraFast.listenTo(this.g6Container, () => {
      const width = this.g6Container.offsetWidth;
      const height = this.g6Container.offsetHeight;
      this.resizeFn(width, height);
    });

    this.initEvents();
  },

  methods: {
    copySpm() {
      const input = document.createElement("input");
      document.body.appendChild(input);

      // @ts-ignore
      input.setAttribute("value", this.spmContent.join("|"));
      input.select();

      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$message.success("复制成功~");
      } else {
        this.$message.error("复制失败~");
      }

      document.body.removeChild(input);
    },
    getSpmContent() {
      return this.spmContent;
    },
    changeActiveKey(key) {
      this.activeKey = key;
    },
    // 去重多余的连线和node
    dedpuEdges(edges, nodes) {
      const obj = {};
      const arr = [];
      edges.forEach((e) => {
        const target = e.target.split("-");
        const sId = e.source;
        const eId = target[0];

        if (!obj[`${sId}/${eId}`]) {
          arr.push(e);
          obj[`${sId}/${eId}`] = true;
        } else {
          const index = nodes.findIndex((n) => n.id === e.target);
          nodes.splice(index, 1);
        }
      });
      return arr;
    },

    initEvents() {
      this.eventEmitter.on("fold-node", (id) => {
        this.nodeDedupMap = {};
        this.$emit("fold-node", id);
      });
      this.eventEmitter.on("expand-node", (id, type: "parent" | "son") => {
        this.nodeDedupMap = {};
        this.$emit("expand-node", id, type);
      }); // 查看对象详情

      // 查看对象详情
      this.eventEmitter.on("view-detail", ({ id, historyId }) => {
        this.$navToNewTab({
          path: "/tracker/object/detail",
          query: {
            ...this.$route.query,
            objId: String(id),
            historyId: String(historyId),
            tab: "3",
          },
        });
      });
      this.eventEmitter.on("set-current", ({ id }) => {
        this.$emit("set-current", id);
      });
    },

    // 选中的所有相同对象样式都要变化
    fillTextStyle(node, style) {
      const {
        cfg: { itemMap = {} },
      } = this.graph as any;
      const { id } = node.item._cfg;

      for (const key in itemMap) {
        if (key.split("-")[0] === id.split("-")[0]) {
          const currentNode = itemMap[key];
          const {
            group: {
              cfg: { children },
            },
          } = currentNode._cfg;
          currentNode.update({ style });
        }
      }
    },

    initGraph(width = 1000, height = 800) {
      this.graph = new G6.Graph({
        container: this.containerId,
        width: width,
        height: height,
        renderer: "canvas",
        fitCenter: true,
        minZoom: 0.05,
        plugins: getContextMenu(this.eventEmitter, !this.compare),
        modes: {
          default: [
            "drag-canvas",
            "click-canvas",
            "drag-node",
            "hover-node",
            "click-node",
          ],
        },
        defaultNode: {
          type: "obj-node",
        },
        defaultEdge: {
          type: "cubic-horizontal",
        },
        layout: {
          type: "dagre",
          rankdir: "LR",
          nodesep: 10,
          ranksep: 70,
        },
      });
      this.graph.eventEmitter = this.eventEmitter;
      this.graph.on("node:mouseenter", (node: any) => {
        if (node.item) {
          const cfg = node.item._cfg.model;
          this.fillTextStyle(node, {
            // fill: '#f4dfe1',
            stroke: "#F7121C",
          });
        }
      });
      this.graph.on("node:mouseleave", (node: any) => {
        if (node.item) {
          this.fillTextStyle(node, {
            fill: "#7880A0",
            type: "leave",
          });
        }
      });
      this.graph.on("node:click", this.showObjectDetail);
      this.draw(true);
      this.$emit("initGraph", this.graph);
    },

    // 点击对象展示对象详情
    showObjectDetail(node) {
      if (node.target.constructor.name === "Path") return;

      const otherAppId = node?.item?._cfg?.model?.otherAppId || "";

      if (otherAppId) {
        this.$message.warning("父空间对象不支持在当前空间查看");
        return;
      }

      if (node.item) {
        const { id } = node.item._cfg;
        const spmLink = this.getNodeSpmLink(node);
        this.spmContent = this.generateSpm(id);
        const realId = id.split("-")[0];
        const cNode = (this.nodes.find((v) => +v.id === +realId) as any) || {
          trackerId: "",
        };

        const { trackerId, historyId } = cNode;
        this.trackerId = trackerId;
        this.visible = true;

        this.objectdetail = {
          id: +realId,
          trackerId,
          historyId,
          record: {
            ...cNode,
            spmLink,
          },
        };
      }
    },

    getNodeSpmLink(node) {
      const id = node?.item?._cfg?.id;
      const { edges, nodes } = this;

      if (!id) return "";

      const idLink = [id];

      function getNodeLink(id, list) {
        for (let i = 0, l = edges.length; i < l; i++) {
          const edge = edges[i];

          if (edge.target === id) {
            list.push(edge.source);
            getNodeLink(edge.source, list);
            break;
          }
        }
      }

      getNodeLink(id, idLink);

      const spmLink = idLink.map((id) => {
        const node = nodes.find((node) => node.id === id);

        return node.oid;
      });

      return spmLink.join("|");
    },

    // 生成对应的spm
    generateSpm(id, spm = []) {
      const { nodes, edges } = this.gdata;
      const node = nodes.find((v) => v.id === id) || {};

      node && spm.push(node.oid);

      const source = edges.find((e) => e.target === id) || {};
      source.source && this.generateSpm(source.source, spm);

      return spm;
    },

    draw(first = false) {
      const edges = cloneDeep(this.gdata.edges);
      const method = first ? "read" : "changeData";

      this.graph.node((node) => ({ ...node, edges: edges }));
      this.graph[method](cloneDeep(this.gdata));

      if (!this.mini) {
        this.graph.fitCenter();
        return;
      }

      this.$nextTick(() => {
        setTimeout(() => {
          this.graph.fitCenter();
          this.graph.zoomTo(0.15, getCenter(this.graph));
        });
      });
    },
    watchGraphData() {
      this.graph && this.draw(true);
    },
    handleClose() {
      this.visible = false;
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

<style lang="less" scoped>
.fill :deep(.tool-container) {
  bottom: 40px;
}
.icon-copy {
  font-size: 14px;
  color: rgb(169, 169, 184);
  margin-left: 8px;
  flex: none;
}
.legend {
  position: absolute;
  bottom: 50px;
  left: 16px;
  z-index: 9;
  .cur {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid #f7121c;
  }

  .parent-space {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid #ffa500;
  }

  .page {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: #ebf7f1;
    border: 2px solid #181616;
  }

  .element {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: #e8f7fe;
    border: 2px solid #181616;
  }
  .popover {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: #fef7e8;
    border: 2px solid #181616;
  }
  .bridge {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: #f4dfe1;
    border: 2px solid #181616;
  }
}

.legend-right {
  position: absolute;
  bottom: 50px;
  left: 126px;
  z-index: 9;
}

.image-upload {
  position: absolute;
  z-index: 100;
  left: 0;
  top: 0;
  width: 300px;
  height: 185px;
  padding: 0;
  overflow: hidden;
  background: rgba(128, 128, 128, 0.5);
}

.c-object__container .g-position {
  overflow-y: auto;
  padding: 24px;
}
</style>

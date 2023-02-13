<template>
  <div class="fill flex-column">
    <TopFilter
      :id="curId"
      :conditions="filterConditions"
      @change="onFilterChange"
      v-if="!$attrs.fromObjectManage"
    ></TopFilter>
    <div class="flex-1 flex-column g-mt-8 main">
      <ObjectViewLineage
        :id="id"
        :reqPoolId="reqPoolId"
        :objImage="objImage"
        :bloodEdges="lineageEdges"
        :bloodNodes="lineageNodes"
        :conditions="filterConditions"
        :releasedId="releasedId"
        ref="lineage"
        :fromObjectManage="fromObjectManage"
      ></ObjectViewLineage>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TopFilter from "./Filter.vue";
import { IGraph } from "@antv/g6";
import {
  ObjLineageNumberDto,
  ObjLineageNodeDto,
  ObjLineageEdgeDto,
  CenterObjDto,
  ObjTypeEnum,
} from "@/types/object.type";
import { cloneDeep } from "lodash";
import ObjectViewLineage from "../ObjectViewLineage.vue";

export interface FilterDto {
  displayType: string;
  terminalId: number;
  versionId: number;
}

export default defineComponent({
  name: "BloodRelation",
  components: {
    TopFilter,
    ObjectViewLineage,
  },
  setup() {
    const _ObjTypeEnum = ObjTypeEnum;
    const _graph: IGraph = null;

    return { ObjTypeEnum: _ObjTypeEnum, graph: _graph };
  },
  props: {
    id: {},
    releasedId: {},
    reqPoolId: {},
    fromObjectManage: {},
    objImage: {
      default: () => [],
    },
    conditions: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  computed: {
    nodes() {
      return this.lineageNodes.map((n) => {
        const type =
          n.id === this.curId
            ? "cur"
            : n.type === ObjTypeEnum.PAGE
            ? "page"
            : "element";

        return {
          id: n.id.toString(),
          showName: n.name,
          oid: n.oid,
          objType: type,
          expandParent: n.expandParent,
          expandSon: n.expandSon,
          terminalId: n.terminalId,
          versionId: n.terminalVersionId,
          historyId: n.historyId,
          trackerId: n.trackerId,
        };
      });
    },

    edges() {
      return this.lineageEdges.map((e) => ({
        source: e.fromObjId.toString(),
        target: e.toObjId.toString(),
        sourceAnchor: 1,
        targetAnchor: 0,
      }));
    },

    filterConditions() {
      return {
        displayType: this.displayType,
        terminalId: this.terminalId,
        versionId: this.versionId,
      };
    },
  },

  data() {
    const _curId = null;
    const _displayType = "name";
    const _terminalId = this.conditions.terminalId;
    const _versionId = this.conditions.versionId; // 血缘数

    // 血缘数
    const _objLineageNum: ObjLineageNumberDto = {
      allSonNum: 0,
      allParentNum: 0,
      parentNum: 0,
      sonNum: 0,
    };
    const _lineageNodes: ObjLineageNodeDto[] = [];
    const _lineageEdges: ObjLineageEdgeDto[] = [];
    const _centerObj: CenterObjDto = null;

    // 注意：g6 graph node、edge 的 id 不能为数字，只能是字符串
    return {
      curId: _curId,
      displayType: _displayType,
      terminalId: _terminalId,
      versionId: _versionId,
      objLineageNum: _objLineageNum,
      lineageNodes: _lineageNodes,
      lineageEdges: _lineageEdges,
      centerObj: _centerObj,
    };
  },

  created() {
    this.curId = this.id;
  },

  watch: {
    conditions: {
      handler(condition) {
        this.curId = this.id;

        this.$attrs.fromObjectManage && this.onFilterChange(condition);
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    sync() {},
    async getGraphData() {
      this.$refs.lineage.initData();
    },
    onFilterChange(conditions: FilterDto) {
      const { displayType, terminalId, versionId } = conditions;

      this.displayType = displayType;
      this.terminalId = terminalId;
      this.versionId = versionId;

      this.$nextTick(() => {
        this.getGraphData();
      });
      this.$emit("filterChange", conditions);
    },
    // 菜单栏展开对象
    onSetDepth(parentDepth, sonDepth) {
      this.getGraphData(parentDepth, sonDepth);
    },

    // 菜单栏收起对象
    onFold(key) {
      if (key === "all") {
        this.lineageNodes = this.lineageNodes.filter(
          (n) => n.id === this.curId
        );
        this.lineageEdges = [];
        return;
      }

      if (key === "parent") {
        const parentNodes = this.lineageEdges
          .filter((e) => e.toObjId === this.curId)
          .map((v) => v.fromObjId);

        parentNodes.forEach((id) => this.onFoldNode(id));
        return;
      }

      const node = this.lineageNodes.find((n) => n.id === Number(this.curId));

      node.expandSon && this.onFoldNode(this.curId);
    },

    // 血缘图收起节点
    onFoldNode(id: string | number) {
      id = Number(id);
      const node = this.lineageNodes.find((n) => n.id === id);
      let nodes = cloneDeep(this.lineageNodes);
      let edges = cloneDeep(this.lineageEdges);

      if (node.expandSon) {
        const stack = [id];
        let i = 0;

        while (stack.length) {
          const id = stack.shift();
          edges = edges.filter((e) => {
            if (e.fromObjId === id) {
              stack.push(e.toObjId);
              return false;
            }

            return true;
          });

          i > 0 &&
            (nodes = nodes.filter((n) =>
              n.id === id
                ? edges.findIndex((e) => e.toObjId === id) !== -1
                : true
            ));

          i++;
        }
      } else {
        const stack = [id];
        let count = 0;

        while (stack.length) {
          const id = stack.shift();

          edges = edges.filter((e) => {
            if (e.fromObjId === id)
              return count > 0 ? e.toObjId === this.curId : false;

            e.toObjId === id && stack.push(e.fromObjId);

            return true;
          });

          nodes = nodes.filter((n) =>
            n.id === id
              ? edges.findIndex((e) => e.fromObjId === id) !== -1
              : true
          );
          count++;
        }
      }

      this.lineageNodes = nodes;
      this.lineageEdges = edges;
    },

    onSetCurrent(id) {
      this.curId = Number(id);
    },
  },
});
</script>

<style lang="less" scoped="true">
.main {
  border: 1px solid @border-color-split;

  .info {
    padding-left: 12px;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid @border-color-split;
    user-select: none;
    > span {
      & + span {
        margin-left: 16px;
      }
    }
  }

  .footer {
    padding: 12px 0 12px 12px;
    border-top: 1px solid @border-color-split;
  }
}
</style>

<template>
  <a-modal
    title="对象血缘"
    v-model="visible"
    :footer="null"
    :width="800"
    :maskClosable="true"
  >
    <div class="preview-graph">
      <BloodGraph :nodes="nodes" :edges="edges" compare=""></BloodGraph>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BloodGraph from "../../object/list/blood-relation/graph/index.vue";
import {
  ObjLineageNodeDto,
  ObjLineageEdgeDto,
  ObjTypeEnum,
  ChangeTypeEnum,
} from "@/types/object.type";
import { getObjTrackerLineage } from "@/services/object.service";
export default defineComponent({
  name: "ObjectLineage",
  components: { BloodGraph },
  props: {
    objId: {},
    trackerId: {},
  },
  computed: {
    nodes() {
      return this.lineageNodes.map((n) => {
        const type =
          n.id === this.objId
            ? "cur"
            : n.type === ObjTypeEnum.PAGE
            ? "page"
            : "element";

        return {
          id: n.id.toString(),
          showName: n.name,
          objType: type,
          expandParent: false,
          expandSon: false,
          terminalId: n.terminalId,
          versionId: n.terminalVersionId,
          readonly: true,
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
        style: {
          stroke:
            e.changeType === ChangeTypeEnum.DELETE
              ? "#F24957"
              : e.changeType === ChangeTypeEnum.CREATE
              ? "#26BD71"
              : "#999",
        },
      }));
    },
  },

  data() {
    const _visible = false;
    const _lineageNodes: ObjLineageNodeDto[] = [];
    const _lineageEdges: ObjLineageEdgeDto[] = [];

    // 注意：g6 graph node、edge 的 id 不能为数字，只能是字符串
    return {
      visible: _visible,
      lineageNodes: _lineageNodes,
      lineageEdges: _lineageEdges,
    };
  },

  methods: {
    open() {
      this.visible = true;
    },

    async getLineageData() {
      const params = {
        trackerId: this.trackerId,
        parentDepth: -1,
        sonDepth: -1,
        comparePreTracker: true,
      };

      // @ts-ignore
      const { objs, relations } = await getObjTrackerLineage(params);
      this.lineageNodes = objs;
      this.lineageEdges = relations;

      this.$emit("graphData", this.nodes, this.edges);
    },
  },
  watch: {
    trackerId: {
      handler: "getLineageData",
      immediate: true,
    },
  },
});
</script>

<style lang="less" scoped="true">
.preview-graph {
  width: 750px;
  height: 520px;
}
</style>

<template>
  <BloodGraph
    :objImage="objImage"
    :nodes="nodes"
    :edges="edges"
    :conditions="conditions"
    :reqPoolId="reqPoolId"
    :terminalId="terminalId"
    compare
    :fromObjectManage="fromObjectManage"
  ></BloodGraph>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, PropType } from "vue";
import {
  ObjLineageNodeDto,
  ObjLineageEdgeDto,
  ChangeTypeEnum,
} from "@/types/object.type";
import {
  getObjTrackerLineage,
  getOnlineObjTrackerLineage,
} from "@/services/object.service";

var relObjMaps = {};
export default defineComponent({
  name: "ObjectViewLineage",
  components: {
    BloodGraph: defineAsyncComponent(
      () => import("../../object/list/blood-relation/graph/index.vue")
    ),
  },
  props: {
    id: {},
    conditions: {
      default: () => ({}),
    },
    releasedId: {},
    fromObjectManage: {},
    trackerId: {},
    terminalId: {},
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    objImage: {},
    bloodNodes: {
      type: Array,
      default: () => [],
    },
    bloodEdges: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    nodes() {
      const typeMap = {
        1: "page",
        2: "element",
        3: "popover",
        4: "bridge",
      };

      const result = this.lineageNodes.flatMap((n) => {
        if (!n.id) return [];

        return {
          id: (n.id || "").toString(),
          showName: n.name,
          oid: n.oid,
          objType: n.specialType === "bridge" ? "bridge" : typeMap[n.type],
          specialType: n.specialType,
          expandParent: false,
          expandSon: false,
          terminalId: n.terminalId,
          versionId: n.terminalVersionId,
          readonly: true,
          historyId: n.historyId,
          trackerId: n.trackerId,
          spmLink: n.spmLink,
          otherAppId: n.otherAppId || "",
          spaceType: n.otherAppId ? "otherSpace" : "currentSpace",
        };
      });

      return result;
    },

    edges() {
      const result = this.lineageEdges.map((e) => ({
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

      return result;
    },
  },

  data() {
    const _lineageNodes: ObjLineageNodeDto[] = [];
    // 注意：g6 graph node、edge 的 id 不能为数字，只能是字符串
    const _lineageEdges: ObjLineageEdgeDto[] = [];

    return {
      lineageNodes: _lineageNodes,
      lineageEdges: _lineageEdges,
    };
  },
  created() {
    this.terminalId && (this.conditions.terminalIds = this.terminalId);

    this.objectMap = {};
    this.initData();
  },

  methods: {
    async initData() {
      if (
        this.trackerId ||
        (this.reqPoolId && !this.fromObjectManage) ||
        this.fromObjectManage
      ) {
        this.lineageNodes = [];
        this.lineageEdges = [];
        const params = {
          objId: this.id,
          terminalId: this.terminalId,
          reqPoolId: this.reqPoolId,
          releaseId:
            this.releasedId ||
            this.conditions.versionId ||
            this.conditions.versionIds,
        };
        relObjMaps = {};

        const execute = this.fromObjectManage
          ? getOnlineObjTrackerLineage
          : getObjTrackerLineage;

        const { tree, objInfoMap }: any = await execute(params);

        this.getTaskPropertyLoop({ roots: tree, entities: objInfoMap });
      }
    },
    // 循环tree结构拼装数据
    getTaskPropertyLoop({ roots = [], entities = {} }, objId, parentSpm = "") {
      return roots.map((v) => {
        const edge: Partial<ObjLineageEdgeDto> = {};
        const data = entities[v.objId];
        if (objId) {
          edge.fromObjId = objId;
          edge.toObjId = v.objId;
          edge.changeType = v.type;

          if (!this.objectMap[v.objId]) {
            this.objectMap[v.objId] = true;
          } else {
            // @ts-ignore
            edge.toObjId = v.objId =
              v.objId + "-" + Math.random().toString(36).substr(2);
            // @ts-ignore
            v.id = edge.toObjId;
          }
          this.lineageEdges.push(edge);
        }

        data && Object.assign(v, data);

        v.spmLink = [v.oid, ...parentSpm.split("|")].filter(Boolean).join("|");

        if (v.children && !!v.children.length) {
          this.getTaskPropertyLoop(
            { roots: v.children, entities },
            v.objId,
            v.spmLink
          );
        } else v.children = undefined;

        v.isReuse = !!relObjMaps[v.objId] || ((relObjMaps[v.objId] = v), false);
        v.isReuse && (relObjMaps[v.objId].isReuse = true);
        v.id = edge.toObjId || v.objId;

        this.lineageNodes.push(v);

        return v;
      });
    },
    handleClose() {
      this.$emit("close");
    },
  },

  watch: {
    bloodNodes(n) {
      this.lineageNodes = n;
    },
    bloodEdges(n) {
      this.lineageEdges = n;
    },
    terminalId(n) {
      this.initData();
    },
  },
});
</script>

<template>
  <div class="right" v-if="detail">
    <a-collapse v-model="activeKeys" :bordered="false">
      <a-collapse-panel key="1" header="基本配置">
        <div class="flex" style="margin-bottom: 10px">
          <div class="flex-column" :style="{ width: '25%' }">
            <span class="text-main">对象类型</span>
            <span>{{
              detail.type === ObjTypeEnum.PAGE ? "页面" : "元素"
            }}</span>
          </div>
          <div class="flex-column" :style="{ width: '25%' }">
            <span class="text-main">对象ID(oid)</span>
            <span>
              {{ detail.oid }}
            </span>
          </div>
          <div class="flex-column" :style="{ width: '25%' }">
            <span class="text-main">对象名称</span>
            <span>
              {{ detail.name }}
            </span>
          </div>
          <div class="flex-column" :style="{ width: '25%' }">
            <span class="text-main">标签</span>
            <ObjTagSelect :tags="detail.tags" />
          </div>
        </div>
        <div class="flex" style="margin-bottom: 15px">
          <div class="flex-column" :style="{ width: '25%' }">
            <span class="text-main">优先级</span>
            <span>
              {{ detail.priority }}
            </span>
          </div>
          <div class="flex-column" :style="{ width: '25%' }">
            <span class="text-main">路由</span>
            <span>
              {{ (detail.routePaths || []).map((v) => v.path).join(",") }}
            </span>
          </div>
          <div class="flex-column" :style="{ width: '25%' }">
            <span class="text-main">全局公参</span>
            <span
              class="text-link"
              @click="onViewParam($get(detail, 'globalPublicParam.params', []))"
              >{{ detail.globalPublicParam.versionName }}</span
            >
          </div>
          <div class="flex-column" :style="{ width: '25%' }">
            <span class="text-main">对象描述</span>
            <span>
              {{ detail.description }}
            </span>
          </div>
        </div>
        <div>
          <div class="flex-1 flex-column" :style="{ width: '25%' }">
            <span class="text-main">事件类型及公参版本</span>
            <span
              v-for="(event, i) in $get(detail, 'eventParam', [])"
              :key="i"
              class="text-link"
              @click="onViewParam($get(event, 'params', []))"
              >{{ `${event.eventName} - ${event.versionName || "无"}` }}</span
            >
          </div>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="血缘配置">
        <div>
          父对象
          <br />
          <span v-for="parent in detail.parentObjs" :key="parent.id">
            {{ parent.name }}
          </span>
          <span class="text-link" @click="onPreviewGraph" v-if="!fromBlood"
            >查看血缘</span
          >
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="参数配置">
        <a-table
          class="g-mt-16 param-compare-table"
          size="middle"
          :columns="columns"
          :rowClassName="rowClassName"
          :rowKey="(record) => record.id"
          :pagination="false"
          :dataSource="detail.objNormalParam"
        ></a-table>
      </a-collapse-panel>
    </a-collapse>
    <ObjectLineage
      ref="lineage-graph"
      :objId="objId"
      :trackerId="trackerId"
      @graphRender="(url) => (graphUrl = url)"
      @graphData="onGetGraphData"
      v-if="!fromBlood"
    ></ObjectLineage>
  </div>
</template>

<script lang="tsx">
import { defineComponent, reactive } from "vue";
import ObjectLineage from "./ObjectLineage.vue";
import ObjTagSelect from "@/views/home/tracker/object/list/ObjTagSelect.vue";
import ParamTableModal from "../../object/detail/ParamTableModal.vue";
import { TableColumn } from "@/types/table.type";
import {
  ObjTypeEnum,
  SchemaTypeEnum,
  ParamWithValueItemDto,
  ChangeTypeEnum,
  ObjTrackerDto,
} from "@/types/object.type";
import { ParamValueTypeEnum } from "@/types/parameter.type";

export default defineComponent({
  name: "ObjectDetail",
  components: {
    ObjectLineage,
    ObjTagSelect,
  },

  setup() {
    const _activeKeys: string[] = reactive(["1", "2", "3"]);
    const _ObjTypeEnum = ObjTypeEnum;
    const _SchemaTypeEnum = SchemaTypeEnum;

    return {
      activeKeys: _activeKeys,
      ObjTypeEnum: _ObjTypeEnum,
      SchemaTypeEnum: _SchemaTypeEnum,
    };
  },

  props: {
    trackerId: {},
    objId: {},
    from: { type: String, default: "" },
  },
  computed: {
    fromBlood() {
      return this.from === "blood";
    },

    columns(): TableColumn[] {
      return [
        {
          key: "order",
          title: "序号",
          width: 80,
          customRender: ({ index }: { index: number }) => {
            return <span>{index + 1}</span>;
          },
          customCell: () => {
            return {
              style: {
                "padding-left": "24px",
              },
            };
          },
          customHeaderCell: () => {
            return {
              style: {
                "padding-left": "24px",
              },
            };
          },
        },
        {
          key: "must",
          title: "必传",
          dataIndex: "must",
          width: 80,
          customRender: ({ text }: { text: boolean }) => {
            return <a-checkbox disabled checked={text}></a-checkbox>;
          },
        },
        {
          key: "code",
          title: "参数名称",
          dataIndex: "code",
          customRender: ({ text }: { text: string }) => {
            return <span>{text}</span>;
          },
          customCell: () => {
            return {
              style: {
                "min-width": "120px",
              },
            };
          },
        },
        {
          key: "name",
          title: "中文名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => {
            return (
              <u-text-tooltip
                text={text || "-"}
                maxLineCount={2}
              ></u-text-tooltip>
            );
          },
          customCell: () => {
            return {
              style: {
                "min-width": "120px",
              },
            };
          },
        },
        {
          key: "valueType",
          title: "取值类型",
          dataIndex: "valueType",
          width: 100,
          customRender: ({ text: valueType }: { text: ParamValueTypeEnum }) => {
            return (
              <span>
                {valueType === ParamValueTypeEnum.CONSTANT ? "常量" : "变量"}
              </span>
            );
          },
        },
        {
          key: "values",
          title: "取值",
          dataIndex: "values",
          customRender: ({ text }: { text: string[] }) => {
            return <span>{text.join(",") || "-"}</span>;
          },
        },
        {
          key: "notEmpty",
          title: "非空",
          dataIndex: "notEmpty",
          width: 80,
          customRender: ({ text: notEmpty }: { text: boolean }) => {
            return <a-checkbox disabled checked={notEmpty}></a-checkbox>;
          },
        },
        {
          key: "description",
          title: "描述",
          dataIndex: "description",
          customRender: ({ text }: { text: string }) => {
            return <span>{text}</span>;
          },
        },
      ];
    },

    lineageGraph() {
      const lineageGraph: typeof ObjectLineage = this.$refs["lineage-graph"];

      return lineageGraph;
    },
  },

  data() {
    const _detail: ObjTrackerDto = null;
    const _nodes = [];
    const _edges = [];

    return {
      detail: _detail,
      nodes: _nodes,
      edges: _edges,
    };
  },

  methods: {
    rowClassName(record: ParamWithValueItemDto) {
      return record.paramChangeType === ChangeTypeEnum.CREATE
        ? "new-item"
        : record.paramChangeType === ChangeTypeEnum.DELETE
        ? "delete-item"
        : "";
    },
    onPreviewGraph() {
      this.lineageGraph.open();
    },
    onGetGraphData(nodes, edges) {
      this.nodes = nodes;
      this.edges = edges;
    },
    onViewParam(list: ParamWithValueItemDto[]) {
      this.$createInstance(ParamTableModal, {
        list: list,
      });
    },
  },
});
</script>

<style lang="less" scoped="true">
.mini-graph {
  width: 80px;
  height: 50px;
  background: #f5f7fa;
  margin-left: 16px;
  cursor: pointer;
  position: relative;

  &::after {
    content: "";
    width: 80px;
    height: 50px;
    display: block;
    position: absolute;
    top: 0;
  }
}

.right {
  padding: 16px;
  overflow-y: auto;

  :deep(.param-compare-table) {
    word-break: break-word;
    .new-item {
      background-color: #e9f8f1;
    }
    .delete-item {
      background-color: #feedee;
    }
  }
}
</style>

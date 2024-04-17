<template>
  <div>
    <div class="flex-ac">
      <span class="text-main">合入版本：</span
      ><span>{{ newestTerminalVersionName }}</span>
      <span class="text-main" style="margin-left: 60px">跨版本检测结果：</span
      ><span>{{ checkResult ? "有冲突" : "无冲突" }}</span>
    </div>
    <div v-for="item in list" :key="item.reqTask" class="g-mt-16">
      <div>{{ item.reqTask }}</div>
      <a-table
        size="middle"
        class="g-mt-16 table-row-align-middle"
        style="word-break: break-word"
        :columns="columns"
        :dataSource="item.conflictObjs"
        :pagination="false"
        :rowKey="(record) => record.objId"
      >
      </a-table>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import ObjectDiffDrawer from "./ObjectDiffDrawer.vue";
import { TableColumn } from "@/types/table.type";
import { ObjTypeEnum } from "@/types/object.type";
import { ReqObjectTypeEnum } from "@/types/requirement.type";
import { DiffBaseConflictObjVO } from "@/types/terminalVersion.type";

export default defineComponent({
  name: "ReqConflictCheck",
  components: {},
  props: {
    verisonId: {},
    terminalId: {},
  },
  computed: {
    columns(): TableColumn[] {
      return [
        {
          key: "oid",
          title: "oid",
          dataIndex: "oid",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
          customCell: () => ({
            style: {
              "padding-left": "24px",
            },
          }),
          customHeaderCell: () => ({
            style: {
              "padding-left": "24px",
            },
          }),
        },
        {
          key: "name",
          title: "对象名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
          customCell: () => ({
            style: {
              "min-width": "100px",
              "max-width": "200px",
            },
          }),
        },
        {
          key: "type",
          title: "对象类型",
          dataIndex: "type",
          customRender: ({ text: type }: { text: ObjTypeEnum }) => {
            const text = type === ObjTypeEnum.PAGE ? "页面" : "元素";

            return <span>{text}</span>;
          },
        },
        {
          key: "reqType",
          title: "需求类型",
          dataIndex: "reqType",
          customRender: ({ text: type }: { text: ReqObjectTypeEnum }) => {
            const text = type === ReqObjectTypeEnum.CHANGE ? "变更" : "新建";

            return <span>{text}</span>;
          },
        },
        {
          key: "baseTerminalVersionName",
          title: "原基准版本",
          dataIndex: "baseTerminalVersionName",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
        },
        {
          key: "operation",
          title: "操作",
          width: 80,
          customRender: ({ record }: { record: DiffBaseConflictObjVO }) => (
            <u-text-button on-click={this.onRebase.bind(this, record)}>
              对象变基
            </u-text-button>
          ),
        },
      ];
    },
  },
  data() {
    return {
      checkResult: false,
      newestTerminalVersionId: null,
      newestTerminalVersionName: "",
      list: [],
    };
  },
  created() {},
  methods: {
    onRebase(record: DiffBaseConflictObjVO) {
      const { objId, historyId, trackerId, baseTerminalVersionId } = record;

      this.$createInstance(ObjectDiffDrawer, {
        objId,
        historyId,
        terminalId: this.terminalId,
        trackerId,
        baseTerminalVersionId,
        newestTerminalVersionId: this.newestTerminalVersionId,
      });
    },
  },
});
</script>

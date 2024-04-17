<template>
  <a-modal
    :visible="true"
    :width="900"
    title="详情"
    :bodyStyle="{
      'min-height': '198px',
      'max-height': '500px',
      'overflow-y': 'auto',
    }"
    @cancel="handleClose"
  >
    <a-table
      size="middle"
      style="word-break: break-word"
      :columns="columns"
      :dataSource="list"
      :pagination="false"
      :expandedRowKeys="expandedRowKeys"
      :rowKey="(record) => record.task"
      @expand="onTableExpand"
    >
      <template #expandedRowRender="{ record }">
        <div style="padding: 4px 32px 4px 0">
          <ExpandTaskTable :list="record.objs"> </ExpandTaskTable>
        </div>
      </template>
    </a-table>
    <template #footer="">
      <a-button type="primary" @click="handleClose">知道了</a-button>
    </template>
  </a-modal>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import ExpandTaskTable from "./version-publish/ExpandTaskTable.vue";
import StatusTag from "../components/StatusTag.vue";
import { TableColumn } from "@/types/table.type";
import { ReqStatusEnum } from "@/types/requirement.type";

export default defineComponent({
  name: "DeployDetailModal",
  components: {
    StatusTag,
    ExpandTaskTable,
  },
  props: {
    id: {},
  },
  computed: {
    columns(): TableColumn[] {
      return [
        {
          key: "requirement",
          title: "需求",
          dataIndex: "requirement",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
        },
        {
          key: "task",
          title: "任务",
          dataIndex: "task",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
        },
        {
          key: "taskStatus",
          title: "任务状态",
          dataIndex: "taskStatus",
          customRender: ({ text: status }: { text: ReqStatusEnum }) => (
            <status-tag status={status} />
          ),
          customCell: () => ({
            style: {
              "min-width": "80px",
            },
          }),
        },
        {
          key: "owner",
          title: "负责人",
          dataIndex: "owner",
          customRender: ({ text }: { text: string }) => (
            <span>{text || "-"}</span>
          ),
          customCell: () => ({
            style: {
              "min-width": "80px",
            },
          }),
        },
        {
          key: "verifier",
          title: "验证人",
          dataIndex: "verifier",
          customRender: ({ text }: { text: string }) => (
            <span>{text || "-"}</span>
          ),
          customCell: () => ({
            style: {
              "min-width": "80px",
            },
          }),
        },
      ];
    },
  },
  data() {
    return { list: [], expandedRowKeys: [] };
  },
  methods: {
    onTableExpand(expanded, record) {
      if (expanded) {
        this.expandedRowKeys.push(record.task);
        return;
      }

      this.expandedRowKeys = this.expandedRowKeys.filter(
        (k) => k !== record.task
      );
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

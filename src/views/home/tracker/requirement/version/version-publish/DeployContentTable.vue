<template>
  <div>
    <div class="g-mb-16">以下为该版本包含的任务及对象内容，请确认：</div>
    <a-table
      size="middle"
      style="word-break: break-word"
      :columns="columns"
      :dataSource="list"
      :pagination="false"
      :expandedRowKeys="expandedRowKeys"
      :rowKey="(record) => record.requirement + record.task"
      @expand="onTableExpand"
    >
      <template #expandedRowRender="{ record }">
        <div style="padding: 4px 32px 4px 0">
          <ExpandTaskTable :list="record.objs" />
        </div>
      </template>
    </a-table>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import ExpandTaskTable from "./ExpandTaskTable.vue";
import { TableColumn } from "@/types/table.type";
import { TvReqTaskVO } from "@/types/terminalVersion.type";

export default defineComponent({
  name: "DeployConfirmModal",
  components: {
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
    const _list: TvReqTaskVO[] = [];
    const _expandedRowKeys = [];

    return { list: _list, expandedRowKeys: _expandedRowKeys };
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
  },
});
</script>

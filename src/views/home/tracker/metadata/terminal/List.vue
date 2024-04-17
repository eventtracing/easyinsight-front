<template>
  <a-table
    tableLayout="auto"
    size="middle"
    :scroll="scroll"
    :columns="columns"
    :dataSource="list"
    :pagination="pagination"
    :loading="loading"
    :rowKey="(record) => record.id"
    @change="onChangeTable"
  ></a-table>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import TerminalEditModal from "./TerminalEditModal.vue";
import ParamConfigDrawer from "../components/ParamConfigDrawer.vue";
import { TablePagination, TableColumn } from "@/types/table.type";
import {
  TerminalSimpleDto,
  TerminalTypeEnum,
  terminalTypeNameMap,
} from "@/types/terminal.type";
import { EntityTypeEnum } from "@/types/version.type";
import { deleteTerminal } from "@/services/terminal.service";

export default defineComponent({
  name: "List",
  props: {
    list: {},
    loading: {
      type: Boolean,
    },
    pagination: {},
    orderBy: {},
    orderRule: {},
  },
  computed: {
    scroll() {
      return { x: "max-content" };
    },
    columns(): TableColumn[] {
      return [
        {
          key: "name",
          title: "终端名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => (
            <u-text-tooltip text={text} maxLineCount={2}></u-text-tooltip>
          ),
          customCell: () => ({
            style: {
              "max-width": "200px",
            },
          }),
        },
        {
          key: "type",
          title: "终端类型",
          dataIndex: "type",
          customRender: ({ text: type }: { text: TerminalTypeEnum }) => (
            <span>{terminalTypeNameMap[type]}</span>
          ),
        },
        {
          key: "operation",
          title: "操作",
          width: 165,
          customRender: ({ record }: { record: TerminalSimpleDto }) => (
            <span>
              <u-text-button
                disabled={this.checkAuth(1035)}
                on-click={this.onBindParam.bind(this, record)}
              >
                参数管理
              </u-text-button>
            </span>
          ),
        },
      ];
    },
  },
  methods: {
    onEdit(record: TerminalSimpleDto) {
      this.$createInstance(TerminalEditModal, {
        id: record.id,
        onHandlerOk: () => {
          this.$emit("sync");
        },
      });
    },
    onDelete(record: TerminalSimpleDto) {
      this.$confirm({
        title: "确定要删除吗？",
        content: `终端名称：${record.name}`,
        onOk: () => {
          deleteTerminal(record.id)
            .then(() => {
              this.$message.success("删除成功");
              this.$emit("sync");
            })
            .catch((e) => {
              this.$warning({
                title: e.message,
              });
            });
        },
      });
    },
    onBindParam(record: TerminalSimpleDto) {
      this.$createInstance(ParamConfigDrawer, {
        entityId: record.id,
        entityType: EntityTypeEnum.TERMINAL,
        name: record.name,
      });
    },
    onChangeTable(pagination: TablePagination, filter, sorter) {
      this.$emit("changeTable", pagination, filter, sorter);
    },
  },
});
</script>

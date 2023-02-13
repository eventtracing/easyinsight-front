<template>
  <a-table
    style="word-break: break-word"
    size="small"
    :columns="columns"
    :dataSource="list"
    :pagination="pagination"
    :rowKey="(record, index) => index"
    @change="changeTable"
  >
  </a-table>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import StatusTag from "../../components/StatusTag.vue";
import { ReqStatusEnum } from "@/types/requirement.type";
import { TablePagination, TableColumn } from "@/types/table.type";
import { ObjTypeEnum, SchemaTypeEnum } from "@/types/object.type";

export default defineComponent({
  name: "ExpandTaskTable",
  components: { StatusTag },
  mixins: [TableMixin],
  props: {
    list: {},
  },
  computed: {
    columns(): TableColumn[] {
      return [
        {
          key: "reqType",
          title: "需求类型",
          dataIndex: "reqType",
          width: 80,
          customRender: ({ text: type }: { text: SchemaTypeEnum }) => {
            const text = type === SchemaTypeEnum.CHANGE ? "变更" : "新建";
            const color =
              type === SchemaTypeEnum.CHANGE ? "#FB8D18" : "#6AB2F5";

            return <u-tag color={color}>{text}</u-tag>;
          },
        },
        {
          key: "oid",
          title: "oid",
          dataIndex: "oid",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
          customCell: () => ({
            style: {
              "min-width": "120px",
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
              "min-width": "120px",
            },
          }),
        },
        {
          key: "type",
          title: "对象类型",
          dataIndex: "type",
          width: 80,
          customRender: ({ text: type }: { text: ObjTypeEnum }) => {
            const text = type === ObjTypeEnum.PAGE ? "页面" : "元素";

            return <span>{text}</span>;
          },
        },
        {
          key: "objStatus",
          title: "对象状态",
          dataIndex: "objStatus",
          customRender: ({ text: status }: { text: ReqStatusEnum }) => (
            <status-tag status={status}></status-tag>
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
          customCell: () => {
            return {
              style: {
                "min-width": "80px",
              },
            };
          },
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
              "min-width": "120px",
            },
          }),
        },
      ];
    },
  },
  methods: {
    changeTable(pagination: TablePagination) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
    },
  },
});
</script>

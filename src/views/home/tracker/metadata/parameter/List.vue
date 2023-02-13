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
import ParamEditDrawer from "./ParamEditDrawer.vue";
import ParamDetailDrawer from "./ParamDetailDrawer.vue";
import ParamValueDrawer from "./ParamValueDrawer.vue";
import { User } from "@/types/common.type";
import { TablePagination, TableColumn } from "@/types/table.type";
import { ParameterDto, ParamValueTypeEnum } from "@/types/parameter.type";
import { deleteParam } from "@/services/parameter.service";
import { getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";
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
    creatorFilters: {},
    creators: {},
    valueTypes: {},
  },
  computed: {
    scroll() {
      return {
        x: "max-content",
      };
    },
    columns(): TableColumn[] {
      return [
        {
          key: "code",
          title: "参数名",
          dataIndex: "code",
          customRender: ({
            text,
            record,
          }: {
            text: string;
            record: ParameterDto;
          }) => (
            <span class="text-link" onClick={this.onView.bind(this, record)}>
              {text}
            </span>
          ),
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
          title: "中文名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => {
            return (
              <u-text-tooltip text={text} maxLineCount={2}></u-text-tooltip>
            );
          },
          customCell: () => ({
            style: {
              "max-width": "200px",
            },
          }),
        },
        {
          key: "description",
          title: "描述",
          dataIndex: "description",
          customRender: ({ text }: { text: string }) => {
            return (
              <u-text-tooltip
                text={text || "-"}
                maxLineCount={2}
              ></u-text-tooltip>
            );
          },
          customCell: () => ({
            style: {
              "max-width": "300px",
            },
          }),
        },
        {
          key: "valueType",
          title: "取值类型",
          dataIndex: "valueType",
          customRender: ({ text }: { text: ParamValueTypeEnum }) => {
            const type = text === ParamValueTypeEnum.CONSTANT ? "常量" : "变量";

            return <span>{type}</span>;
          },
          filters: [
            {
              text: "常量",
              value: ParamValueTypeEnum.CONSTANT.toString(),
            },
            {
              text: "变量",
              value: ParamValueTypeEnum.VARIABLE.toString(),
            },
          ],
          filteredValue: this.valueTypes,
        },
        {
          key: "creator",
          title: "创建者",
          dataIndex: "creator",
          customRender: ({ text: creator }: { text: User }) => (
            <span>{creator.userName}</span>
          ),
          filters: this.creatorFilters,
          filteredValue: this.creators,
        },
        {
          key: "createTime",
          title: "创建时间",
          dataIndex: "createTime",
          width: 165,
          sorter: true,
          sortOrder: this.orderBy === "createTime" ? this.orderRule : false,
          customRender: ({ text }: { text: number }) => {
            const time = getTimeStringFromTimestamp(text);

            return <span>{time}</span>;
          },
        },
        {
          key: "operation",
          title: "操作",
          width: 160,
          customRender: ({
            record,
          }: {
            text: number;
            record: ParameterDto;
          }) => (
            <span>
              <u-text-button
                disabled={this.checkAuth(1017)}
                on-click={this.onEdit.bind(this, record)}
              >
                编辑
              </u-text-button>
              <u-text-button
                disabled={this.checkAuth(1019)}
                on-click={this.onSetValue.bind(this, record)}
              >
                取值管理
              </u-text-button>
              <u-text-button
                disabled={this.checkAuth(1020)}
                on-click={this.onDelete.bind(this, record)}
              >
                删除
              </u-text-button>
            </span>
          ),
        },
      ];
    },
  },
  methods: {
    onView(record: ParameterDto) {
      this.$createInstance(ParamDetailDrawer, { id: record.id });
    },
    onEdit(record: ParameterDto) {
      this.$createInstance(ParamEditDrawer, {
        id: record.id,
        onOk: () => {
          this.$emit("sync");
        },
      });
    },
    onSetValue(record: ParameterDto) {
      this.$createInstance(ParamValueDrawer, { id: record.id });
    },
    onDelete(record: ParameterDto) {
      this.$confirm({
        title: "确定要删除吗？",
        content: `参数名称：${record.name}`,
        onOk: () => {
          deleteParam(record.id)
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
    onChangeTable(pagination: TablePagination, filter: any, sorter: any) {
      this.$emit("changeTable", pagination, filter, sorter);
    },
  },
});
</script>

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
import BusinessParamAddOrEditModal from "./BusinessParamAddOrEditModal.vue";
import ParamValueDrawer from "./ParamValueDrawer.vue";
import { User } from "@/types/common.type";
import { TablePagination, TableColumn } from "@/types/table.type";
import {
  BusinessPrivateParamDto,
  ParamValueTypeEnum,
} from "@/types/parameter.type";
import { ObjSimpleDto } from "@/types/object.type";
import { deleteBusinessParam } from "@/services/parameter.service";
import { getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";
export default defineComponent({
  name: "List",
  props: {
    code: {},
    list: {},
    loading: { type: Boolean },
    pagination: {},
    orderBy: {},
    orderRule: {},
    creatorFilters: {},
    creators: {},
    valueTypes: {},
  },
  computed: {
    scroll() {
      return { x: "max-content" };
    },
    columns(): TableColumn[] {
      return [
        {
          key: "name",
          title: "中文名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => (
            <u-text-tooltip text={text} maxLineCount={2}></u-text-tooltip>
          ),
          customCell: () => ({
            style: {
              "padding-left": "24px",
              "max-width": "200px",
            },
          }),
          customHeaderCell: () => ({
            style: {
              "padding-left": "24px",
            },
          }),
        },
        {
          key: "binds",
          title: "关联对象",
          dataIndex: "binds",
          customRender: ({ text: binds }: { text: ObjSimpleDto[] }) => {
            const text = binds
              .filter(Boolean)
              .map((v) => v.name)
              .join("、");

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
            record: BusinessPrivateParamDto;
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
    onEdit(record: BusinessPrivateParamDto) {
      this.$createInstance(BusinessParamAddOrEditModal, {
        code: this.code,
        id: record.id,
        onHandlerOk: () => {
          this.$emit("sync");
        },
      });
    },

    onSetValue(record: BusinessPrivateParamDto) {
      this.$createInstance(ParamValueDrawer, {
        id: record.id,
        isBusinessPrivateParam: true,
      });
    },

    onDelete(record: BusinessPrivateParamDto) {
      this.$confirm({
        title: "确定要删除吗？",
        content: `参数名称：${record.name}`,
        onOk: () => {
          deleteBusinessParam(record.id)
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

    onChangeTable(pagination: TablePagination, filter, sorter) {
      this.$emit("changeTable", pagination, filter, sorter);
    },
  },
});
</script>

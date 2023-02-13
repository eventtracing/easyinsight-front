<template>
  <div>
    <s-table-search
      class="g-mb-16 c-version__search"
      v-model:search="search"
      placeholder="请输入端解决版本/版本号查询"
    />
    <a-table
      size="middle"
      :scroll="scroll"
      :columns="columns"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      :rowKey="(record) => record.id"
      @change="onChangeTable"
    ></a-table>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import VersionNumEditModal from "./VersionNumEditModal.vue";
import DeployDetailModal from "./DeployDetailModal.vue";
import { TableMixin, getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";
import { TablePagination, TableColumn } from "@/types/table.type";
import {
  TerminalVersionDto,
  TerminalVersionStatusEnum,
} from "@/types/terminalVersion.type";

export default defineComponent({
  name: "VersionList",
  mixins: [TableMixin],
  props: {
    id: {},
    terminalVersionName: {},
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
          key: "id",
          title: "版本ID",
          dataIndex: "id",
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
          key: "version",
          title: "端解决版本",
          dataIndex: "version",
          customRender: ({
            text,
            record,
          }: {
            text: string;
            record: TerminalVersionDto;
          }) => (
            <span class="text-link" onClick={this.onView.bind(this, record)}>
              {text}
            </span>
          ),
          customCell: () => ({
            style: {
              "min-width": "100px",
              "max-width": "200px",
            },
          }),
        },
        {
          key: "versionNum",
          title: "版本号",
          dataIndex: "versionNum",
          customRender: ({ text }: { text: string }) => (
            <span>{text || "-"}</span>
          ),
        },
        {
          key: "status",
          title: "版本状态",
          dataIndex: "status",
          customRender: ({
            text: status,
          }: {
            text: TerminalVersionStatusEnum;
          }) => {
            return (
              <span>
                {status === TerminalVersionStatusEnum.DEVELOP
                  ? "待上线"
                  : "已上线"}
              </span>
            );
          },
        },
        {
          key: "creator",
          title: "创建者",
          dataIndex: "creator",
          customRender: ({ text: creator }: { text: string }) => (
            <span>{creator}</span>
          ),
        },
        {
          key: "createTime",
          title: "创建时间",
          dataIndex: "createTime",
          width: 165,
          sorter: true,
          sortOrder: this.orderBy === "createTime" ? this.orderRule : false,
          customRender: ({ text: createTime }: { text: number }) => {
            const time = getTimeStringFromTimestamp(createTime);

            return <span>{time}</span>;
          },
        },
        {
          key: "operation",
          title: "操作",
          width: 160,
          customRender: ({ record }: { record: TerminalVersionDto }) => {
            return (
              <span>
                <u-text-button
                  disabled={this.checkAuth(1010)}
                  on-click={this.onEditVersionNum.bind(this, record)}
                >
                  编辑版本号
                </u-text-button>
              </span>
            );
          },
        },
      ];
    },
  },

  data() {
    const _orderBy: "createTime" = "createTime" as const;
    const _orderRule: "descend" | "ascend" = "descend";

    return {
      list: [],
      orderBy: _orderBy,
      orderRule: _orderRule,
      search: "",
    };
  },

  created() {},

  methods: {
    // 编辑版本号
    onEditVersionNum(record: TerminalVersionDto) {
      this.$createInstance(VersionNumEditModal, {
        id: record.id,
        versionNum: record.versionNum,
      });
    },

    // 查看版本详情或发布详情
    onView({ id }: TerminalVersionDto) {
      this.$createInstance(DeployDetailModal, { id });
    },

    onChangeTable(pagination: TablePagination, filter, sorter) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;

      if (this.orderBy === sorter.columnKey) {
        this.orderRule = sorter.order || "ascend";
      } else {
        this.orderBy = sorter.columnKey;
        this.orderRule = "ascend";
      }
    },
  },
});
</script>

<style lang="less" scoped>
:deep(.c-version__search) {
  justify-content: flex-start;
}
</style>

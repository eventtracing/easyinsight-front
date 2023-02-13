<template>
  <div class="g-pr-8">
    <a-table
      class="table-row-align-middle"
      tableLayout="auto"
      size="middle"
      :scroll="scroll"
      :columns="columns"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      :rowKey="(record) => record.historyId"
      @change="onChangeTable"
    ></a-table>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import ObjTrackerTable from "./ObjTrackerTable.vue";
import ObjectViewDrawer from "../list/ObjectViewDrawer.vue";
import { TableMixin, getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";
import { TableColumn, TablePagination } from "@/types/table.type";
import {
  ObjHistoryTrackerDto,
  ObjHistoryTrackerItemDto,
} from "@/types/object.type";
import { User } from "@/types/common.type";

export default defineComponent({
  name: "ObjHistoryTab",
  components: {
    ObjTrackerTable,
  },
  mixins: [TableMixin],
  props: {
    id: {},
    objType: {
      type: [Number],
    },
  },
  computed: {
    scroll() {
      return {
        x: "max-content",
      };
    },
    columns(): TableColumn[] {
      const column = [
        {
          key: "objVersionName",
          title: "对象版本",
          dataIndex: "objVersionName",
          sorter: true,
          sortOrder: this.orderBy === "objVersionName" ? this.orderRule : false,
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
          customCell: () => ({
            style: {
              "padding-left": "24px",
              "min-width": "120px",
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
          key: "name",
          title: "对象名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => (
            <u-text-tooltip text={text} maxLineCount={2}></u-text-tooltip>
          ),
          customCell: () => ({
            style: {
              "min-width": "100px",
              "max-width": "200px",
            },
          }),
        },
        {
          key: "description",
          title: "对象描述",
          dataIndex: "description",
          customRender: ({ text }: { text: string }) => (
            <u-text-tooltip
              text={text || "-"}
              maxLineCount={2}
            ></u-text-tooltip>
          ),
          customCell: () => ({
            style: {
              "min-width": "100px",
              "max-width": "200px",
            },
          }),
        },
        {
          key: "tracker",
          title: "埋点详情",
          dataIndex: "trackers",
          customRender: ({
            text: trackers,
          }: {
            text: ObjHistoryTrackerItemDto[];
          }) => <ObjTrackerTable list={trackers} />,
        },
        {
          key: "createTime",
          title: "创建者及创建时间",
          dataIndex: "creator",
          width: 225,
          sorter: true,
          sortOrder: this.orderBy === "createTime" ? this.orderRule : false,
          customRender: ({
            text: creator,
            record,
          }: {
            text: User;
            record: ObjHistoryTrackerDto;
          }) => {
            const time = getTimeStringFromTimestamp(record.createTime);

            return (
              <div>
                <div>创建者：{creator.userName}</div>
                <div>创建时间：{time}</div>
              </div>
            );
          },
        },
        {
          key: "updateTime",
          title: "最近修改人及修改时间",
          dataIndex: "updater",
          width: 225,
          sorter: true,
          sortOrder: this.orderBy === "updateTime" ? this.orderRule : false,
          customRender: ({
            text: updater,
            record,
          }: {
            text: User;
            record: ObjHistoryTrackerDto;
          }) => {
            const time = getTimeStringFromTimestamp(record.updateTime);

            return (
              <div>
                <div>最近修改人：{updater.userName}</div>
                <div>修改时间：{time}</div>
              </div>
            );
          },
        },
        {
          key: "operation",
          title: "操作",
          width: 70,
          fixed: "right",
          customRender: ({ record }: { record: ObjHistoryTrackerDto }) => (
            <u-text-button on-click={this.onView.bind(this, record)}>
              详情
            </u-text-button>
          ),
        },
      ];
      const finallyColumn = column.slice(0);
      (finallyColumn as TableColumn[]).splice(3, 0, {
        key: "routePaths",
        title: "对象路由",
        dataIndex: "routePaths",
        customRender: ({ text: routePaths }: { text: Array<any> }) =>
          routePaths.map((v) => v.path).join("、"),
      });

      return (this.objType === 1 ? finallyColumn : column) as TableColumn[];
    },
  },
  data() {
    const _list: ObjHistoryTrackerDto[] = [];
    const _orderBy: "createTime" | "updateTime" | "objVersionName" =
      "createTime";
    const _orderRule: "descend" | "ascend" = "descend";

    return {
      list: _list,
      orderBy: _orderBy,
      orderRule: _orderRule,
    };
  },

  methods: {
    onView(record: ObjHistoryTrackerDto) {
      this.$createInstance(ObjectViewDrawer, {
        id: record.id,
        historyId: record.historyId,
      });
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

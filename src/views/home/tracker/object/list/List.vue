<template>
  <div>
    <a-table
      class="table-row-align-middle object-manage-table"
      :indentSize="32"
      tableLayout="auto"
      size="middle"
      :scroll="scroll"
      :columns="columns"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      :rowClassName="rowClassName"
      :expandedRowKeys="expandedRowKeys"
      rowKey="spmLink"
      @change="onChangeTable"
      @expand="expandTable"
    ></a-table>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import ObjectEditDrawer from "./ObjectEditDrawer.vue";
import { TablePagination } from "@/types/table.type";
import { ObjItemDto, ObjTypeEnum } from "@/types/object.type";
import moment from "moment";

import { objectType, elementType } from "./const";

const genBackground = (level: number) => {
  if (level > 0) {
    let background = "linear-gradient(to right, #fff 0%, #fff 30px,";
    let color = "#f6f7fa";
    let stop: any = 30;

    for (let i = 0; i < level; i++) {
      background += ` ${color} ${stop}px,`;

      if (i === level - 1) {
        background += ` ${color} 100%`;
      } else {
        stop += 32;
        background += ` ${color} ${stop}px,`;
      }

      color = color === "#f6f7fa" ? "#fff" : "#f6f7fa";
    }

    background += ")";
    return background;
  }

  return "#fff";
};

export default defineComponent({
  name: "List",
  components: {},
  props: {
    list: {},
    releaseId: {},
    loading: {
      type: Boolean,
    },
    pagination: {},
    selectedRowKeys: {},
    orderBy: {},
    orderRule: {},
    filterConditions: {},
    spmsToExpand: [],
  },
  computed: {
    scroll() {
      return {
        x: "max-content",
      };
    },

    rowSelection() {
      return {
        columnWidth: 48,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows: ObjItemDto[]) => {
          const selectRowIds = selectedRows.map((v) => v.id);

          this.$emit("select", selectedRowKeys, selectRowIds);
        },
      };
    },

    columns() {
      const columns = [
        {
          key: "oid",
          title: "对象oid（名称）",
          dataIndex: "oid",
          sorter: true,
          sortOrder: this.orderBy === "oid" ? this.orderRule : false,
          customRender: ({ record }: { record: ObjItemDto }) => {
            const { otherAppId = "" } = record;
            const cls = otherAppId ? "" : "text-link";
            const style = otherAppId ? "color: orange;" : "";

            return (
              <div class="flex-ac" style="display: inline-flex">
                <span
                  style={style}
                  class={cls}
                  onClick={() => {
                    if (otherAppId) return;

                    this.showObjectDetail(record);
                  }}
                >
                  {`${record.oid}（${record.name}）`}
                </span>
              </div>
            );
          },
          customCell: (record) => {
            const background = record.isRoot
              ? "#f6f7fa"
              : genBackground(record.gap);

            return {
              style: { "min-width": "200px", background },
            };
          },
        },
        {
          key: "type",
          title: "对象类型",
          dataIndex: "type",
          width: 100,
          sorter: true,
          sortOrder: this.orderBy === "type" ? this.orderRule : false,
          customRender: ({ text: type }: { text: ObjTypeEnum }) => (
            <span>{objectType[type]}</span>
          ),
        },
        {
          key: "objSubType",
          title: "元素类型",
          dataIndex: "objSubType",
          width: 100,
          customRender: ({ text }: { text: string }) => (
            <span>{elementType[text]}</span>
          ),
        },
        {
          key: "creator",
          title: "创建人",
          dataIndex: "createName",
          width: 100,
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
        },
        {
          key: "createTime",
          title: "创建时间",
          dataIndex: "createTime",
          width: 165,
          sorter: true,
          sortOrder: this.orderBy === "createTime" ? this.orderRule : false,
          customRender: ({ text: createTime }: { text: number }) => {
            const time = moment(createTime).format("YYYY-MM-DD HH:mm:ss");

            return <span>{time}</span>;
          },
        },
        {
          key: "updater",
          title: "最近修改人",
          dataIndex: "updateName",
          width: 100,
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
        },
        {
          key: "updateTime",
          title: "最近修改时间",
          dataIndex: "updateTime",
          width: 165,
          sorter: true,
          sortOrder: this.orderBy === "updateTime" ? this.orderRule : false,
          customRender: ({ text: updateTime }: { text: number }) => {
            const time = moment(updateTime).format("YYYY-MM-DD HH:mm:ss");

            return <span>{time}</span>;
          },
        },
        {
          key: "operation",
          title: () => {
            return (
              <div class="flex-ac">
                <span class="g-mr-24">操作</span>
              </div>
            );
          },
          width: 120,
          fixed: "right",
          customRender: ({ record }: { record: ObjItemDto }) => {
            return (
              <u-text-button on-click={this.onEdit.bind(this, record)}>
                编辑
              </u-text-button>
            );
          },
        },
      ];

      return columns.filter((c) =>
        [...this.colKeys, "operation"].includes(c.key)
      );
    },
  },

  watch: {
    spmsToExpand(value) {
      this.expandedRowKeys = value;
    },
  },

  data() {
    // 维护列表的列数组 key
    const _colKeys = [
      "name",
      "oid",
      "type",
      "objSubType",
      "bizGroup",
      "creator",
      "createTime",
      "updater",
      "updateTime",
    ];

    return { colKeys: _colKeys, expandedRowKeys: [] };
  },

  methods: {
    showObjectDetail(record) {
      this.$createInstance(ObjectEditDrawer, {
        id: record.id,
        trackerId: record.trackerId,
        historyId: record.historyId || null,
        reqPoolId: record.reqPoolId,
        releasedId: this.filterConditions.versionIds,
        record,
        conditions: this.filterConditions,
        spm: [],
        from: "objectManage",
        isPreview: true,
      });
    },

    onColKeysChange(v) {
      this.colKeys = v;
    },

    rowClassName(record: ObjItemDto) {
      return record.isRoot || record.level % 2 === 1 ? "row-gray" : "row-white";
    },

    onView(record: ObjItemDto) {
      this.$router.push({
        path: "/tracker/object/detail",
        query: {
          ...this.$route.query,
          objId: String(record.id),
          historyId: String(record.historyId),
        },
      });
    },

    // 编辑对象
    onEdit(record) {
      const spm = null;

      this.$createInstance(ObjectEditDrawer, {
        id: record.objId,
        historyId: record.historyId || null,
        record,
        disabled: true,
        spm,
        reqPoolId: record.reqPoolId,
        conditions: this.filterConditions,
        from: "objectManage",
        refreshTable: () => {
          // 触发更新且不更改 expand 状态
          this.$emit("sync", false, false);
        },
      });
    },

    onChangeTable(pagination: TablePagination, filter, sorter) {
      this.$emit("changeTable", pagination, filter, sorter);
    },

    expandTable(expand, record) {
      const newKeys = [...this.expandedRowKeys];

      // 更新 expandedRowKeys
      this.expandedRowKeys = expand
        ? newKeys.concat([record.spmLink])
        : newKeys.filter((item) => item !== record.spmLink);
    },
  },
});
</script>

<style lang="less" scoped="true">
.object-manage-table {
  :deep(td.ant-table-selection-column) {
    background: #fff;
  }
  :deep(.ant-table-tbody > tr.ant-table-row-selected td) {
    background: #fafafa !important;
  }
  :deep(.ant-table-row.row-white) {
    background: #fff;
  }

  :deep(.ant-table-row.row-gray) {
    background: #f6f7fa;
  }
}
</style>
<style lang="less">
.ant-table-thead
  > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td,
.ant-table-tbody
  > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td {
  background: #e6efff !important;
}
</style>

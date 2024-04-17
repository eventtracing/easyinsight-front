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
import TemplateEditDrawer from "./templateEditDrawer.vue";
import TemplateDetailDrawer from "./templateDetailDrawer.vue";
import { User } from "@/types/common.type";
import { TablePagination, TableColumn } from "@/types/table.type";
import { TemplateSimpleDto } from "@/types/template.type";
import { deleteTemplate } from "@/services/template.service";
import { getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";
import { DownOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "List",
  components: { DownOutlined },
  props: {
    list: {},
    loading: { type: Boolean },
    pagination: {},
    orderBy: {},
    orderRule: {},
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
          key: "name",
          title: "模板名称",
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
          key: "description",
          title: "模板描述",
          dataIndex: "description",
          customRender: ({ text }: { text: string }) => (
            <u-text-tooltip
              text={text || "-"}
              maxLineCount={2}
            ></u-text-tooltip>
          ),
          customCell: () => ({
            style: {
              "max-width": "300px",
            },
          }),
        },
        {
          key: "creator",
          title: "创建者",
          dataIndex: "creator",
          customRender: ({ text: creator }: { text: User }) => (
            <span>{creator.userName}</span>
          ),
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
          key: "updater",
          title: "最近修改者",
          dataIndex: "updater",
          customRender: ({ text: updater }: { text: User }) => (
            <span>{updater.userName}</span>
          ),
        },
        {
          key: "updateTime",
          title: "最近修改时间",
          dataIndex: "updateTime",
          width: 165,
          sorter: true,
          sortOrder: this.orderBy === "updateTime" ? this.orderRule : false,
          customRender: ({ text }: { text: number }) => {
            const time = getTimeStringFromTimestamp(text);

            return <span>{time}</span>;
          },
        },
        {
          key: "operation",
          title: "操作",
          width: 145,
          customRender: ({ record }: { record: TemplateSimpleDto }) => {
            const slots = {
              overlay: () => (
                <a-menu slot="overlay">
                  <a-menu-item>
                    <u-text-button
                      disabled={this.checkAuth(1024)}
                      class="u-dropdown-btn"
                      on-click={this.onCopy.bind(this, record)}
                    >
                      复制
                    </u-text-button>
                  </a-menu-item>
                  <a-menu-item>
                    <u-text-button
                      disabled={this.checkAuth(1025)}
                      class="u-dropdown-btn"
                      on-click={this.onDelete.bind(this, record)}
                    >
                      删除
                    </u-text-button>
                  </a-menu-item>
                </a-menu>
              ),
            };

            return (
              <span>
                <u-text-button on-click={this.onView.bind(this, record)}>
                  详情
                </u-text-button>
                <u-text-button
                  disabled={this.checkAuth(1023)}
                  on-click={this.onEdit.bind(this, record)}
                >
                  编辑
                </u-text-button>
                <a-dropdown v-slots={slots}>
                  <span style="margin-left: 12px">
                    <u-text-button>
                      更多
                      <DownOutlined style="transform: scale(0.833333)" />
                    </u-text-button>
                  </span>
                </a-dropdown>
              </span>
            );
          },
        },
      ];
    },
  },
  methods: {
    onView(record: TemplateSimpleDto) {
      this.$createInstance(TemplateDetailDrawer, { id: record.id });
    },
    onEdit(record: TemplateSimpleDto) {
      this.$createInstance(TemplateEditDrawer, {
        id: record.id,
        onOk: () => {
          this.$emit("sync");
        },
      });
    },
    onCopy(record: TemplateSimpleDto) {
      this.$createInstance(TemplateEditDrawer, {
        id: record.id,
        copy: true,
        onOk: () => {
          this.$emit("sync");
        },
      });
    },
    onDelete(record: TemplateSimpleDto) {
      this.$confirm({
        title: "确定要删除吗？",
        content: `模板名称：${record.name}`,
        onOk: () => {
          deleteTemplate(record.id)
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

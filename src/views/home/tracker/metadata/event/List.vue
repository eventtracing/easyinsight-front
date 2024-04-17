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
import EventEditModal from "./EventEditModal.vue";
import ParamConfigDrawer from "../components/ParamConfigDrawer.vue";
import { User } from "@/types/common.type";
import { TablePagination, TableColumn } from "@/types/table.type";
import { EventSimpleDto } from "@/types/event.type";
import { EntityTypeEnum } from "@/types/version.type";
import { ObjTypeEnum } from "@/types/object.type";
import { deleteEvent, updateEvent } from "@/services/event.service";
import { getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";

export default defineComponent({
  name: "List",
  props: {
    list: {},
    loading: { type: Boolean },
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
          key: "code",
          title: "事件编码",
          dataIndex: "code",
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
          key: "name",
          title: "事件名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => (
            <u-text-tooltip text={text} maxLineCount={2}></u-text-tooltip>
          ),
          customCell: () => {
            return {
              style: {
                "max-width": "200px",
              },
            };
          },
        },
        {
          key: "description",
          title: "描述",
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
          key: "applicableObjTypes",
          title: "适用类型",
          dataIndex: "applicableObjTypes",
          customRender: ({
            text: applicableObjTypes,
          }: {
            text: ObjTypeEnum[];
          }) => {
            const objectType = this.$store.state.objectType;
            const text = applicableObjTypes
              .map((v) => {
                const text = objectType.find(
                  (obj) => +ObjTypeEnum[obj.key] === v
                )?.value;

                return text;
              })
              .join("、");

            return <span>{text}</span>;
          },
        },
        {
          key: "selectedByDefault",
          title: "是否默认选中",
          dataIndex: "selectedByDefault",
          customRender: ({
            text: selectedByDefault,
            record,
          }: {
            text: boolean;
            record: EventSimpleDto;
          }) => (
            <a-switch
              checked={selectedByDefault}
              onChange={this.onSwitch.bind(this, record)}
            ></a-switch>
          ),
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
          key: "operation",
          title: "操作",
          width: 165,
          customRender: ({
            record,
          }: {
            text: number;
            record: EventSimpleDto;
          }) => (
            <span>
              <u-text-button
                disabled={this.checkAuth(1028)}
                on-click={this.onEdit.bind(this, record)}
              >
                编辑
              </u-text-button>
              <u-text-button
                disabled={this.checkAuth(1029)}
                on-click={this.onDelete.bind(this, record)}
              >
                删除
              </u-text-button>
              <u-text-button
                disabled={this.checkAuth(1030)}
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
    onEdit(record: EventSimpleDto) {
      this.$createInstance(EventEditModal, {
        id: record.id,
        onHandlerOk: () => {
          this.$emit("sync");
        },
      });
    },

    onDelete(record: EventSimpleDto) {
      this.$confirm({
        title: "确定要删除吗？",
        content: `事件类型：${record.name}`,
        onOk: () => {
          deleteEvent(record.id)
            .then(() => {
              this.$message.success("删除成功");
              this.$emit("sync");
            })
            .catch((e) => {
              this.$warning({ title: e.message });
            });
        },
      });
    },

    onBindParam(record: EventSimpleDto) {
      this.$createInstance(ParamConfigDrawer, {
        entityId: record.id,
        entityType: EntityTypeEnum.EVENT,
        name: record.name,
        code: record.code,
      });
    },

    onSwitch(record: EventSimpleDto, checked: boolean) {
      updateEvent({ ...record, selectedByDefault: checked })
        .then(() => {
          record.selectedByDefault = checked;
        })
        .catch(() => {});
    },

    onChangeTable(pagination: TablePagination, filter, sorter) {
      this.$emit("changeTable", pagination, filter, sorter);
    },
  },
});
</script>

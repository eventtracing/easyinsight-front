<template>
  <a-table
    size="small"
    :columns="columns"
    :dataSource="list"
    tableLayout="auto"
    :pagination="false"
    :rowKey="(record) => record.terminalName"
  ></a-table>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { TableColumn } from "@/types/table.type";

export default defineComponent({
  name: "ObjTrackerTable",
  props: {
    list: {},
    simple: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    scroll() {
      return {
        x: "max-content",
      };
    },

    columns(): TableColumn[] {
      const columns = [
        {
          key: "terminalName",
          title: "终端",
          dataIndex: "terminalName",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
        },
        {
          key: "terminalVersionName",
          title: "端版本",
          dataIndex: "terminalVersionName",
          customRender: ({ text }: { text: string }) => (
            <span>{text || "-"}</span>
          ),
          customCell: () => ({
            style: {
              "min-width": "100px",
            },
          }),
        },
        {
          key: "taskNames",
          title: "任务",
          dataIndex: "taskNames",
          customRender: ({ text }: { text: string[] }) => (
            <span>{text.join(" | ")}</span>
          ),
          customCell: () => ({
            style: {
              "min-width": "120px",
            },
          }),
        },
        {
          key: "eventNames",
          title: "事件类型",
          dataIndex: "eventNames",
          customRender: ({ text }: { text: string[] }) => (
            <span>{text.join("，")}</span>
          ),
          customCell: () => ({
            style: {
              "min-width": "80px",
            },
          }),
        },
      ];

      if (!this.simple) {
        columns.splice(3, 0, {
          key: "requireNames",
          title: "需求",
          dataIndex: "requireNames",
          customRender: ({ text }: { text: string[] }) => (
            <span>{text.join(" | ") || "-"}</span>
          ),
          customCell: () => ({
            style: {
              "min-width": "60px",
            },
          }),
        });

        columns.push(
          {
            key: "taskOwners",
            title: "负责人",
            dataIndex: "taskOwners",
            customRender: ({ text: taskOwners }: { text: any }) => {
              const text = taskOwners.map((u) => u.userName).join(" | ");

              return <span>{text || "-"}</span>;
            },
            customCell: () => ({
              style: {
                "min-width": "80px",
              },
            }),
          },
          {
            key: "taskVerifiers",
            title: "验证人",
            dataIndex: "taskVerifiers",
            customRender: ({ text: taskVerifiers }: { text: any }) => {
              const text = taskVerifiers.map((u) => u.userName).join(" | ");

              return <span>{text || "-"}</span>;
            },
            customCell: () => ({
              style: {
                "min-width": "80px",
              },
            }),
          }
        );
      }

      return columns;
    },
  },
});
</script>

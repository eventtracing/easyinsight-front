<template>
  <div
    :style="fromObject ? {} : { 'min-height': 300 }"
    class="param-table-list"
  >
    <a-table
      size="middle"
      :columns="columns"
      :rowKey="(record, index) => index"
      :pagination="false"
      :dataSource="list"
      :rowClassName="rowClassName"
    ></a-table>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { TableColumn } from "@/types/table.type";
import { ParamValueTypeEnum } from "@/types/parameter.type";
export default defineComponent({
  name: "ParamTableList",
  props: {
    list: {},
    fromObject: {
      default: false,
    },
  },
  methods: {
    rowClassName(record) {
      return record.diffType || "";
    },
  },
  computed: {
    columns(): TableColumn[] {
      return [
        {
          key: "order",
          title: "序号",
          customRender: ({ index }: { index: number }) => (
            <span>{index + 1}</span>
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
          key: "must",
          title: "必传",
          dataIndex: "must",
          customRender: ({ text }: { text: boolean }) => (
            <a-checkbox disabled checked={text}></a-checkbox>
          ),
        },
        {
          key: "code",
          title: "参数名",
          dataIndex: "code",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
        },
        {
          key: "name",
          title: "中文名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => (
            <u-text-tooltip
              text={text || "-"}
              maxLineCount={2}
            ></u-text-tooltip>
          ),
        },
        {
          key: "valueType",
          title: "取值类型",
          dataIndex: "valueType",
          customRender: ({ text: valueType }: { text: ParamValueTypeEnum }) => (
            <span>
              {valueType === ParamValueTypeEnum.CONSTANT ? "常量" : "变量"}
            </span>
          ),
        },
        {
          key: "values",
          title: "取值",
          dataIndex: "values",
          customRender: ({ text }: { text: any[] }) => (
            <span>
              {this.fromObject
                ? text.map((v) => v.code).join(",")
                : text.join(",")}
            </span>
          ),
        },
        {
          key: "notEmpty",
          title: "非空",
          dataIndex: "notEmpty",
          customRender: ({ text: notEmpty }: { text: boolean }) => (
            <a-checkbox disabled checked={notEmpty}></a-checkbox>
          ),
        },
        {
          key: "isEncode",
          title: "是否编码",
          dataIndex: "isEncode",
          customRender: ({ text: isEncode }: { text: boolean }) => (
            <a-checkbox disabled checked={isEncode}></a-checkbox>
          ),
        },
        {
          key: "description",
          title: "取值描述",
          dataIndex: "description",
          customRender: ({ text }: { text: string }) => (
            <span>{text || "-"}</span>
          ),
        },
      ];
    },
  },
});
</script>

<style lang="less">
.param-table-list {
  .row-new {
    background: #ecfdf0;
  }
  .row-del {
    background: #fbe9eb;
  }

  .row-mod {
    background-color: #fafad7;
  }
}
</style>

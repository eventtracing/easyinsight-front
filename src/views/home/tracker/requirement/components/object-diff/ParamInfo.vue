<template>
  <div>
    <div class="text-title g-m-tb-16">参数配置</div>
    <a-table
      class="g-mt-16 param-compare-table"
      size="middle"
      :columns="columns"
      :rowClassName="rowClassName"
      :rowKey="(record, index) => index"
      :pagination="false"
      :dataSource="diffParams"
    ></a-table>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { TableColumn } from "@/types/table.type";
import { ChangeTypeEnum } from "@/types/object.type";
import { ParamDiffVO } from "@/types/terminalVersion.type";
import { ParamValueTypeEnum } from "@/types/parameter.type";
import { genClasses, genTooltip } from "./util";
export default defineComponent({
  name: "ParamInfo",
  setup() {
    const _ChangeTypeEnum = ChangeTypeEnum;
    const _genTooltip = genTooltip;
    return {
      ChangeTypeEnum: _ChangeTypeEnum,
      genTooltip: _genTooltip,
    };
  },
  props: {
    terminalName: {},
    diffParams: {},
  },
  computed: {
    columns(): TableColumn[] {
      return [
        {
          key: "code",
          title: "参数名称",
          dataIndex: "code",
          customRender: ({ text }: { text: string }) => {
            return <span>{text}</span>;
          },
          customCell: () => {
            return {
              style: {
                "min-width": "120px",
                "padding-left": "24px",
              },
            };
          },
          customHeaderCell: () => {
            return {
              style: {
                "padding-left": "24px",
              },
            };
          },
        },
        {
          key: "must",
          title: "必传",
          dataIndex: "must",
          width: 80,
          customRender: ({ text }: { text: boolean }) => {
            return <a-checkbox disabled checked={text}></a-checkbox>;
          },
        },
        {
          key: "name",
          title: "中文名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => {
            return (
              <u-text-tooltip
                text={text || "-"}
                maxLineCount={2}
              ></u-text-tooltip>
            );
          },
          customCell: () => {
            return {
              style: {
                "min-width": "120px",
              },
            };
          },
        },
        {
          key: "valueType",
          title: "取值类型",
          dataIndex: "valueType",
          width: 100,
          customRender: ({ text: valueType }: { text: ParamValueTypeEnum }) => {
            return (
              <span>
                {valueType === ParamValueTypeEnum.CONSTANT ? "常量" : "变量"}
              </span>
            );
          },
        },
        {
          key: "values",
          title: "取值",
          dataIndex: "values",
          customRender: ({ text }: { text: string[] }) => {
            return <span>{text.join(",") || "-"}</span>;
          },
        },
        {
          key: "notEmpty",
          title: "非空",
          dataIndex: "notEmpty",
          width: 80,
          customRender: ({ text: notEmpty }: { text: boolean }) => {
            return <a-checkbox disabled checked={notEmpty}></a-checkbox>;
          },
        },
        {
          key: "description",
          title: "描述",
          dataIndex: "description",
          customRender: ({ text }: { text: string }) => {
            return <span>{text}</span>;
          },
        },
        {
          key: "tooltip",
          title: "",
          width: 40,
          customRender: ({ record }: { record: ParamDiffVO }) => {
            return record.paramChangeType === ChangeTypeEnum.SAME ? (
              ""
            ) : (
              <u-hint-tooltip text="" title={genTooltip(record)} />
            );
          },
          customCell: () => {
            return {
              style: {
                "background-color": "#fff !important",
              },
            };
          },
        },
      ];
    },
  },
  methods: {
    rowClassName(record: ParamDiffVO) {
      return genClasses(record.paramChangeType);
    },
  },
});
</script>

<style lang="less">
.param-compare-table {
  word-break: break-word;
  .new-item,
  .new-item td {
    background-color: #e9f8f1 !important;
  }
  .delete-item,
  .delete-item td {
    background-color: #feedee !important;
  }
}
</style>

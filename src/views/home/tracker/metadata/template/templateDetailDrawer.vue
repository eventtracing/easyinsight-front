<template>
  <u-drawer
    title="模板详情"
    :maskClosable="true"
    :width="1000"
    :visible="true"
    @handlerClose="handleClose"
  >
    <u-collapse v-if="detail" header="基础信息">
      <u-info size="large" :labelWidth="90">
        <u-info-item label="模板id">{{ detail.id }}</u-info-item>
        <u-info-item label="模板名称">{{ detail.name }}</u-info-item>
        <u-info-item label="模板描述">{{ detail.description }}</u-info-item>
        <u-info-item label="创建人">{{ detail.creator.userName }}</u-info-item>
        <u-info-item label="创建时间">{{
          getTimeStringFromTimestamp(detail.createTime)
        }}</u-info-item>
        <u-info-item label="最近更新人">{{
          detail.updater.userName
        }}</u-info-item>
        <u-info-item label="最近更新时间">{{
          getTimeStringFromTimestamp(detail.updateTime)
        }}</u-info-item>
      </u-info>
    </u-collapse>
    <u-collapse v-if="detail" header="参数配置">
      <a-table
        size="small"
        :columns="columns"
        :dataSource="detail.binds"
        :pagination="false"
        :rowKey="(record) => record.id"
      ></a-table>
    </u-collapse>
  </u-drawer>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { TableColumn } from "@/types/table.type";
import { ParamValueTypeEnum } from "@/types/parameter.type";
import { TemplateDetailDto, ParamBindItemDto } from "@/types/template.type";
import { getTemplateDetail } from "@/services/template.service";
import { getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";
export default defineComponent({
  name: "TemplateEditDrawer",
  setup() {
    const _getTimeStringFromTimestamp = getTimeStringFromTimestamp;
    return {
      getTimeStringFromTimestamp: _getTimeStringFromTimestamp,
    };
  },
  props: {
    id: {},
  },
  computed: {
    columns(): TableColumn[] {
      return [
        {
          key: "must",
          title: "必填",
          dataIndex: "must",
          width: 50,
          customRender: ({ text }: { text: boolean }) => (
            <a-checkbox disabled={true} checked={text}></a-checkbox>
          ),
        },
        {
          key: "code",
          title: "参数名",
          dataIndex: "code",
          width: 160,
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
          customCell: () => ({
            style: {
              "padding-left": "12px",
            },
          }),
          customHeaderCell: () => ({
            style: {
              "padding-left": "12px",
            },
          }),
        },
        {
          key: "name",
          title: "中文名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => (
            <u-text-tooltip text={text} maxLineCount={2}></u-text-tooltip>
          ),
        },
        {
          key: "selectedValues",
          title: "取值",
          dataIndex: "selectedValues",
          width: 220,
          customRender: ({
            text: selectedValues,
            record,
          }: {
            text: number[];
            record: ParamBindItemDto;
          }) => {
            const text = selectedValues
              .map((id) => record.values.find((v) => v.id === id)?.code)
              .join("、");

            return (
              <u-text-tooltip
                text={text || "-"}
                maxLineCount={2}
              ></u-text-tooltip>
            );
          },
        },
        {
          key: "valueType",
          title: "取值类型",
          dataIndex: "valueType",
          width: 80,
          customRender: ({ text: type }: { text: ParamValueTypeEnum }) => (
            <span>
              {type === ParamValueTypeEnum.CONSTANT ? "常量" : "变量"}
            </span>
          ),
        },
        {
          key: "description",
          title: "取值描述",
          dataIndex: "description",
          width: 200,
          customRender: ({ text }: { text: string }) => (
            <u-text-tooltip
              text={text || "-"}
              maxLineCount={2}
            ></u-text-tooltip>
          ),
        },
        {
          key: "notEmpty",
          title: "非空",
          dataIndex: "notEmpty",
          width: 50,
          customRender: ({ text }: { text: boolean }) => (
            <a-checkbox disabled={true} checked={text}></a-checkbox>
          ),
        },
        {
          key: "isEncode",
          title: "是否编码",
          dataIndex: "isEncode",
          width: 100,
          customRender: ({ text }: { text: boolean }) => (
            <a-checkbox disabled={true} checked={text}></a-checkbox>
          ),
        },
      ];
    },
  },
  data() {
    const _detail: TemplateDetailDto = null;

    return { detail: _detail };
  },
  async created() {
    this.detail = await getTemplateDetail(this.id);
  },
  methods: {
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

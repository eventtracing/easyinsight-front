<template>
  <u-drawer
    title="参数详情"
    :width="600"
    :visible="true"
    footer=""
    @handlerClose="handleClose"
  >
    <div v-if="detail">
      <u-collapse header="基础信息">
        <u-info size="large" :labelWidth="90">
          <u-info-item label="参数类型">{{ paramTypeName }}</u-info-item>
          <u-info-item label="参数名">{{ detail.code }}</u-info-item>
          <u-info-item label="中文名称">{{ detail.name }}</u-info-item>
          <u-info-item label="取值类型">{{ paramValueTypeName }}</u-info-item>
          <u-info-item label="描述">{{ detail.description }}</u-info-item>
        </u-info>
      </u-collapse>
      <u-collapse header="取值信息">
        <a-table
          size="small"
          :columns="columns"
          :dataSource="detail.values"
          :pagination="false"
          :rowKey="(record) => record.id"
        ></a-table>
      </u-collapse>
      <u-collapse header="其他信息">
        <u-info size="large" :labelWidth="90">
          <u-info-item label="创建人">{{
            detail.creator.userName
          }}</u-info-item>
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
    </div>
    <template #footer="">
      <a-button type="primary" @click="handleClose">知道了</a-button>
    </template>
  </u-drawer>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { TableColumn } from "@/types/table.type";
import {
  paramTypeNameMap,
  ParamValueTypeEnum,
  ParameterDetailDto,
} from "@/types/parameter.type";
import { getParamDetail } from "@/services/parameter.service";
import { getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";
export default defineComponent({
  name: "ParamDetailDrawer",

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
    paramTypeName() {
      return this.detail?.paramType
        ? paramTypeNameMap[this.detail.paramType]
        : "";
    },

    paramValueTypeName() {
      if (!this.detail?.valueType) return "";

      return this.detail.valueType === ParamValueTypeEnum.CONSTANT
        ? "常量"
        : "变量";
    },

    columns(): TableColumn[] {
      return [
        {
          key: "code",
          title: "code",
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
          title: "中文名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => {
            return (
              <u-text-tooltip text={text} maxLineCount={2}></u-text-tooltip>
            );
          },
        },
        {
          key: "description",
          title: "描述",
          dataIndex: "description",
          customRender: ({ text }: { text: string }) => {
            return (
              <u-text-tooltip
                text={text || "-"}
                maxLineCount={2}
              ></u-text-tooltip>
            );
          },
        },
      ];
    },
  },

  data() {
    const _detail: ParameterDetailDto = null;

    return { detail: _detail };
  },

  async created() {
    this.detail = await getParamDetail(this.id);
  },

  methods: {
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

<template>
  <div class="g-object__detail">
    <TopFilter
      :id="id"
      :conditions="filterConditions"
      @change="onFilterChange"
    ></TopFilter>
    <a-collapse v-model:activeKey="activeKey" :bordered="false" class="g-mt-16">
      <a-collapse-panel class="g-mb-16" key="1" header="对象标准私参">
        <a-table
          style="word-break: break-word"
          class="g-mt-16"
          size="middle"
          :columns="columns"
          :rowKey="(record) => record.id"
          :pagination="false"
          :dataSource="$get(detail, 'objNormalParam', [])"
        ></a-table>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="对象业务私参">
        <a-table
          style="word-break: break-word"
          class="g-mt-16"
          size="middle"
          :columns="columns"
          :rowKey="(record, index) => index"
          :pagination="false"
          :dataSource="$get(detail, 'objBusinessPrivateParam', [])"
        ></a-table>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="事件公参">
        <EventConfigForm
          :events="events"
          :item="detail || {}"
          disabled
          :showAllEvents="false"
        ></EventConfigForm>
      </a-collapse-panel>
      <a-collapse-panel key="5" header="全局公参">
        <div class="g-mb-8">
          {{ $get(detail, "globalPublicParam.versionName", "-") }}
        </div>
        <ParamTableList
          :list="((detail || {}).globalPublicParam || {}).params || []"
        ></ParamTableList>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="tsx">
import { defineComponent, reactive } from "vue";
import TopFilter from "./ParamConfigFilter.vue";
import ParamTableModal from "./ParamTableModal.vue";
import { TableColumn } from "@/types/table.type";
import { ObjParamDto, ParamWithValueItemDto } from "@/types/object.type";
import { ParamValueTypeEnum } from "@/types/parameter.type";
import EventConfigForm from "../list/EventConfigForm.vue";
import { getEventList } from "@/services/event.service";
import ParamTableList from "./ParamTableList.vue";

export interface FilterDto {
  terminalId: number;
  versionId: number;
}

export default defineComponent({
  name: "ParamConfigTab",
  components: {
    TopFilter,
    EventConfigForm,
    ParamTableList,
  },
  setup() {
    const _activeKey: string[] = reactive(["1", "2", "3", "5"]);

    return {
      activeKey: _activeKey,
    };
  },
  props: {
    id: {},
  },
  computed: {
    filterConditions() {
      return {
        terminalId: this.terminalId,
        versionId: this.versionId,
      };
    },
    columns(): TableColumn[] {
      return [
        {
          key: "order",
          title: "序号",
          width: 80,
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
          width: 80,
          customRender: ({ text }: { text: boolean }) => (
            <a-checkbox disabled checked={text}></a-checkbox>
          ),
        },
        {
          key: "code",
          title: "参数名称",
          dataIndex: "code",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
          customCell: () => ({
            style: {
              "min-width": "120px",
            },
          }),
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
          customCell: () => ({
            style: {
              "min-width": "120px",
            },
          }),
        },
        {
          key: "valueType",
          title: "取值类型",
          dataIndex: "valueType",
          width: 100,
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
          customRender: ({ text }: { text: string[] }) => (
            <span>{text.join(",") || "-"}</span>
          ),
        },
        {
          key: "notEmpty",
          title: "非空",
          dataIndex: "notEmpty",
          width: 80,
          customRender: ({ text: notEmpty }: { text: boolean }) => (
            <a-checkbox disabled checked={notEmpty}></a-checkbox>
          ),
        },
        {
          key: "isEncode",
          title: "是否编码",
          dataIndex: "isEncode",
          width: 80,
          customRender: ({ text: isEncode }: { text: boolean }) => (
            <a-checkbox disabled checked={isEncode}></a-checkbox>
          ),
        },
        {
          key: "description",
          title: "描述",
          dataIndex: "description",
          customRender: ({ text }: { text: string }) => (
            <span>{text || "-"}</span>
          ),
        },
      ];
    },
  },

  data() {
    const _terminalId = null;
    const _versionId = null;
    const _detail: ObjParamDto = null;
    const _events = [];

    return {
      terminalId: _terminalId,
      versionId: _versionId,
      detail: _detail,
      events: _events,
    };
  },

  created() {
    this.getEventLists();
  },

  methods: {
    async onFilterChange(conditions: FilterDto) {
      const { terminalId, versionId } = conditions;

      this.terminalId = terminalId;
      this.versionId = versionId;
    },

    getEventLists() {
      getEventList({ currentPage: 1, pageSize: 80, search: "" }).then((res) => {
        this.events = res.list;
      });
    },

    onViewParam(list: ParamWithValueItemDto[]) {
      this.$createInstance(ParamTableModal, {
        list: list,
      });
    },
  },
});
</script>

<style lang="less" scoped="true">
.g-object__detail {
  :deep(.ant-collapse-content-box) {
    background: #fff;
  }
  :deep(.ant-collapse-borderless) {
    background: #fff;
  }
  :deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header) {
    background: #fafafa;
  }
}
</style>

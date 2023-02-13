<template>
  <div class="g-mb-16">
    <RowSelectionTable
      size="small"
      rowKey="spmLink"
      selectParam="-"
      :columns="columns"
      :data="dataSource"
      :pagination="false"
      :loading="loading"
      :rowClassName="rowClassName"
      :checkProps="checkProps"
      :scroll="{ x: 'max-content' }"
      :expandedRowKeys="expandKeys"
      @changeRowKeys="$attrs.onChangeRowKeys"
      @expand="expandTable"
    >
    </RowSelectionTable>
  </div>
</template>

<script setup lang="tsx">
import {
  getCurrentInstance,
  markRaw,
  ref,
  watch,
  toRefs,
  shallowReactive,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { genBackground } from "@/utils/common";
import type { TableColumn } from "@/types/table.type";
import type { TaskRelObjDto } from "@/types/requirement.type";
import { ReqStatusEnum } from "@/types/requirement.type";
import { createInstance } from "@/ndsc-vue3/utils/lib";
import ObjectEditDrawer from "../../../object/list/ObjectEditDrawer.vue";
import StatusTag from "../../components/StatusTag.vue";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";

const route = useRoute();
const checkProps = function (record) {
  return {
    disabled: !record.id || record.mergeConflict,
  };
};
const textExplain =
  "埋点结构上跟着父对象被复用；端依据View组件是否复用自行判断是否需要新开发；需求需关注，测试需通过";
const objectType = useStore().state.objectType;
const props = withDefaults(
  defineProps<{
    terminalId: number;
    reqPoolId: number | string;
    loading: boolean;
    terminalName?: string;
    dataSource?: Array<any>;
    spmsToExpand?: Array<any>;
  }>(),
  {
    terminalId: undefined,
    terminalName: "",
    loading: false,
    dataSource: () => [{ id: 1, name: 2 }],
  }
);

const { loading, dataSource } = toRefs(props);

const columns = markRaw<TableColumn[]>([
  {
    key: "name",
    title: "对象oid(名称)",
    dataIndex: "name",
    customRender: ({ record }: { record: TaskRelObjDto }) => {
      const { isReuse, otherAppId = "" } = record;
      return (
        <div class="flex-ac" style="display: inline-flex">
          {otherAppId ? (
            <span style="color: orange;">
              {record.oid}({record.objName})
            </span>
          ) : (
            <span class="text-link" onClick={onView.bind(this, record)}>
              {record.oid}({record.objName})
            </span>
          )}

          {isReuse && (
            <a-tag class="g-ml-16" color="orange">
              复用对象
            </a-tag>
          )}
        </div>
      );
    },
    customCell: (record) => {
      let background = record.isRoot ? "#dee2e6" : genBackground(record.gap);

      record.mergeConflict && (background = "#fbe9eb");

      return {
        style: { background, "min-width": "200px" },
      };
    },
  },
  {
    key: "options",
    title: "任务状态",
    dataIndex: "status",
    customRender: ({
      text: status,
      record,
    }: {
      text: ReqStatusEnum;
      record: any;
    }) => {
      if (record.id && !record.taskId) {
        return <StatusTag status="10"></StatusTag>;
      }

      return status ? <StatusTag status={status}></StatusTag> : "";
    },
  },
  {
    key: "objType",
    dataIndex: "objType",
    title: "对象类型",
    customRender({ text: type }) {
      let text = "";
      for (const { key, value } of objectType) {
        if (key === type) {
          text = value;
        }
      }

      return <span>{text}</span>;
    },
  },
  {
    key: "reqType",
    dataIndex: "reqType",
    title: "需求类型",
    customCell: (record) => {
      const color = record.reqType === "复用开发" ? "#d4b106" : "";
      return {
        style: { color },
      };
    },
    customRender: ({ text }) => {
      if (text === "复用开发") {
        return (
          <div>
            <span color="red">{text}</span>
            <a-tooltip title={textExplain} placement="top">
              <QuestionCircleOutlined style="margin-left: 4px; color: #666" />
            </a-tooltip>
          </div>
        );
      }

      return <div>{text}</div>;
    },
  },
  {
    key: "hasPicture",
    dataIndex: "hasPicture",
    title: "是否上传了图片",
    customRender: ({ text: hasPicture }) => (hasPicture ? "是" : "否"),
  },
  {
    key: "reqName",
    dataIndex: "reqName",
    title: "指派需求",
  },
  {
    key: "taskName",
    dataIndex: "taskName",
    title: "指派任务",
  },
]);

const showRelativeTask = ref<boolean>(false);
const instance = getCurrentInstance();
const expandKeys = shallowReactive([]);

function onView(record: TaskRelObjDto) {
  createInstance(ObjectEditDrawer, {
    parentContext: { _: instance },
    record,
    id: record.objId,
    reqPoolId: props.reqPoolId,
    historyId: record.historyId,
    trackerId: record.trackerId,
    terminalId: props.terminalId,
    conditions: { terminalIds: props.terminalId },
    isPreview: true,
    isDiff: true,
  });
}

// 编辑对象
function onEdit(record: TaskRelObjDto) {
  const disabled =
    record.status !== ReqStatusEnum.START &&
    record.status !== ReqStatusEnum.WAIT_VRFY;
  createInstance(ObjectEditDrawer, {
    parentContext: { _: instance },
    id: record.objId,
    historyId: record.historyId || null,
    record,
    reqPoolId: route.params.id,
    isList: true,
    disabled,
    onUpdateDisabled: (disabled) => {
      this.disabled = disabled;
    },
  });
}

function rowClassName(record) {
  if (record.mergeConflict) return "row-red";

  return record.gap % 2 === 0
    ? "row-gray"
    : record.isRoot
    ? "row-root"
    : "row-white";
}

function optionExpandKeys(expand, record) {
  if (expand) {
    if (record.children && record.children.length) {
      expandKeys.push(record.spmLink);
    }
  } else {
    const index = expandKeys.indexOf(record.spmLink);

    if (~index) {
      expandKeys.splice(index, 1);
    }
  }
}

function expandTable(expand, record) {
  optionExpandKeys(expand, record);

  if (record.children) {
    record.children.forEach((child) => {
      expandTable(expand, child);
    });
  }
}

watch(
  () => showRelativeTask.value,
  () => undefined
);
</script>

<style scoped lang="less">
.c-label {
  width: 80px;
}

.row-white {
  background: #fff;
}
.row-gray {
  background: #f6f7fa;
}
.row-root {
  background: #dee2e6;
}
:deep(.ant-table-row.row-red) {
  background: #fbe9eb !important;
}
</style>

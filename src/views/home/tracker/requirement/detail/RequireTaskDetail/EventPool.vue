<template>
  <div class="g-mb-16">
    <RowSelectionTable
      :columns="columns"
      :data="props.dataSource || []"
      :pagination="false"
      rowKey="eventBuryPointId"
      :rowClassName="rowClassName"
      @changeRowKeys="$attrs.onChangeRowKeys"
    >
      <template #action="{ record }">
        <slot :record="record">
          <span
            class="text-link g-mr-8"
            :class="{ 'm-text--disabled': hasNoEditAuth }"
            @click="onView(record, true)"
            >编辑</span
          >
          <a-popconfirm
            :disabled="hasNoEditAuth"
            title="是否删除?"
            @confirm="remove(record)"
          >
            <span
              class="text-link g-mr-8"
              :class="{ 'm-text--disabled': hasNoEditAuth }"
              >删除</span
            >
          </a-popconfirm>
        </slot>
      </template>
    </RowSelectionTable>
    <a-modal
      :visible="visible"
      title="事件详情"
      width="60vw"
      @cancel="visible = false"
      v-if="visible"
    >
      <a-form :model="formState" v-if="isEdit">
        <EventTracker
          :eventBuryPointId="eventBuryPointId"
          isEdit
          :formState="formState"
          :disabled="isEdit"
        />
      </a-form>
      <EventDetail
        :isEdit="isEdit"
        :eventBuryPointId="eventBuryPointId"
        v-else
      />
      <template #footer>
        <a-button @click="visible = false">取消</a-button>
        <a-button @click="edit" type="primary" v-if="isEdit" class="g-ml-8"
          >确定</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref, watch } from "vue";
import { genBackground } from "@/utils/common";
import StatusTag from "../../components/StatusTag.vue";
import EventDetail from "@/views/home/tracker/event/EventDetail.vue";
import EventTracker from "./components/EventTracker.vue";
import { message } from "ant-design-vue";
import { removeEventTracker, editReqEvent } from "@/services/event.service";

import type { TableColumn } from "@/types/table.type";

const formState = reactive<any>({});
const props = defineProps<{
  dataSource: any[];
  reqPoolId?: string;
  fromDesign?: boolean;
  hasNoEditAuth?: boolean;
}>();
const visible = ref<boolean>(false);
const eventBuryPointId = ref<number>();
const columns = computed<TableColumn[]>(() => {
  const column = [
    {
      key: "eventName",
      title: "事件",
      dataIndex: "eventName",
      customRender: ({ record }) => {
        return (
          <div class="flex-ac" style="display: inline-flex">
            <span class="text-link" onClick={onView.bind(this, record, false)}>
              {record.eventCode}({record.eventName})
            </span>
          </div>
        );
      },
      customCell: (record) => {
        const background = record.isRoot
          ? "#dee2e6"
          : genBackground(record.gap);

        return {
          style: { background, "min-width": "200px" },
        };
      },
    },
    {
      key: "owner",
      dataIndex: "owner",
      title: "负责人",
    },
    {
      key: "verifier",
      dataIndex: "verifier",
      title: "验证人",
    },
    {
      key: "status",
      dataIndex: "status",
      title: "事件状态",
      customRender({ text: status }) {
        return status ? <StatusTag status={status}></StatusTag> : "";
      },
    },
    {
      key: "testRecordNum",
      dataIndex: "testRecordNum",
      title: "总记录数/失败数",
      customRender: ({ text: testRecordNum = 0, record }) => {
        const { failedTestRecordNum } = record;

        return (
          <span>
            <span>{testRecordNum || 0}</span> /{" "}
            <span style="color: red">{failedTestRecordNum || 0}</span>
          </span>
        );
      },
    },
    {
      key: "options",
      title: "操作",
      slots: { customRender: "action" },
    },
  ];
  if (props.fromDesign) {
    column.splice(
      1,
      4,
      ...[
        {
          key: "terminalName",
          dataIndex: "terminalName",
          title: "终端",
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
        {
          key: "status",
          dataIndex: "status",
          title: "任务状态",
        },
      ]
    );
  }

  return column;
});

const showRelativeTask = ref<boolean>(false);
const isEdit = ref<boolean>(false);

function onView(record, boolean) {
  isEdit.value = boolean;
  visible.value = true;
  eventBuryPointId.value = record.eventBuryPointId;
}

const emit = defineEmits<{
  (e: "getEventLists");
}>();

function remove(record) {
  removeEventTracker(record.eventBuryPointId).then(() => {
    message.success("删除成功~");
    emit("getEventLists");
  });
}

function edit() {
  editReqEvent({
    eventBuryPointId: eventBuryPointId.value,
    reqPoolId: props.reqPoolId,
    eventId: formState.eventId,
    eventParamPackageId: formState.version,
    terminalId: formState.terminalId,
    pubParamPackageId: formState.pubParamPackageId,
  }).then(() => {
    message.success("编辑成功~");
    emit("getEventLists");
    visible.value = false;
  });
}

function rowClassName(record) {
  return record.gap % 2 === 0
    ? "row-gray"
    : record.isRoot
    ? "row-root"
    : "row-white";
}

watch(
  () => showRelativeTask.value,
  (show) => {
    if (show) return undefined;
  }
);

watch(visible, (value) => {
  if (!value) {
    for (const key in formState) {
      formState[key] = undefined;
    }
  }
});
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
</style>

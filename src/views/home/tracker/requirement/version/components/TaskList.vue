<template>
  <a-table
    :columns="taskColumns"
    :data-source="list"
    size="small"
    :rowClassName="rowClassName"
    :scroll="{ x: 'max-content' }"
    :loading="loading"
    rowKey="taskId"
  >
    <template #action="{ record }">
      <a-popconfirm
        title="确定发布吗?"
        @confirm="publish(record)"
        v-if="record.deployed"
      >
        <u-text-button>发布上线</u-text-button>
      </a-popconfirm>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { shallowReactive, ref } from "vue";
import {
  getNoVersionList,
  publishTaskVersion,
} from "@/services/terminalVersion.service";
import { message } from "ant-design-vue";
import { ReqStatusEnum } from "@/types/requirement.type";
import { debouncedWatch } from "@vueuse/core";

const props = defineProps<{
  terminalId: number | string;
  search: string;
  terminalVersionName: string;
  taskColumns: any[];
  taskStatus: number;
  taskSourceStatus: number;
}>();
const loading = ref<boolean>(false);
const { taskColumns } = props;
const list = shallowReactive<Record<string, unknown>[]>([{ id: 1 }]);

debouncedWatch(
  () => [
    loading,
    props.terminalVersionName,
    props.search,
    props.taskStatus,
    props.taskSourceStatus,
  ],
  (value) => {
    if (!value) return;
    loading.value = true;
    getList();
  },
  {
    debounce: 500,
    immediate: true,
  }
);

function getList() {
  getNoVersionList({
    terminalId: props.terminalId,
    terminalVersionName: props.terminalVersionName,
    search: props.search,
    taskStatus: props.taskStatus,
    taskSourceStatus: props.taskSourceStatus,
  }).then((res) => {
    list.length = 0;
    list.push(
      ...res.map((v) => ({
        ...v,
        deployed: v.taskStatus === ReqStatusEnum.TEST_FINISHED,
      }))
    );

    loading.value = false;
  });
}

function publish(record) {
  const params = {
    taskId: record.taskId,
    terminalId: props.terminalId,
  };

  publishTaskVersion(params).then(() => {
    message.success("发布成功~");
    getList();

    loading.value = false;
  });
}

function rowClassName(record) {
  return record.mergeConflict ? "row-red" : "";
}
</script>

<style lang="less" scoped>
:deep(.ant-table-row.row-red) {
  background: #fbe9eb !important;
}
</style>

<template lang="pug">
.g-mb-8 以下为当前对象涉及需求的所有版本:
a-table(:columns="columns" :data-source="dataSource" size="small" rowKey="releaseId")
  template(#action="{ record }")
    span.text-link(@click="onView(record)") 查看详情
</template>

<script setup lang="ts">
import { getObjectHistoryList } from "@/services/object.service";
import { createInstance } from "@/ndsc-vue3/utils/lib";
import moment from "moment";

const { terminalId, objId, reqPoolId, releasedId } = defineProps<{
  terminalId: string;
  objId: number;
  reqPoolId: string | number;
  releasedId: string;
}>();
const columns = markRaw([
  {
    title: "终端",
    key: "terminalName",
    dataIndex: "terminalName",
  },
  {
    title: "端版本",
    key: "terminalVersionName",
    dataIndex: "terminalVersionName",
  },
  {
    title: "发布ID",
    key: "releaseId",
    dataIndex: "releaseId",
  },
  {
    title: "发布时间",
    key: "releaseTime",
    dataIndex: "releaseTime",
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "发布人",
    key: "releaser",
    dataIndex: "releaser",
  },
  {
    title: "操作",
    key: "action",
    slots: {
      customRender: "action",
    },
  },
]);

const dataSource = shallowReactive([]);
const instance = getCurrentInstance();

onMounted(() => {
  getObjectHistoryList({ terminalId, objId }).then((res) => {
    dataSource.length = 0;
    dataSource.push(...res);
  });
});

function onView(record) {
  import("./ObjectEditDrawer.vue").then(({ default: ObjectViewDrawer }) => {
    createInstance(ObjectViewDrawer, {
      parentContext: { _: instance },
      id: record.id,
      trackerId: record.trackerId,
      historyId: record.historyId,
      releasedId,
      reqPoolId,
      record,
      task: record,
      from: "objectManage",
      conditions: { terminalIds: terminalId, versionIds: releasedId },
      isPreview: true,
    });
  });
}
</script>

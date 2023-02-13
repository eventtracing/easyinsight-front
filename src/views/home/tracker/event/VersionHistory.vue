<template>
  <div>
    <p>仅为该事件新建或公参包变更涉及的版本</p>
    <a-table :columns="columns" :data-source="dataSource">
      <template #action="{ record }">
        <u-text-button @click="watchDetail(record)"> 查看详情 </u-text-button>
      </template>
    </a-table>
    <a-modal
      width="70vw"
      :visible="showDetail"
      title="事件详情"
      @cancel="showDetail = false"
    >
      <component
        :is="EventDetail"
        :eventBuryPointId="activeEventId"
      ></component>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref } from "vue";
import { getHistoryEventList } from "@/services/event.service";
import moment from "moment";
const EventDetail = defineAsyncComponent(() => import("./EventDetail.vue"));

const { eventBuryPointId } = defineProps<{ eventBuryPointId: number }>();
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
    key: "terminalReleaseId",
    dataIndex: "terminalReleaseId",
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
const showDetail = ref<boolean>(false);
const dataSource = shallowReactive([]);
const activeEventId = ref<number>();

function watchDetail(record) {
  showDetail.value = true;
  activeEventId.value = record.eventBuryPointId;
}

onMounted(() => {
  getHistoryEventList(eventBuryPointId).then((res) => {
    dataSource.length = 0;
    dataSource.push(...res);
  });
});
</script>

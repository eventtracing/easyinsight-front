<template>
  <div>
    <div class="flex">
      <a-button
        type="primary"
        class="g-mr-8"
        :disabled="hasNoEditAuth"
        @click="$emit('optionModal', true, 'event')"
        >新建事件埋点</a-button
      >
      <a-button class="g-mr-8" @click="showAssignTask" :disabled="hasNoEditAuth"
        >指派任务</a-button
      >
      <a-button
        class="g-mr-8"
        @click="cancelAssignEvent"
        :disabled="hasNoEditAuth"
        >取消指派</a-button
      >
    </div>
    <!-- 待开发事件埋点池 -->
    <div>
      <div class="flex-ac g-mt-16 g-mb-16">
        <span class="fs-16 black">待开发事件埋点池:</span>
        <a-alert
          class="g-ml-16"
          type="warning"
          message="事件埋点是指不挂对象，以事件本身作为埋点的一类埋点。"
        >
        </a-alert>
      </div>
      <event-pool
        @changeRowKeys="changeRowKeys"
        @getEventLists="getEventLists"
        :hasNoEditAuth="hasNoEditAuth"
        :dataSource="dataSource"
        from-design
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import EventPool from "./EventPool.vue";
import { getReqEventList } from "@/services/event.service";

const props = defineProps<{ reqPoolId: string; hasEditAuthManage: boolean }>();
const { reqPoolId } = props;

const hasNoEditAuth = computed(() => {
  return !props.hasEditAuthManage;
});
const dataSource = shallowReactive([]);

const emit = defineEmits<{
  (e: "selectEventsTable", list);
  (e: "cancelAssignEvent");
  (e: "optionModal", init: boolean, type: string);
}>();

// 选择对象
function changeRowKeys(objects) {
  const list = objects.map((ele) => {
    const target = dataSource.find((item) => item.eventBuryPointId === ele);

    return {
      ...target,
      id: target.eventBuryPointId,
      taskId: target.taskId,
      poolType: 3,
    };
  });

  emit("selectEventsTable", list);
}
function cancelAssignEvent() {
  emit("cancelAssignEvent");
}
function showAssignTask() {
  emit("optionModal", true, "task");
}

function getEventLists() {
  getReqEventList(reqPoolId).then((res) => {
    dataSource.length = 0;
    dataSource.push(...res);
  });
}

onMounted(getEventLists);

defineExpose({ getEventLists });
</script>

<template>
  <a-tabs :animated="false">
    <a-tab-pane tab="事件信息" key="event">
      <a-form :model="formState">
        <EventTracker
          :eventBuryPointId="props.eventBuryPointId"
          disabled
          :isEdit="props.isEdit"
          :formState="formState"
          :hasReturnVersion="hasReturnVersion"
        />
      </a-form>
    </a-tab-pane>
    <a-tab-pane tab="版本历史" key="history">
      <VersionHistory :eventBuryPointId="props.eventBuryPointId" />
    </a-tab-pane>
    <a-tab-pane tab="样例数据" key="template">
      <sample-data :id="props.eventBuryPointId" from="event" />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import EventTracker from "../requirement/detail/RequireTaskDetail/components/EventTracker.vue";
import VersionHistory from "./VersionHistory.vue";
import { getReqEventDetail } from "@/services/event.service";
import SampleData from "../object/list/SampleData.vue";

const props = defineProps<{ isEdit: boolean; eventBuryPointId: any }>();
const formState = reactive<{ version?: string; returnVersion?: string }>({});
const hasReturnVersion = ref(false);

onMounted(() => {
  getReqEventDetail(props.eventBuryPointId).then((res) => {
    Object.assign(formState, res);
    formState.returnVersion = res.eventParamPackageId;
  });
});
</script>

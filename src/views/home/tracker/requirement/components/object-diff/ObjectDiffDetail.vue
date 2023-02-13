<template>
  <div v-if="obj">
    <BaseInfo :obj="obj"></BaseInfo>
    <TrackerInfo
      :terminalName="obj.terminalName"
      :diffEvents="obj.diffEvents"
    ></TrackerInfo>
    <LineageInfo :diffParentObjs="obj.diffParentObjs"></LineageInfo>
    <ParamInfo :diffParams="obj.diffParams"></ParamInfo>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseInfo from "./BaseInfo.vue";
import TrackerInfo from "./TrackerInfo.vue";
import LineageInfo from "./LineageInfo.vue";
import ParamInfo from "./ParamInfo.vue";
import { DiffBaseConflictDetailVO } from "@/types/terminalVersion.type";

export default defineComponent({
  name: "ObjectDiffDetail",
  components: {
    BaseInfo,
    TrackerInfo,
    LineageInfo,
    ParamInfo,
  },
  props: {
    objId: {},
    historyId: {},
    trackerId: {},
    terminalId: {},
    baseTerminalVersionId: {},
    newestTerminalVersionId: {},
  },

  data() {
    const _obj: DiffBaseConflictDetailVO = null;

    return { obj: _obj };
  },
});
</script>

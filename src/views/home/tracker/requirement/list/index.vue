<template>
  <div class="fill">
    <Task
      :activeId="activeId"
      v-model:reqIssueKeys="reqIssueKeys"
      :canCreateOrChangeObj="canCreateOrChangeObj"
    ></Task>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Task from "./Task.vue";
export default defineComponent({
  name: "requirement-list",
  components: { Task },
  data() {
    const _activeId: number | "all" = "all";
    const _reqIssueKeys: string[] = [];
    const _canCreateOrChangeObj = false;
    return {
      activeId: _activeId,
      reqIssueKeys: _reqIssueKeys,
      canCreateOrChangeObj: _canCreateOrChangeObj,
    };
  },
  created() {
    this.activeId = +this.getQueryParams("requirementActive") || "all";
  },
  methods: {
    onActive(
      id: number | "all",
      reqIssueKeys: string[],
      canCreateOrChangeObj: boolean
    ) {
      this.activeId = id;
      this.reqIssueKeys = reqIssueKeys;
      this.canCreateOrChangeObj = canCreateOrChangeObj;
    },
  },
});
</script>

<style lang="less" scoped="true">
.left {
  width: 250px;
  border-right: 1px solid @border-color-split;
}
.right {
  overflow-y: auto;
}
</style>

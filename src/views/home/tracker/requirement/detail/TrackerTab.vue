<template>
  <div>
    <template v-if="tasks && tasks.length">
      <task-collapse
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :expand="expandTaskId === task.id"
      ></task-collapse>
    </template>
    <template v-else>
      <div style="text-align: center; margin-top: 120px">暂无埋点方案</div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TaskCollapse from "./TaskCollapse.vue";
import { TaskDto } from "@/types/requirement.type";

export default defineComponent({
  name: "TrackerTab",
  components: { TaskCollapse },
  props: { reqId: {} },

  data() {
    const _expandTaskId: number = null;
    const _tasks: TaskDto[] = [];

    return {
      expandTaskId: _expandTaskId,
      tasks: _tasks,
    };
  },

  async created() {
    const { taskId } = this.$route.query;

    this.expandTaskId = taskId;
  },
});
</script>

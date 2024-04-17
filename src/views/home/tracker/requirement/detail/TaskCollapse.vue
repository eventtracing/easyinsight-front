<template>
  <div class="task-collapse">
    <div class="task-collapse-header" @click.stop="active = !active">
      <DownOutlined :class="['expand-icon', active && 'active']" />
      <div class="g-ml-24">
        <span class="text-title">任务名称</span>
        <span class="g-ml-16">{{ task.name }}</span>
      </div>
      <div style="margin-left: 64px">
        <span class="text-title">端解决版本</span>
        <span class="g-ml-16">{{ task.version || "无" }}</span>
      </div>
      <div style="margin-left: 64px">
        <span class="text-title">负责人</span>
        <span class="g-ml-16">{{ task.owner.userName || "无" }}</span>
      </div>
      <div style="margin-left: 64px">
        <span class="text-title">验证人</span>
        <span class="g-ml-16">{{ task.verifier.userName || "无" }}</span>
      </div>
    </div>
    <div
      class="task-collapse-content"
      :style="active ? '' : { display: 'none' }"
    >
      <TaskObject
        v-if="active"
        :taskId="task.id"
        :requireId="task.requirementId"
      ></TaskObject>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TaskObject from "./TaskObject.vue";
export default defineComponent({
  name: "TaskCollapse",
  components: { TaskObject },
  props: {
    task: {},
    expand: { type: Boolean },
  },

  data() {
    const _active = false;

    return { active: _active };
  },

  methods: {
    setActive() {
      this.active = this.expand;
    },
  },
  watch: {
    expand: {
      handler: "setActive",
      immediate: true,
    },
  },
});
</script>

<style lang="less" scoped="true">
.task-collapse {
  & + .task-collapse {
    margin-top: 8px;
  }
}

.task-collapse-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  background: #f1f2f4;
  padding: 12px 24px;

  .expand-icon {
    font-size: 12px;
    transform: rotate(-90deg);
    transition: transform 0.3s;

    &.active {
      transform: rotate(0deg);
      transition: transform 0.3s;
    }
  }
}

.task-collapse-content {
  padding: 16px 0 16px 0;
}
</style>

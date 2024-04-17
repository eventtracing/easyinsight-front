<template>
  <div>
    <a-form-item
      :label-col="{ span: 3 }"
      :label="reassign.terminalName"
      :name="`task${reassign.terminalId}`"
      class="flex-ac g-mb-16"
      v-for="reassign in reassingLists"
      :key="reassign.terminalId"
    >
      <a-select
        v-model:value="formState[`terminal${reassign.terminalId}`]"
        :options="reassign.targetTasks"
        show-search
        option-filter-prop="label"
        class="g-ml-8"
        style="flex: 1"
        placeholder="请选择任务"
      ></a-select>
    </a-form-item>
  </div>
</template>

<script lang="ts" setup>
import { shallowReactive, watch } from "vue";
import { getTerminalTask } from "@/services/requirement.design.service";
const props = withDefaults(
  defineProps<{
    showRelativeTask: boolean;
    activeKey: string;
    syncAllTerminal: boolean;
    reqPoolId: string;
    formState: Record<string, unknown>;
    reassingLists?: any[];
    selectEvents: { id: number; poolType: 1 | 2 | 3 }[]; // 选择事件
    selectOutLineObjects: { id: number; poolType: 1 | 2 | 3 }[]; // 选择待下线对象
    selectObjects: any[]; // 选择待开发对象
  }>(),
  {
    formState: () => ({}),
    selectOutLineObjects: () => [],
    selectObjects: () => [],
    selectEvents: () => [],
    showRelativeTask: false,
  }
);

const { formState, reqPoolId } = props;
const reassingLists = shallowReactive([]);

const execute = (value) => {
  if (!value) return;

  const assignEntities =
    props.activeKey === "0"
      ? props.selectObjects.concat(props.selectOutLineObjects)
      : props.selectEvents;

  getTerminalTask({
    assignEntities: assignEntities,
    reqPoolId,
    syncAllTerminal: props.activeKey === "0" ? props.syncAllTerminal : false,
  }).then((res) => {
    reassingLists.length = 0;
    reassingLists.push(
      ...res.map((v) => {
        return {
          ...v,
          targetTasks: v.targetTasks?.map((task) => ({
            value: task.id,
            label: task.taskName,
          })),
        };
      })
    );
  });
};

watch(() => props.showRelativeTask, execute, { immediate: true });
</script>

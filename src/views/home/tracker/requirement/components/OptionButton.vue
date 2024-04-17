<template>
  <div class="flex-ac">
    <a-dropdown :disabled="disabled">
      <a-button class="g-ml-8">流转/回退</a-button>
      <template #overlay
        ><div class="flex c-circulation">
          <a-button :disabled="disabled" @click="onBatchGoBack"
            >批量回退状态</a-button
          >
        </div></template
      >
    </a-dropdown>
    <a-button class="g-ml-8" :disabled="disabled" @click="showVersion = true"
      >设置端版本</a-button
    >
    <a-button class="g-ml-8" :disabled="disabled" @click="showSprint = true"
      >设置迭代</a-button
    >
    <SettingVersion
      @refresh="emit('refresh')"
      :selectTask="selectedRowKeys"
      v-model:show="showVersion"
    ></SettingVersion>
    <SettingSprint
      @refresh="emit('refresh')"
      :selectTask="selectedRowKeys"
      v-model:visible="showSprint"
    />
  </div>
</template>

<script setup lang="ts">
import { createInstance } from "@/ndsc-vue3/utils/lib";
import { getCurrentInstance, computed, ref, toRefs } from "vue";
import RejectTaskModal from "../list/RejectTaskModal.vue";
import SettingVersion from "../list/SettingVersion.vue";
import SettingSprint from "../list/SettingSprint.vue";

const showVersion = ref<boolean>(false);
const showSprint = ref<boolean>(false);
const instance = getCurrentInstance();
const emit = defineEmits<{ (e: "refresh") }>();

const props = withDefaults(
  defineProps<{
    selectTask?: any[];
    selectObject?: any[];
    disabled?: boolean;
  }>(),
  {
    disabled: false,
    selectTask: () => [],
    selectObject: () => [],
  }
);
const { disabled, selectTask, selectObject } = toRefs(props);
const selectedRowKeys = computed(() => selectTask.value.map((v) => v.id));
const selectedObjectRowKeys = computed(() =>
  selectObject.value.map((v) => v.id)
);

function getOnlySelectKeys(selectedRowKeys) {
  const obj = {};

  return selectedRowKeys.reduce((prev, next) => {
    // @ts-ignore
    const prevkey = typeof next === "object" ? next.id : next;

    if (!obj[prevkey]) {
      prev.push(+prevkey);
      obj[prevkey] = true;
    }
    return prev;
  }, []);
}

function getFlatTaskObject() {
  return selectTask.value.concat(selectObject.value);
}

// 获取选中的任务和对象最小的状态值
function getLowestStatus() {
  const flatTaskObject = getFlatTaskObject();

  return flatTaskObject
    .slice(0)
    .sort((a, b) => (a.status > b.status ? 1 : -1))[0]?.status;
}

// 批量自定义打回
function onBatchGoBack() {
  const status = getLowestStatus();

  createInstance(RejectTaskModal, {
    parentContext: { _: instance },
    status,
    selectedRowKeys: getOnlySelectKeys(selectTask.value),
    selectedObjectRowKeys: getOnlySelectKeys(selectObject.value),
    onHandlerOk: () => {
      emit("refresh");
    },
  });
}
</script>

<style scoped>
.c-circulation {
  padding: 8px;
  background: #fff;
  box-shadow: 0 0 10px #ccc;
  flex-direction: column;
  border-radius: 4px;
}
</style>

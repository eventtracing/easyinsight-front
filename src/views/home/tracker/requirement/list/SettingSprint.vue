<template lang="pug">
a-modal(:visible="props.visible" title="设置迭代" @ok="setSprintConfirm" @cancel="$emit('update:visible', false)")
  a-form(:colon="false" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }" ref="formRef")
    a-form-item(label="迭代" required)
      a-input(placeholder="请输入迭代" v-model:value="sprint")
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import { setSprint } from "@/services/requirement.service";
const props = defineProps<{ visible: boolean; selectTask: number }>();
const emit = defineEmits<{
  (e: "update:visible", visible: boolean);
  (e: "refresh");
}>();
const sprint = ref<string>("");

function setSprintConfirm() {
  setSprint(props.selectTask, sprint.value).then(() => {
    message.success("设置成功~");

    emit("update:visible", false);
    emit("refresh");
  });
}
</script>

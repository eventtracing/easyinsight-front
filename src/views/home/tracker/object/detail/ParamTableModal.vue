<template>
  <a-modal
    :width="850"
    title="参数记录"
    :visible="true"
    :footer="null"
    @cancel="handleCancel"
  >
    <ParamTableList :fromObject="fromObject" :list="list"></ParamTableList>
  </a-modal>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import ParamTableList from "./ParamTableList.vue";

export default defineComponent({
  name: "SImagePreview",
  components: { ParamTableList },
  props: {
    fromObject: { default: false },
    list: {},
  },
  methods: {
    handleCancel() {
      this.$emit("handlerClose");
    },
  },
});
</script>

<template>
  <div class="g-object__container">
    <div class="flex c-label__container">
      <div v-for="item in labels" :key="item.key">
        {{ item.key }}:
        <span class="c-label__value">{{ item.value }}</span>
      </div>
    </div>
    <ObjectParamsTable label="对象标准私参"></ObjectParamsTable>
    <ObjectParamsTable label="对象业务私参"></ObjectParamsTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import ObjectParamsTable from "./ObjectParamsTable.vue";
export default defineComponent({
  name: "ObjectDetail",
  components: {
    ObjectParamsTable,
  },
  setup() {
    const _labels: { key: string; value: string | number }[] = reactive([
      { key: "事件类型", value: "" },
      { key: "全局公参", value: "" },
      { key: "事件公参", value: "" },
    ]);

    return {
      labels: _labels,
    };
  },
});
</script>

<style scoped="true" lang="less">
.c-label__container {
  justify-content: space-between;
}
.c-label__value {
  color: #103ffa;
  margin-left: 10px;
}
</style>

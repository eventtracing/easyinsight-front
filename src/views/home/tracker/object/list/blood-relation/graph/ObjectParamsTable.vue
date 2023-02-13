<template>
  <div class="g-object__container">
    <h3>{{ label }}</h3>
    <a-table :columns="columns" :dataSource="data"> </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { TableColumn } from "@/types/table.type";
export default defineComponent({
  name: "ObjectParamsTable",
  setup() {
    const _columns: TableColumn[] = reactive([
      { key: "index", dataIndex: "index", title: "序号" },
      { key: "params", dataIndex: "params", title: "参数名" },
      { key: "cname", dataIndex: "cname", title: "中文名称" },
      { key: "type", dataIndex: "type", title: "取值类型" },
      { key: "value", dataIndex: "value", title: "取值" },
      { key: "isEmpty", dataIndex: "isEmpty", title: "非空" },
    ]);

    return {
      columns: _columns,
    };
  },

  props: {
    label: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style scoped="true" lang="less">
.g-object__container {
  margin-top: 20px;
}
</style>

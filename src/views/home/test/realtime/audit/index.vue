<template>
  <div class="g-p-lr-24 g-mt-16" id="react-data-audit-wrapper"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const mountId = "micro-app-react-data-audit";

export default defineComponent({
  name: "RealTimeRecord",
  mounted() {
    let node = document.getElementById(mountId);

    if (!node) {
      node = document.createElement("div");
      node.setAttribute("id", mountId);
    }

    node.style.display = "block";
    document.getElementById("react-data-audit-wrapper").appendChild(node);
  },
  beforeUnmount() {
    const node = document.getElementById(mountId);

    node.style.display = "none";
    document.body.appendChild(document.getElementById(mountId));
  },
});
</script>

<style scoped="true" lang="less">
.g-mt-16 {
  :deep(.ant-tabs) {
    overflow: unset;
  }
}
</style>

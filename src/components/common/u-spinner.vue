<template>
  <div class="flex-c m-spinner">
    <a-spin></a-spin>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'USpinner'
})
</script>

<style lang="less" scoped="true">
.m-spinner {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  height: 300px;
  background: rgba(255, 255, 255, 0.5);
}
</style>

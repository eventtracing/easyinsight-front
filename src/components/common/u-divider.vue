<template>
  <div :class="`u-divider-${type}`"></div>
</template>

<script lang="tsx">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'u-divider',
  props: {
    type: {
      default: 'vertical'
    }
  }
})
</script>

<style lang="less" scoped="true">
.u-divider-vertical {
  width: 1px;
  height: 24px;
  background: #e2e7f0;
  margin: 0 8px;
}
</style>

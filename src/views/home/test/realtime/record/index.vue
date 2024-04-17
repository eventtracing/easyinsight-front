<template>
  <div class="g-p-lr-24 g-mt-16">
    <Content />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import Content from './components/content.vue'
export default defineComponent({
  name: 'RealTimeRecord',
  components: {
    Content
  }
})
</script>

<style scoped="true" lang="less">
.g-mt-16 {
  :deep(.ant-tabs) {
    overflow: unset;
  }
}
</style>

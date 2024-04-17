<template>
  <div class="s-page-top flex-ac" :style="styles">
    <div class="flex-1"><slot></slot></div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 's-page-top',
  props: {
    border: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    styles() {
      return this.border
        ? {
            borderBottom: '1px solid #e2e2e2'
          }
        : {}
    }
  }
})
</script>

<style lang="less" scoped="true">
.s-page-top {
  padding: 10px 0;
}
</style>

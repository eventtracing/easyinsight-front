<template>
  <div class="flex" :style="styles">
    <div style="flex: 1; flex-wrap: wrap" class="flex-ac">
      <slot></slot>
    </div>
    <div class="flex-ac">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'u-left-right',
  props: {
    align: {
      default: 'center',
      validator: (value: string) => {
        return ['center', 'start', 'end'].includes(value)
      }
    }
  },
  computed: {
    styles() {
      return this.align === 'center' ? 'align-items: center' : `align-items: flex-${this.align}`
    }
  }
})
</script>

<template>
  <div class="u-status-icon">
    <div class="u-status-icon-dot" :style="`--color: ${innerColor}`" :class="{ wave: wave }"></div>
    <slot>{{ text }}</slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
const STATUS_COLOR_MAP = {
  success: '#26BD71',
  danger: '#F24957',
  warning: '#FFAF0F',
  info: '#1890FF'
}
export default defineComponent({
  name: 'u-status-icon',
  props: {
    status: {
      default: 'success',
      type: String,
      validator: (value: string) => {
        return ['success', 'warning', 'danger', 'info'].indexOf(value) !== -1
      }
    },
    wave: {
      default: false,
      type: Boolean
    },
    color: {},
    text: {}
  },
  computed: {
    innerColor() {
      return this.color ? this.color : STATUS_COLOR_MAP[this.status]
    }
  }
})
</script>

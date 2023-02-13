<template>
  <div class="u-info">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'u-info',
  props: {
    labelWidth: {
      type: Number
    },
    labelAlign: {
      type: String,
      validator: (value: string) => {
        return ['left', 'right'].indexOf(value) !== -1
      }
    },
    itemsAlign: {
      type: String,
      validator: (value: string) => {
        return ['flex-start', 'center', 'flex-end'].indexOf(value) !== -1
      }
    },
    size: {
      type: String,
      validator: (value: string) => {
        return ['small', 'default', 'large'].indexOf(value) !== -1
      }
    }
  }
})
</script>

<template>
  <div
    class="u-text-button"
    :disabled="disabled"
    :class="{ disabled: disabled }"
    @click.stop="click"
  >
    <slot>{{ text }}</slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'u-text-button',
  props: {
    text: {},
    disabled: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    click(e: MouseEvent) {
      if (!this.disabled) {
        this.$emit('click', e)
        if (this.$attrs['on-click']) {
          this.$attrs['on-click'](e)
        }
      }
    }
  }
})
</script>

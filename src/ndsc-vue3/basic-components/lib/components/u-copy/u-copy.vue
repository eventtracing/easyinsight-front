<template>
  <span @click="onCopy">
    <slot>
      <u-text-button :disabled="disabled">复制</u-text-button>
    </slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { message } from 'ant-design-vue'
import UTextButton from '../u-text-button'
import { copy } from '../../utils/clipboard'
export default defineComponent({
  name: 'u-copy',
  components: {
    'u-text-button': UTextButton
  },
  props: {
    value: {},
    successText: {
      default: '复制成功！'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCopy() {
      if (!this.disabled && this.value) {
        const success = copy(this.value)

        if (success) {
          message.success(this.successText)
        }
      }
    }
  }
})
</script>

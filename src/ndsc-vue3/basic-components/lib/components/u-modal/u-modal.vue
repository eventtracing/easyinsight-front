<template>
  <a-modal
    :bodyStyle="bodyStyle"
    :width="width"
    :destroyOnClose="true"
    :maskClosable="maskClosable"
    :wrapClassName="wrapClassNames"
    v-bind="$attrs"
  >
    <slot></slot>
    <div class="ant-modal-footer__left">
      <slot name="footer-left"></slot>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Modal } from 'ant-design-vue'
export default defineComponent({
  name: 'u-modal',
  components: {
    'a-modal': Modal
  },
  props: {
    width: {
      default: 560
    },
    bodyStyle: {
      default: () => ({
        'min-height': '198px',
        'max-height': '500px',
        'overflow-y': 'auto'
      })
    },
    maskClosable: {
      default: false,
      type: Boolean
    },
    wrapClassName: {
      default: ''
    }
  },
  computed: {
    wrapClassNames() {
      return this.wrapClassName ? `u-modal-wrapper ${this.wrapClassName}` : 'u-modal-wrapper'
    }
  }
})
</script>

<template>
  <a-drawer
    :width="width"
    :height="height"
    :closable="footer && placement === 'bottom' ? false : closable"
    :destroyOnClose="true"
    :maskClosable="maskClosable"
    :wrapClassName="wrapClassNames"
    :placement="placement"
    v-bind="$attrs"
    @close="close"
    @ok="ok"
  >
    <template #title>
      <slot name="title">
        <template v-if="placement === 'bottom'">
          <div style="display: flex; align-items: center">
            <TextTooltip :alignWithMouse="false" :text="title" style="flex: 1; min-width: 0" />
            <div v-if="footer" style="margin-left: 24px">
              <slot name="footer">
                <a-button type="primary" @click="ok">{{ okText }}</a-button>
                <a-button @click="close" style="margin-left: 8px">{{ cancelText }}</a-button>
              </slot>
            </div>
          </div>
        </template>
        <TextTooltip v-else :alignWithMouse="false" :text="title" />
      </slot>
    </template>
    <div class="ant-drawer-main">
      <slot></slot>
    </div>
    <div v-if="footer && placement !== 'bottom'" class="ant-drawer-footer">
      <slot name="footer">
        <a-button type="primary" @click="ok">{{ okText }}</a-button>
        <a-button @click="close" style="margin-left: 8px">{{ cancelText }}</a-button>
      </slot>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TextTooltip from '../u-text-tooltip'
export default defineComponent({
  name: 'u-drawer',
  components: {
    TextTooltip
  },
  props: {
    title: {},
    width: {
      default: 700
    },
    height: {
      default: 364
    },
    maskClosable: {
      default: false,
      type: Boolean
    },
    footer: {
      default: false,
      type: Boolean
    },
    okText: {
      default: '确定'
    },
    cancelText: {
      default: '取消'
    },
    wrapClassName: {
      default: ''
    },
    placement: {
      default: 'right'
    },
    closable: {
      default: true
    }
  },
  computed: {
    wrapClassNames() {
      return this.wrapClassName ? `u-drawer-wrapper ${this.wrapClassName}` : 'u-drawer-wrapper'
    }
  },
  methods: {
    close() {
      this.$emit('handlerClose')
    },
    ok() {
      return Promise.resolve().then(() => {
        this.$emit('handleOk')
      })
    }
  }
})
</script>

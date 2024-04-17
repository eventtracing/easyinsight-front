<template>
  <div class="m-drawer__footer">
    <u-left-right>
      <slot>
        <a-button style="margin-right: 8px" @click="handleClose"> 取消 </a-button>
        <a-button type="primary" @click="sure" :loading="loading"> 确定 </a-button>
        <slot name="center"></slot>
      </slot>
      <template #right><slot name="right"></slot></template>
    </u-left-right>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DrawerFooter',
  props: {
    loading: {
      default: false,
      required: false
    }
  },
  methods: {
    sure() {
      this.$emit('ok')
    },

    handleClose() {
      this.$emit('close')
    }
  }
})
</script>

<style scoped="true">
.m-drawer__footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  left: 0;
  background: #fff;
  border-radius: 0 0 4px 4px;
  z-index: 100;
}
</style>

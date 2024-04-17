<template>
  <i class="anticon sidebar-icon" @click="handleClick">
    <svg class="u-icon" aria-hidden="true">
      <use :xlink:href="href"></use>
    </svg>
  </i>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import './iconfont'
export default defineComponent({
  name: 'IconFont',
  props: {
    type: {},
    prefix: {
      default: 'icon-'
    }
  },
  computed: {
    href() {
      return `#${this.prefix}${this.type}`
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
})
</script>

<style lang="less" scoped="true">
.sidebar-icon {
  .u-icon {
    width: 1em;
    height: 1em;
  }
}
</style>

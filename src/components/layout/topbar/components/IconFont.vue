<template>
  <i class="anticon">
    <svg class="m-topbar-icon-font" aria-hidden="true">
      <use :xlink:href="href"></use>
    </svg>
  </i>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import loadJs from '../utils/loadJs'
import './iconFont.js'
export default defineComponent({
  name: 'icon-font',
  props: {
    type: {}
  },
  computed: {
    href() {
      return `#${this.type}`
    }
  }
})
</script>

<style lang="less" scoped="true">
.m-topbar-icon-font {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

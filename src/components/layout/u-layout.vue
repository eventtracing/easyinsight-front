<template>
  <div class="layout">
    <TopBar></TopBar>
    <div class="main" v-if="isRouterAlive">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TopBar from './u-topbar.vue'
export default defineComponent({
  name: 'u-layout',
  components: {
    TopBar
  },

  data() {
    const _isRouterAlive = false
    return {
      isRouterAlive: _isRouterAlive
    }
  },

  async created() {
    this.isRouterAlive = true
  }
})
</script>

<style lang="less" scoped="true">
.layout {
  height: 100%;
  min-width: 1200px;
  position: relative;

  .topbar {
    height: 48px;
    position: relative;
  }

  .main {
    height: calc(100% - 48px);
    position: relative;
    background: #fff;
  }
}
</style>

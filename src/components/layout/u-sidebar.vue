<template>
  <div class="sidebar">
    <SideBar :navConfig="navConfig" @onMenuItemClick="onSwitchNav"></SideBar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideBar, { NavListDto } from '@/ndsc-vue3/sidebar/lib'
export default defineComponent({
  name: 'u-sidebar',
  components: {
    SideBar
  },
  props: {
    navConfig: {}
  },
  methods: {
    onSwitchNav(item: NavListDto) {
      if (item.to === this.$router.currentRoute.path) {
        return
      }

      this.$router
        .replace({
          path: item.to
        })
        .catch(() => {})
    }
  }
})
</script>

<style lang="less" scoped="true">
.sidebar {
  // height: 100%;
}
</style>

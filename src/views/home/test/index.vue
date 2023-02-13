<template>
  <div class="fill flex">
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { navConfig } from './nav'
export default defineComponent({
  name: 'TrackerConfig',
  computed: {
    navConfig() {
      return { ...navConfig, menu: navConfig.menu.filter((v) => !v.hide) }
    }
  },
  methods: {
    handleRouteRedirect(to: string) {
      if (to === '/test/realtime') {
        const m = this.navConfig.menu[0]
        let redirectPath = ''

        if (m.children && m.children.length) {
          redirectPath = m.children[0].to
        } else {
          redirectPath = m.to
        }

        if (redirectPath) {
          this.$router
            .replace({
              path: redirectPath,
              query: this.$route.query
            })
            .catch(() => {})
        } else {
          this.$router
            .replace({
              path: '/404'
            })
            .catch(() => {})
        }
      }
    }
  },
  watch: {
    '$route.path': {
      handler: 'handleRouteRedirect',
      immediate: true
    }
  }
})
</script>

<style lang="less" scoped="true">
.content {
  flex: 1;
  min-width: 0;
  height: 100%;
  position: relative;
  overflow-x: auto; // fix: firefox 内容区过宽不滚动，撑开页面
}
</style>

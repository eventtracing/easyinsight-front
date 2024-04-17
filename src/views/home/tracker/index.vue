<template>
  <div class="fill">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { navConfig } from "./nav";

export default defineComponent({
  name: "TrackerConfig",
  computed: {
    navConfig() {
      const requireMenu = this.menuLists.find((v) => v.code === 1);

      return {
        ...navConfig,
        menu: (requireMenu.modules || []).map((v) => {
          const nav = this.navMap.get(v.code);

          return { id: v.code, name: v.name, ...nav };
        }),
      };
    },
  },
  mounted() {},
  methods: {
    handleRouteRedirect(to: string) {
      if (to === "/tracker") {
        const m = this.navConfig.menu[0];
        const redirectPath = m.children.length ? m.children[0].to : m.to;

        if (!redirectPath) {
          this.$router.replace({ path: "/404" });
          return;
        }

        this.$router.replace({
          path: redirectPath,
          query: this.$route.query,
        });
      }
    },
  },
  watch: {
    "$route.path": {
      handler: "handleRouteRedirect",
      immediate: true,
    },
  },
});
</script>

<style lang="less" scoped="true">
.content {
  flex: 1;
  min-width: 0;
  height: 100%;
  position: relative;
  overflow-x: auto;
}
</style>

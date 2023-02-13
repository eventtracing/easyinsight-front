<template>
  <u-layout>
    <div class="flex fill">
      <u-sidebar :navConfig="navConfig" v-if="navConfig.project"></u-sidebar>
      <div class="position-relative flex-1 fill">
        <router-view :key="$route.fullPath"></router-view>
        <transition name="opacity">
          <div class="m-spinner flex-ac flex-c" v-if="pageLoading">
            <a-spin></a-spin>
          </div>
        </transition>
      </div>
    </div>
  </u-layout>
</template>

<script lang="tsx">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  computed: {
    navMap() {
      return this.$store.state.navMap;
    },
    menuLists() {
      return this.$store.state.menuLists;
    },
    pageLoading() {
      return this.$store.state.pageLoading;
    },
  },
  data() {
    return {
      navConfig: {},
    };
  },
  methods: {
    getDedupChildren(menu, children, n) {
      const flag = menu.children?.some((v) => v.menuType === 1);

      if (flag) return;

      const result = menu.children
        ?.filter((module) => children.includes(module.code))
        ?.map((subMenu) => {
          const currentMenu = this.navMap.get(subMenu.code) || {};
          const { children: subChildren = [] } = currentMenu;

          return {
            name: subMenu.menuName,
            id: subMenu.code,
            ...currentMenu,
            children:
              subMenu.menuType === 0
                ? this.getDedupChildren(subMenu, subChildren)
                : null,
          };
        });

      n === 2 &&
        result.push({
          children: null,
          iconType: "custom",
          id: 88,
          icon: () => (
            <i style="font-size: 20px" class="g-mt-8">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-tracker-manage"></use>
              </svg>
            </i>
          ),
          name: "测试记录",
          to: "/test/record",
        });

      return result;
    },
    changeAuthorityManage(n) {
      const currentMenu = this.menuLists.find((menu) => menu.code === n);
      if (!currentMenu) {
        this.navConfig = {};
        return;
      }

      const { children = [], ...project } =
        this.navMap.get(currentMenu.code) || {};

      this.navConfig = {
        project: {
          name: currentMenu.menuName,
          ...project,
        },
        menu: this.getDedupChildren(currentMenu, children, n),
      };
    },
  },
  watch: {
    "$route.meta.type": {
      handler: "changeAuthorityManage",
      immediate: true,
    },
  },
});
</script>

<style lang="less" scoped="true">
.position-relative {
  position: relative;
  width: 100%;
  overflow-y: auto;
  .m-spinner {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    z-index: 100;
  }
}
</style>

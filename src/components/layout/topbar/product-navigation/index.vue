<template>
  <div class="m-navigation-trigger">
    <div
      class="m-toggle-sidebar"
      :class="{ active: visible, disabled: !canEdit }"
      @click.stop="handleClickToggle"
    ></div>
    <div v-show="visible" @click="handleClickHide" class="m-navigation-wrap">
      <div class="content" ref="content">
        <Panel
          :isEdit="isEdit"
          :navigationGroups="navigationGroups"
          :starAppList="starAppList"
          :fixedAppList="fixedAppList"
          :outerLinks="outerLinks"
          :maxQuickNavNum="maxQuickNavNum"
          @ok="handleOk"
          @cancel="handleCancel"
          @close="handleClose"
        ></Panel>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Panel from './Panel.vue'
import { NavigationItem, NavigationGroup, OuterLinkItem } from '../type'
import { groupBy } from '../utils/util'
export default defineComponent({
  name: 'ProductNavigation',
  components: {
    Panel
  },
  props: {
    canEdit: {},
    isEdit: {},
    navigations: {
      required: true,
      default: (): NavigationItem[] => []
    },
    starAppList: {
      required: true,
      default: (): string[] => []
    },
    fixedAppList: {
      required: true,
      default: (): string[] => []
    },
    outerLinks: {
      type: Array,
      default: (): OuterLinkItem[] => []
    },
    maxQuickNavNum: {
      type: Number
    },
    visible: {
      type: Boolean
    }
  },
  computed: {
    contentRef() {
      const contentRef: typeof HTMLDivElement = this.$refs.content
      return contentRef
    }
  },

  data() {
    const _navigationGroups: NavigationGroup[] = []
    return {
      navigationGroups: _navigationGroups
    }
  },

  methods: {
    /**
     * 根据接口数据生成组件数据
     */
    initNavigation() {
      if (this.navigations.length) {
        const navGroupByCategory = groupBy(this.navigations, (nav) => nav.category)
        this.navigationGroups = Object.keys(navGroupByCategory)
          .map((category) => {
            return {
              category,
              order: navGroupByCategory[category][0] && navGroupByCategory[category][0].order,
              navItems: navGroupByCategory[category]
            }
          })
          .sort((a, b) => {
            return a.order - b.order
          })
      }
    },

    /**
     * 点击toggle, 打开/关闭产品导航
     */
    handleClickToggle() {
      if (!this.canEdit) {
        return
      }

      if (this.visible && this.isEdit) {
        this.$emit('cancel')
      } else {
        this.$emit('update:visible', !this.visible)
      }
    },

    /**
     * 点击蒙层关闭
     */
    handleClickHide(e: MouseEvent) {
      if (!this.visible || this.isEdit || this.contentRef.contains(e.target as HTMLElement)) {
        return
      }

      this.$emit('update:visible', false)
    },

    handleClose() {
      this.$emit('update:visible', false)
    },

    /**
     * 编辑快捷导航
     */
    handleOk() {
      this.$emit('ok')
    },

    /**
     * 编辑快捷导航
     */
    handleCancel() {
      this.$emit('cancel')
    },

    watchNavigations() {
      this.initNavigation()
    }
  },
  watch: {
    navigations: {
      handler: 'watchNavigations',
      immediate: true
    }
  }
})
</script>

<style lang="less" scoped="true">
@import '../styles/var.less';

.m-navigation-trigger {
  position: relative;
  .m-toggle-sidebar {
    height: @header-height;
    line-height: @header-height;
    width: 56px;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(../assets/toggle-bar.svg),
      linear-gradient(90deg, #1783d0 0%, #0f41f9 100%);
    color: #fff;
    &:not(.disabled) {
      cursor: pointer;
    }
    &:not(.disabled):hover {
      background-image: url(../assets/toggle-bar.svg),
        linear-gradient(0deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16)),
        linear-gradient(90deg, #1783d0 0%, #0f41f9 100%);
    }
    &.active {
      transform: rotate(180deg);
    }
  }
}

.m-navigation-wrap {
  position: fixed;
  top: @header-height;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(27, 27, 33, 0.16);
  z-index: 999;
  .content {
    width: 220px;
    height: 100%;
    background-color: #fff;
  }
}
</style>

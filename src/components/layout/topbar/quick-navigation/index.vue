<template>
  <div style="width: 100%; display: flex">
    <ul class="fixed-nav-wrapper">
      <li v-for="item in fixedNavs" :key="item.key" class="nav-item">
        <u-link
          :url="item.url"
          :clickAction="item.clickAction"
          :active="activeUrl === item.url"
          :name="item.name"
        >
        </u-link>
      </li>
    </ul>
    <div
      style="flex: 1; min-width: 0; position: relative; display: flex; align-items: center"
      ref="nav-wrapper"
    >
      <ul v-if="!isEdit" class="nav-wrapper">
        <li v-for="item in displayNavs" :key="item.key" class="nav-item">
          <u-link
            :url="item.url"
            :clickAction="item.clickAction"
            :active="activeUrl === item.url"
            :name="item.name"
          >
          </u-link>
        </li>
        <a-dropdown
          v-if="foldNavs.length"
          :trigger="['click']"
          :align="foldNavsAlign"
          overlayClassName="m-topbar-dropdown"
        >
          <li class="nav-edit-btn" style="margin-right: 4px">
            <span style="font-size: 0">
              <i class="icon-circle"></i>
              <i class="icon-circle"></i>
              <i class="icon-circle"></i>
            </span>
          </li>
          <template #overlay
            ><ul class="fold-nav-list">
              <li v-for="item in foldNavs" :key="item.key" class="fold-nav-item">
                <u-link :url="item.url" :clickAction="item.clickAction" :name="item.name"> </u-link>
              </li></ul
          ></template>
        </a-dropdown>
        <li v-if="!isEdit" class="nav-edit-btn" @click.stop="handleEdit">
          <a-tooltip placement="bottom" overlayClassName="topbar-tooltip" :align="align">
            <template #title>
              <span>自定义导航</span>
            </template>
            <span style="display: inline-block"><i class="icon-edit"></i></span>
          </a-tooltip>
        </li>
      </ul>
      <SortableContainer
        v-else
        class="nav-edit-wrapper"
        :style="`width: 100%; --ratio: ${100 / navigations.length + '%'}`"
        axis="x"
        helperClass="active"
        appendTo="ul.nav-edit-wrapper"
        :distance="4"
        :value="navigations"
        @sort-move="handleSortMove"
        @sort-end="handleSortEnd"
      >
        <SortableItem
          v-for="(item, index) in navigations"
          :index="index"
          :key="item.key"
          :style="sortItemStyle"
        >
          <a-tooltip placement="bottom" overlayClassName="topbar-tooltip" :align="editAlign">
            <template #title>
              <span>
                点击移除
                <br />
                拖动排序
              </span>
            </template>
            <span @click="handleRemove(item.key)" class="nav-edit-item">
              {{ item.name }}
            </span>
          </a-tooltip>
        </SortableItem>
      </SortableContainer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Tooltip, Dropdown } from 'ant-design-vue'
import Link from '../components/Link.vue'
import SortableContainer from './SortableContainer.vue'
import SortableItem from './SortableItem.vue'
import { NavigationItem } from '../type'
import { throttle } from '../utils/util'
import elementResizeDetectorMaker from 'element-resize-detector'
const erdUltraFast = elementResizeDetectorMaker()

function estimateItemWidth(item: NavigationItem) {
  const len = item.name.length
  let width = 36

  for (let i = 0; i < len; i++) {
    if (/^[a-zA-Z]$/.test(item.name[i])) {
      width += 10
    } else {
      width += 14
    }
  }

  return width
}

export default defineComponent({
  name: 'QuickNavigation',
  // @ts-ignore
  components: {
    'a-tooltip': Tooltip,
    'a-dropdown': Dropdown,
    'u-link': Link,
    SortableContainer,
    SortableItem
  },
  props: {
    activeUrl: {},
    isEdit: {},
    navigations: {},
    fixedNavs: {
      required: true,
      default: (): NavigationItem[] => []
    }
  },
  computed: {
    align() {
      return {
        offset: [0, -2]
      }
    },

    foldNavsAlign() {
      return {
        offset: [0, 0]
      }
    },

    editAlign() {
      return {
        offset: [0, 8]
      }
    },

    displayNavs() {
      return this.navigations.slice(0, this.count)
    },

    foldNavs() {
      return this.navigations.slice(this.count)
    },

    sortItemStyle() {
      return this.isMoving ? 'pointer-events: none;' : ''
    },

    navWrapperDom() {
      const navWrapperDom: typeof HTMLElement = this.$refs['nav-wrapper']
      return navWrapperDom
    }
  },

  data() {
    const _count = 0

    const _resizeFunc = () => {}

    const _isMoving = false
    return {
      count: _count,
      resizeFunc: _resizeFunc,
      isMoving: _isMoving
    }
  },

  mounted() {
    this.calCount()
    this.resizeFunc = throttle(this.calCount, 300)
    erdUltraFast.listenTo(this.navWrapperDom, () => {
      this.resizeFunc()
    })
  },

  beforeUnmount() {
    erdUltraFast.uninstall(this.navWrapperDom)
  },

  methods: {
    isActive(url: string) {
      if (!url) {
        return false
      }

      if (url.startsWith('http')) {
        const origin = url.split('?')[0]
        return origin && location.href.startsWith(origin)
      } else {
        const path = url.split('?')[0]
        return path && location.pathname.startsWith(path)
      }
    },

    handleEdit() {
      this.$emit('edit')
    },

    handleRemove(key: string) {
      this.$emit('remove', key)
    },

    handleSortMove() {
      this.isMoving = true
    },

    handleSortEnd({ newIndex, oldIndex }: { newIndex: number; oldIndex: number }) {
      this.isMoving = false
      this.$emit('sort', oldIndex, newIndex)
    },

    calCount() {
      const containerWidth = this.navWrapperDom?.offsetWidth || 0
      let count = 0
      let w = 36 // 添加按钮的宽度

      // 添加按钮的宽度
      const len = this.navigations.length

      for (let i = 0; i < len; i++) {
        w += estimateItemWidth(this.navigations[i])

        if (w + 50 < containerWidth) {
          count++
        } else {
          break
        }
      }

      this.count = count
    },

    watchNavigationChange() {
      this.calCount()
    }
  },
  watch: {
    navigations: {
      handler: 'watchNavigationChange'
    }
  }
})
</script>

<style lang="less" scoped="true">
@import '../styles/var';
.nav-wrapper {
  width: 100%;
  display: flex;
  align-items: center;

  .nav-item {
    margin-right: 16px;
    line-height: @header-height;
    flex-shrink: 0;
  }
}

.fixed-nav-wrapper {
  display: flex;
  align-items: center;

  .nav-item {
    margin-right: 16px;
    line-height: @header-height;
    flex-shrink: 0;
  }
}

.nav-edit-wrapper {
  text-align: left;
  line-height: 1;
  font-size: 0;
  li {
    display: inline-block;
    max-width: var(--ratio);
    padding-right: 16px;
    box-sizing: border-box;
  }
}

.nav-edit-item {
  font-size: 14px;
  user-select: none;
  display: block;
  height: 24px;
  line-height: 22px; // fix 编辑模式文字下沉造成的抖动
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: @topbar-text-color;
  border: 1px dashed @topbar-text-color;
  padding: 0 9px;
  box-sizing: border-box;
  cursor: move;
  &:hover {
    color: @topbar-text-hover-color;
    border-color: @topbar-text-hover-color;
  }
}

// 拖动排序的元素
li.active .nav-edit-item {
  color: @topbar-text-hover-color;
  border-color: @topbar-text-hover-color;
  pointer-events: initial !important;
  cursor: grabbing;
}

.nav-edit-btn {
  display: block;
  color: @topbar-text-color;
  padding: 0 10px;
  height: @header-height;
  line-height: @header-height;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    color: #fff;
  }
}

.icon-circle {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  transform: translateY(-2px);
  + .icon-circle {
    margin-left: 4px;
  }
}

.icon-edit {
  display: inline-block;
  vertical-align: middle;
  position: relative;
  border: 1px dashed currentColor;
  width: 16px;
  height: 16px;
  &::before {
    width: 1px;
    height: 8px;
  }
  &::after {
    width: 8px;
    height: 1px;
  }
  &::before,
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    content: '';
    background: currentColor;
    transform: translate(-50%, -50%);
  }
}

.fold-nav-list {
  background: @topbar-background-color-secondary;
  color: #fff;
  padding: 6px 0;
  min-width: 130px;
  .fold-nav-item a {
    font-size: 12px;
    padding: 6px 16px;
  }
}
</style>

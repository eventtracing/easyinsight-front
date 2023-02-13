<template>
  <div class="m-topbar" @click="handleClickHide">
    <div class="m-topbar__left">
      <ProductNavigation
        v-model:visible="navigationVisible"
        :isEdit="isEdit"
        :canEdit="canEdit"
        :navigations="navigations"
        :starAppList="innerStarAppList"
        :fixedAppList="existFixedAppList"
        :outerLinks="outerLinks"
        :maxQuickNavNum="maxQuickNavNum"
        @ok="handleOk"
        @cancel="handleCancel"
      ></ProductNavigation>

      <!-- logo -->
      <div class="m-topbar__left-logo">
        <slot name="logo"> </slot>
      </div>

      <!-- 总览 + 快捷导航区 -->
      <div class="m-topbar__left-nav-list">
        <u-link
          v-if="dashboardUrl"
          :url="dashboardUrl"
          :disabled="isEdit"
          :active="activeUrl === dashboardUrl"
        >
          <template #name
            ><span>
              <slot name="dashboardName">总览</slot>
            </span></template
          >
        </u-link>
        <div class="divider"></div>
        <div class="quick-nav">
          <QuickNavigation
            :isEdit="isEdit"
            :fixedNavs="fixedNavs"
            :navigations="starNavs"
            :activeUrl="activeUrl"
            @edit="handleToggleEidt"
            @remove="handleRemove"
            @sort="handleSort"
          ></QuickNavigation>
        </div>
      </div>
    </div>

    <div class="m-topbar__right">
      <div v-if="isEdit" class="m-overlay"></div>
      <!-- 左侧自定义操作区 -->
      <slot name="leftExtra"></slot>
      <div class="product-area">
        <product-select
          v-if="productList && productList.length"
          :productList="productList"
          :product="product"
          @switchProduct="handleChangeProduct"
        ></product-select>
      </div>
      <u-link
        v-if="platformAdminUrl"
        :url="platformAdminUrl"
        :active="activeUrl === platformAdminUrl"
      >
        <template #name><span> 平台管理 </span></template>
      </u-link>
      <!-- 右侧自定义操作区 -->
      <slot name="rightExtra"></slot>
      <div class="user-area">
        <user-dropdwon
          :userName="userName"
          :UserActionList="UserActionList"
          @logout="handleLogout"
        ></user-dropdwon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Link from './components/Link.vue'
import ProductNavigation from './product-navigation/index.vue'
import QuickNavigation from './quick-navigation/index.vue'
import ProductSelect from './product-select/index.vue'
import UserDropdwon from './user-operation/index.vue'
import { isUrlActive } from './utils/util'
import { ProductItem, NavigationItem, OuterLinkItem, SwitchInfo, UserActionItem } from './type'
import loadJs from './utils/loadJs'
export default defineComponent({
  name: 'TopBar',
  components: {
    ProductNavigation,
    QuickNavigation,
    ProductSelect,
    UserDropdwon,
    'u-link': Link
  },
  props: {
    navigations: {
      required: true,
      default: (): NavigationItem[] => []
    },
    starAppList: {
      required: true,
      default: (): string[] => []
    },
    fixedAppList: {
      default: (): string[] => []
    },
    userName: {
      type: String,
      required: true
    },
    maxQuickNavNum: {
      type: Number,
      default: 10
    },
    dashboardUrl: {
      default: null
    },
    platformAdminUrl: {
      default: null
    },
    iconfontResourceUrl: {
      default: null
    },
    product: {},
    productList: {
      type: Array,
      default: (): Array<ProductItem>[] => []
    },
    outerLinks: {
      type: Array,
      default: (): OuterLinkItem[] => []
    },
    UserActionList: {
      type: Array,
      default: (): UserActionItem[] => []
    }
  },
  computed: {
    canEdit() {
      return this.navigations && this.navigations.length > 1
    },

    starNavs(): NavigationItem[] {
      return this.innerStarAppList
        .map((k) => this.navigations.find((n) => n.key === k))
        .filter((n) => !!n)
    },

    fixedNavs(): NavigationItem[] {
      return this.fixedAppList
        .map((k) => this.navigations.find((n) => n.key === k))
        .filter((n) => !!n)
    },

    existFixedAppList(): string[] {
      return this.fixedAppList.filter((k) => this.navigations.find((n) => n.key === k)) || []
    },

    align() {
      return {
        offset: [0, 0]
      }
    }
  },

  data() {
    const _navigationVisible = false
    const _isEdit = false
    const _innerStarAppList: string[] = []
    const _cacheStarList: string[] = []
    const _activeUrl = '' // 只有子产品个数大于 1 个时，才能展开、编辑

    // 只有子产品个数大于 1 个时，才能展开、编辑
    return {
      navigationVisible: _navigationVisible,
      isEdit: _isEdit,
      innerStarAppList: _innerStarAppList,
      cacheStarList: _cacheStarList,
      activeUrl: _activeUrl
    }
  },

  methods: {
    getActiveUrl() {
      this.activeUrl =
        this.navigations
          .map((item) => item.url)
          .concat([this.dashboardUrl])
          .find((u) => isUrlActive(u)) || ''
    },

    handleClickHide() {
      if (!this.isEdit) {
        this.navigationVisible = false
      }
    },

    /**
     * 编辑快捷导航
     */
    handleToggleEidt() {
      this.cacheStarList = this.innerStarAppList.slice(0)
      this.isEdit = true
      this.navigationVisible = true
    },

    /**
     * 点击移除快捷导航
     */
    handleRemove(key: string) {
      const idx = this.innerStarAppList.findIndex((k) => k === key)
      idx !== -1 && this.innerStarAppList.splice(idx, 1)
    },

    /**
     * 拖动排序快捷导航
     */
    handleSort(oldIndex: number, newIndex: number) {
      const dragKey = this.innerStarAppList[oldIndex]
      this.innerStarAppList.splice(oldIndex, 1)
      this.innerStarAppList.splice(newIndex, 0, dragKey)
    },

    /**
     * 确定编辑快捷导航
     */
    handleOk() {
      this.$emit('edit', this.innerStarAppList)
    },

    /**
     * 取消编辑快捷导航
     */
    handleCancel() {
      this.navigationVisible = false
      this.isEdit = false
      this.innerStarAppList = this.cacheStarList
    },

    exitEditMode() {
      this.navigationVisible = false
      this.isEdit = false
    },

    handleChangeProduct(data: SwitchInfo) {
      this.$emit('switchProduct', data)
    },

    handleLogout() {
      this.$emit('logout')
    },

    initIconfontResource() {
      if (this.iconfontResourceUrl) {
        loadJs(this.iconfontResourceUrl)
      }
    },

    initInnerStarAppList() {
      this.innerStarAppList = this.starAppList.filter(
        (item) => !(this.fixedAppList || []).includes(item)
      )
    },

    onUrlChange() {
      this.getActiveUrl()
    }
  },
  watch: {
    iconfontResourceUrl: {
      handler: 'initIconfontResource',
      immediate: true
    },
    starAppList: {
      handler: 'initInnerStarAppList',
      immediate: true
    },
    fixedAppList: {
      handler: 'initInnerStarAppList',
      immediate: true
    },
    '$route.path': {
      handler: 'onUrlChange',
      immediate: true,
      deep: true
    }
  }
})
</script>

<style lang="less">
// 全局样式
@import './styles/global.less';
</style>
<style lang="less" scoped="true">
@import './styles/var.less';

.m-topbar {
  height: @header-height;
  line-height: @header-height;
  background: #1c1e25;
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
}

.m-topbar__left {
  height: 100%;
  flex: 1;
  padding-right: 60px;
  display: flex;
  align-items: center;
  &-logo {
    display: flex;
    align-items: center;
    min-width: 60px;
    margin: 0 22px 0 16px;
    img {
      max-height: 40px;
    }
  }
  &-nav-list {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    .divider {
      width: 1px;
      height: 16px;
      margin: 0 16px 0 8px;
      background: rgba(255, 255, 255, 0.24);
    }
    .quick-nav {
      flex: 1;
    }
  }
}

.m-topbar__right {
  position: relative;
  height: 100%;
  display: flex;
  font-size: 14px;
  align-items: center;
  color: @topbar-text-color;

  .m-overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  div[class*='-area'] {
    padding: 0 10px;
    line-height: @header-height;
    height: @header-height;
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }

  .user-area {
    margin-right: 16px;
  }
}

.project-config-list {
  background: @topbar-background-color-secondary !important;
  padding: 6px 0 !important;
  min-width: 122px;
  .list-item > a {
    font-size: 12px;
    padding: 6px 16px;
  }
}
</style>

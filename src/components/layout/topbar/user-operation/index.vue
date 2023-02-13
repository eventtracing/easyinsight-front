<template>
  <a-dropdown
    v-model="visible"
    :trigger="['click']"
    placement="bottomLeft"
    :align="align"
    overlayClassName="m-topbar-dropdown"
  >
    <span class="m-username-trigger">
      {{ userName }}
      <div style="font-size: 10px; margin-left: 2px">
        <CaretUpOutlined v-if="visible" />
        <CaretDownOutlined v-else />
      </div>
    </span>
    <template #overlay
      ><ul class="m-user-operation-list" @click="handleItemClick">
        <li v-for="o in UserActionList" :key="o.name" class="list-item">
          <u-link v-if="o.type === 'link'" :url="o.url" :clickAction="o.clickAction" :name="o.name">
          </u-link>
          <span v-else @click="o.onClick">{{ o.name }}</span>
        </li>
        <li @click="handleLogOut" class="list-item">
          <span>安全退出</span>
        </li>
      </ul></template
    >
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Dropdown } from 'ant-design-vue'
import Link from '../components/Link.vue'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'UserDropdown',
  components: {
    'a-dropdown': Dropdown,
    'u-link': Link,
    CaretUpOutlined,
    CaretDownOutlined
  },
  props: {
    userName: String,
    UserActionList: Array
  },
  computed: {
    align() {
      return {
        offset: [-26, 0]
      }
    }
  },

  data() {
    const _visible = false
    return {
      visible: _visible
    }
  },

  methods: {
    handleItemClick(e: any) {
      if (e.target?.nodeName !== 'UL') {
        this.visible = false
      }
    },

    handleLogOut() {
      this.$emit('logout')
    }
  }
})
</script>

<style lang="less" scoped="true">
@import '../styles/var.less';

.m-username-trigger {
  display: inline-block;
  line-height: @header-height;
  height: @header-height;
}

.m-user-operation-list {
  background: @topbar-background-color-secondary;
  padding: 6px 0;
  width: 122px;
  margin-left: 4px;
  .list-item > a,
  .list-item > span {
    font-size: 12px;
    padding: 6px 16px;
  }
  .list-item > span {
    display: block;
    cursor: pointer;
    color: @topbar-text-color !important;
    &:hover {
      color: @topbar-text-hover-color !important;
    }
  }
}
</style>

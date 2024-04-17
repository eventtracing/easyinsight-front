<template>
  <!-- 展示态 -->
  <div v-if="!isEdit" class="group">
    <div class="title">{{ navigationGroup.category }}</div>
    <ul class="content">
      <li v-for="item in navigationGroup.navItems" :key="item.key">
        <router-link v-if="!item.clickAction" :to="item.url" class="item"
          ><VNode :vnodes="renderIcon(item.iconName)"></VNode>
          <span class="item-name">{{ item.name }}</span></router-link
        >
        <a
          v-else
          :href="item.url"
          rel="noopener"
          class="item"
          :target="item.clickAction ? '_blank' : '_self'"
          @click="handleClose"
        >
          <VNode :vnodes="renderIcon(item.iconName)"></VNode>
          <span class="item-name">{{ item.name }}</span>
          <icon-font type="link" class="m-icon-logo"></icon-font>
        </a>
      </li>
    </ul>
  </div>
  <!-- 编辑态 -->
  <div v-else class="group edit">
    <div class="title">{{ navigationGroup.category }}</div>
    <ul class="content">
      <li
        v-for="item in navigationGroup.navItems.filter(
          (item) => checkedAppList.includes(item.key) || checkedAppList.length < maxQuickNavNum
        )"
        :key="item.key"
      >
        <span class="item">
          <a-checkbox
            class="item-checkbox"
            :checked="checkedAppList.includes(item.key)"
            :disabled="fixedAppList.includes(item.key)"
            @change="handleAppCheck($event, item.key)"
          ></a-checkbox>
          <VNode :vnodes="renderIcon(item.iconName)"></VNode>
          <span class="item-name">{{ item.name }}</span>
          <icon-font v-if="item.clickAction" type="link" class="m-icon-logo"></icon-font>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from 'vue'
import IconFont from '../components/IconFont.vue'
export default defineComponent({
  name: 'Group',
  components: {
    IconFont,
    VNode: {
      functional: true,
      props: {
        vnodes: {}
      },
      render: (ctx: any) => ctx.vnodes
    }
  },
  props: {
    isEdit: {},
    navigationGroup: {
      required: true
    },
    starAppList: {
      required: true,
      default: (): string[] => []
    },
    fixedAppList: {
      required: true,
      default: (): string[] => []
    },
    maxQuickNavNum: {
      type: Number
    }
  },
  computed: {
    align() {
      return {
        offset: [0, -6]
      }
    },

    checkedAppList() {
      return [].concat(this.starAppList, this.fixedAppList)
    }
  },
  methods: {
    renderIcon(icon: string | any) {
      if (typeof icon === 'function') {
        return <span class="icon-wrapper m-icon-logo">{icon(this.$createElement)}</span>
      }

      return <icon-font type={icon} class="m-icon-logo"></icon-font>
    },

    handleClose() {
      this.$emit('close')
    },

    handleAppCheck(e: any, key: string) {
      const checked = e.target.checked

      if (checked) {
        // eslint-disable-next-line
        this.starAppList.push(key);
      } else {
        const idx = this.starAppList.findIndex((k) => k === key)
        // eslint-disable-next-line
        idx !== -1 && this.starAppList.splice(idx, 1);
      }
    }
  }
})
</script>

<style lang="less" scoped="true">
@import '../styles/var';

.item .m-icon-logo {
  font-size: 16px;
  margin-right: 12px;
  color: @topbar-icon-color;
}
.item:not(.disable):hover .m-icon-logo {
  color: @primary-color;
}

.group {
  text-align: left;
  .title {
    display: flex;
    align-items: flex-end;
    height: 40px;
    padding-left: 35px;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    color: #102048;
  }
  .content {
    font-size: 14px;
    line-height: 40px;
    .item {
      color: @topbar-text-color-base;
      min-height: 40px;
      padding-left: 35px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:not(.disable):hover {
        color: @primary-color;
      }

      .item-checkbox {
        margin-right: 16px;
        :deep(.ant-checkbox-inner) {
          width: 14px;
          height: 14px;
          &::after {
            top: 42%;
          }
        }
      }

      .item-name {
        flex: 1;
        line-height: 20px;
        padding-right: 8px;
      }
    }
  }
}

.item .m-icon-logo.icon-wrapper {
  display: flex;
  align-items: center;
}

.group.edit {
  .title,
  .content .item {
    padding-left: 18px;
  }
}
</style>

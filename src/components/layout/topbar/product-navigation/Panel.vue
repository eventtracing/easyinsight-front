<template>
  <div class="m-wrapper">
    <div class="masonry">
      <Group
        v-for="g in navigationGroups"
        :isEdit="isEdit"
        :navigationGroup="g"
        :maxQuickNavNum="maxQuickNavNum"
        :key="g.category"
        :starAppList="starAppList"
        :fixedAppList="fixedAppList"
        @close="handleClose"
      ></Group>
    </div>
    <!-- 更多产品 -->
    <div v-if="!isEdit && outerLinks && outerLinks.length" class="link-group">
      <div class="title">更多产品</div>
      <div class="content">
        <span v-for="item in outerLinks" :key="item.key">
          <a :href="item.url" rel="noopener" class="item" target="_blank" @click="handleClose">
            <span style="font-size: 12px">{{ item.name }}</span>
            <icon-font
              v-if="item.prefixIcon && item.prefixIcon.includes('new')"
              type="new"
              style="margin-left: 4px; font-size: 26px"
            ></icon-font>
          </a>
        </span>
      </div>
    </div>
    <!-- 编辑态底部操作按钮 -->
    <div v-if="isEdit" class="footer">
      <div class="btn btn-cancel" @click="handleCancel">取消</div>
      <div class="btn btn-ok" @click="handleOk">确定</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Group from './Group.vue'
import IconFont from '../components/IconFont.vue'
import { NavigationGroup, OuterLinkItem } from '../type'
export default defineComponent({
  name: 'Panel',
  components: {
    Group,
    IconFont
  },
  props: {
    isEdit: {},
    navigationGroups: {
      required: true,
      default: (): NavigationGroup[] => []
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
    }
  },
  computed: {
    groups() {
      const left: NavigationGroup[] = []
      const right: NavigationGroup[] = []
      this.navigationGroups.forEach((g, i) => {
        i % 2 === 0 ? left.push(g) : right.push(g)
      })
      return {
        left,
        right
      }
    }
  },
  methods: {
    handleOk() {
      this.$emit('ok')
    },

    handleClose() {
      this.$emit('close')
    },

    handleCancel() {
      this.$emit('cancel')
    }
  }
})
</script>

<style lang="less" scoped="true">
@import '../styles/var';

.btn {
  font-size: 14px;
  line-height: 20px;
  padding: 3px 17px;
  border: 1px solid @primary-color;
  border-radius: 2px;
  user-select: none;
  cursor: pointer;
}

.m-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  .masonry {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .link-group {
    display: flex;
    padding-bottom: 40px;
    line-height: 40px;
    .title {
      padding-left: 35px;
      font-weight: bold;
      font-size: 12px;
      color: #102048;
    }
    .content {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .item {
        margin-left: 24px;
        display: flex;
        align-items: center;
        color: @topbar-text-color-base;
        &:hover {
          color: @primary-color;
        }
      }
    }
  }
  .footer {
    padding: 16px 24px 24px;
    border-top: 1px solid #e8e8f8;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    background-color: #fff;
    .btn-cancel {
      color: @primary-color;
      border: 1px solid @primary-color;
      &:hover {
        color: fade(@primary-color, 80%);
        border-color: fade(@primary-color, 80%);
      }
    }
    .btn-ok {
      color: #fff;
      background-color: @primary-color;
      margin-right: 12px;
      &:hover {
        background-color: fade(@primary-color, 80%);
        border-color: fade(@primary-color, 80%);
      }
    }
  }
}
</style>

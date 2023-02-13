<template>
  <div class="u-collapse">
    <div class="u-collapse-header" @click.stop="active = !active">
      <DownOutlined :class="['expand-icon', active && 'active']" />
      <span class="g-ml-8">{{ header }}</span>
    </div>
    <div class="u-collapse-content" :style="active ? '' : { display: 'none' }">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  name: 'u-collapse',
  components: {
    DownOutlined
  },
  data() {
    const _active = true
    return {
      active: _active
    }
  },

  props: {
    header: {}
  }
})
</script>

<style lang="less" scoped="true">
.u-collapse {
  & + .u-collapse {
    margin-top: 8px;
  }
}

.u-collapse-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #1c1e25;
  cursor: pointer;

  .expand-icon {
    font-size: 12px;
    transform: rotate(-90deg);
    transition: transform 0.3s;

    &.active {
      transform: rotate(0deg);
      transition: transform 0.3s;
    }
  }
}

.u-collapse-content {
  padding: 16px 0 16px 20px;
}
</style>

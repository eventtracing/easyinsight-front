<template>
  <div class="u-404">
    <slot name="image">
      <img class="u-404-image" :src="image" :alt="description" />
    </slot>
    <div class="u-404-description">{{ description }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'UPage404',
  props: {
    image: {
      type: String,
      default: require('../assets/404.svg')
    },
    description: {
      type: String,
      default: '抱歉，您访问的页面不存在'
    }
  }
})
</script>

<style lang="less" scoped="true">
.u-404 {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .u-404-description {
    margin-top: 24px;
    font-size: 16px;
    color: #333333;
    line-height: 24px;
  }
}
</style>

<template>
  <div class="u-nobiz">
    <slot name="image">
      <img class="u-nobiz-image" :src="image" :alt="title" />
    </slot>
    <div class="u-nobiz-info">
      <div class="title">{{ title }}</div>
      <slot name="content">
        <div class="content">{{ content }}</div>
      </slot>
      <div v-if="hasButton" class="button" @click="handleClick">
        {{ buttonText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'UPageNoBiz',
  props: {
    image: {
      type: String,
      default: require('../assets/nobiz.svg')
    },
    title: {
      type: String,
      default: '抱歉，您还未参与任何项目'
    },
    content: {
      type: String,
      default: '请联系项目管理者确定需要加入的项目'
    },
    buttonText: {
      type: String,
      default: '申请加入项目'
    },
    hasButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
})
</script>

<style lang="less" scoped="true">
.u-nobiz {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .u-nobiz-info {
    margin-top: 24px;
    text-align: center;
    .title {
      font-size: 16px;
      color: #333333;
      line-height: 24px;
    }
    .content {
      margin-top: 16px;
      font-size: 14px;
      color: #999999;
      line-height: 20px;
    }
    .button {
      display: inline-block;
      padding: 6px 16px;
      margin-top: 24px;
      background: #103ffa;
      border-radius: 3px;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>

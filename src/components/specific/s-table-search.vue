<template>
  <div class="flex-c">
    <a-input-search
      :value="search"
      :placeholder="placeholder"
      :style="`width: ${width}px`"
      @change="onChange"
      @search="onSearch"
      allowClear=""
    ></a-input-search>
    <s-sync-button class="g-ml-12" @click="onSync"></s-sync-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 's-table-search',
  model: {
    prop: 'search',
    event: 'change'
  },
  props: {
    placeholder: {},
    width: {
      type: Number,
      default: 280
    },
    search: {}
  },
  methods: {
    onChange(e) {
      this.$emit('update:search', e.target.value)
    },

    onSearch() {
      // 解决清空输入框后触发的 change 事件时 search 不为空的 bug
      this.$nextTick(() => {
        this.$emit('search')
      })
    },

    onSync() {
      this.$emit('sync')
    }
  }
})
</script>

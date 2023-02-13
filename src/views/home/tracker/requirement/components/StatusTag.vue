<template>
  <u-tag :color="statusColor" style="transform: scale(0.9)">{{ statusText }}</u-tag>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { reqStatusNameMap, reqStatusColorMap } from '@/types/requirement.type'
export default defineComponent({
  name: 'StatusTag',
  props: {
    status: {}
  },
  computed: {
    statusText() {
      return reqStatusNameMap[this.status] || '-'
    },

    statusColor() {
      return reqStatusColorMap[this.status] || '#6AB2F5'
    }
  }
})
</script>

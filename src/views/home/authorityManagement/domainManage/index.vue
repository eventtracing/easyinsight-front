<template>
  <div class="fill">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DomainManage'
})
</script>

<style scoped="true" lang="less">
.fill {
  flex: 1;
  padding: 12px 20px;
}
</style>

<template>
  <div class="fill g-platform">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PlatformManage'
})
</script>

<style scoped="true" lang="less">
.fill {
  flex: 1;
}
.g-platform {
  padding: 12px 20px;
}
</style>

<template>
  <div class="fill">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ProductionManage'
})
</script>

<style scoped="true" lang="less">
.fill {
  flex: 1;
}
</style>

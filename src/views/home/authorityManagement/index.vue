<template>
  <div class="fill flex">
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AuthorityManagement'
})
</script>

<style scoped="true" lang="less">
.content {
  flex: 1;
}
</style>

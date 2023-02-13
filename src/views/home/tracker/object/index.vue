<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="['object-manage']">
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ObjectConfig'
})
</script>

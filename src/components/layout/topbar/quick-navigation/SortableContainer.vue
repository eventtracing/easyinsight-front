<template>
  <ul>
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ContainerMixin } from 'vue-slicksort'

export default defineComponent({
  name: 'SortableContaier',
  mixins: [ContainerMixin]
})
</script>

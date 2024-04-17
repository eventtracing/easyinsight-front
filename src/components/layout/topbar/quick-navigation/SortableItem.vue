<template>
  <li>
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElementMixin } from 'vue-slicksort'

export default defineComponent({
  name: 'SortableItem',
  mixins: [ElementMixin]
})
</script>

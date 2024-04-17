<template>
  <!-- <i class="anticon" @click="handleClick"> -->
  <i class="anticon">
    <svg class="u-icon" aria-hidden="true">
      <use :xlink:href="href"></use>
    </svg>
  </i>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import './iconfont'
export default defineComponent({
  name: 'u-icon-font',
  props: {
    type: {},
    prefix: {
      default: 'icon-'
    }
  },
  computed: {
    href() {
      return `#${this.prefix}${this.type}`
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
})
</script>

<template>
  <router-link
    v-if="!clickAction"
    :to="url"
    class="spa-link"
    :class="{
      active: active,
      disabled: disabled
    }"
    @click="handleClick"
    ><slot name="name">{{ name }}</slot></router-link
  >
  <a v-else :href="url" rel="noopener" class="a-link" target="_blank" @click="handleClick">
    <slot name="name">{{ name }}</slot>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ULink',
  props: {
    url: {},
    name: {},
    clickAction: {
      default: 0
    },
    active: {
      default: false
    },
    disabled: {
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
})
</script>

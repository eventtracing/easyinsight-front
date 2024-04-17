<template>
  <span class="u-tag" :style="styles"><slot></slot></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Color from 'color'
export default defineComponent({
  name: 'u-tag',
  props: {
    color: {}
  },
  computed: {
    styles() {
      return {
        border: `1px solid ${this.color}`,
        color: `${this.color}`,
        background: Color(this.color).alpha(0.1)
      }
    }
  }
})
</script>

<style lang="less" scoped="true">
.u-tag {
  font-size: 14px;
  display: inline-block;
  padding: 0 7px;
  font-size: 12px;
  border-radius: 2px;
  line-height: 20px;
  transform: scale(0.9);
}
</style>

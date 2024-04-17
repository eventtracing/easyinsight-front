<template>
  <UPageNoBiz @click="handleClick"></UPageNoBiz>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { UPageNoBiz } from "@/ndsc-vue3/exception-page/lib";

export default defineComponent({
  name: "PageNoBiz",
  components: {
    UPageNoBiz,
  },
  computed: {
    bizConfig() {
      return this.$store.state.bizConfig;
    },
  },
  methods: {
    handleClick() {
      window.open(this.bizConfig.bdmsPermissionUrl);
    },
  },
});
</script>

<template>
  <UIconButton
    icon="sync"
    title="刷新"
    class="s-sync-button"
    @click="handleClick"
  >
    <template #icon>
      <SyncOutlined />
    </template>
  </UIconButton>
</template>

<script lang="ts">
import { SyncOutlined } from "@ant-design/icons-vue";
import { defineComponent } from "vue";
import UIconButton from "../u-icon-button";

export default defineComponent({
  name: "s-sync-button",
  components: {
    UIconButton,
    SyncOutlined,
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
});
</script>

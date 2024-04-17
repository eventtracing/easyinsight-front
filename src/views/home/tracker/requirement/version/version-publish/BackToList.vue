<template>
  <u-left-right class="top">
    <div>
      <div class="flex-ac">
        <u-icon-button
          icon="left"
          class="g-mr-8"
          style="margin-top: 1px"
          @click="back"
        />
        <a-breadcrumb>
          <a-breadcrumb-item>
            <a href="javascript: void(0)" @click="back">版本列表</a>
          </a-breadcrumb-item>
          <a-breadcrumb-item> 发布上线 </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="g-mt-4" style="margin-left: 22px">
        <span>端解决版本：{{ terminalVersion }}</span>
      </div>
    </div>
  </u-left-right>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BackToList",
  props: {
    terminalVersion: {},
  },
  methods: {
    back() {
      this.$router.replace({
        path: "/tracker/requirement/version",
      });
    },
  },
});
</script>

<style lang="less" scoped="true">
.top {
  border-bottom: 1px solid @border-color-split;
  padding: 12px 0 8px 0;
}
</style>

<template>
  <u-left-right class="top">
    <div>
      <div class="flex-ac">
        <u-icon-button
          icon="left"
          class="g-mr-8"
          style="margin-top: 1px"
          @click="back"
        >
          <template #icon>
            <LeftOutlined style="cursor: pointer" />
          </template>
        </u-icon-button>
        <a-breadcrumb>
          <a-breadcrumb-item>
            <a href="javascript: void(0)" @click="back">需求管理</a>
          </a-breadcrumb-item>
          <a-breadcrumb-item> 需求详情 </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="g-mt-4" style="margin-left: 22px">
        需求ID：{{ reqIssueKey }}
      </div>
    </div>
  </u-left-right>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LeftOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "BackToList",
  props: {
    reqIssueKey: {},
    issueUrl: {},
  },
  components: { LeftOutlined },
  methods: {
    back() {
      this.$router
        .replace({
          path: "/tracker/requirement/list",
        })
        .catch(() => {});
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

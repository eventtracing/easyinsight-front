<template>
  <a-config-provider
    :locale="zhCN"
    :autoInsertSpaceInButton="false"
    :renderEmpty="renderEmpty"
  >
    <div class="app">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";

export default defineComponent({
  name: "App",
  components: {
    "a-config-provider": ConfigProvider,
  },
  setup() {
    return { zhCN };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    // antd 组件空态统一处理
    renderEmpty(h, componentName: string) {
      const style =
        componentName === "Select"
          ? "text-align: center;margin: 16px 0 40px 0;"
          : "text-align: center;margin: 8px 0;";
      const text = componentName === "Select" ? "无数据" : "暂无数据";

      return (
        <div style={style}>
          <span>{text}</span>
        </div>
      );
    },
  },
});
</script>

<style lang="less" scoped="true">
.app {
  height: 100%;
}
</style>

<template>
  <div class="u-403">
    <slot name="image">
      <img class="u-403-image" :src="image" :alt="title" />
    </slot>
    <div class="u-403-info">
      <div class="title">{{ title }}</div>
      <p style="font-size: 16px; margin-top: 20px">
        申请权限请联系相关同学：
        <span>{{ managerList.join(", ") }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAppManagers } from "@/services/common.service";

export default defineComponent({
  name: "UPage403",
  data() {
    return {
      managerList: [],
    };
  },
  props: {
    image: {
      type: String,
      default: require("../assets/403.svg"),
    },
    title: {
      type: String,
      default: "抱歉，您无权限访问当前页面",
    },
    content: {
      type: String,
      default: "请申请加入相应项目获取访问权限",
    },
    buttonText: {
      type: String,
      default: "申请加入项目",
    },
    hasButton: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    async fetchAppManagers() {
      const appId = localStorage.getItem("appId");
      const res = await getAppManagers(appId);

      this.managerList = res || [];
    },
  },
  created() {
    this.fetchAppManagers();
  },
});
</script>

<style lang="less" scoped="true">
.u-403 {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .u-403-info {
    margin-top: 24px;
    text-align: center;
    .title {
      font-size: 16px;
      color: #333333;
      line-height: 24px;
    }
    .content {
      margin-top: 16px;
      font-size: 14px;
      color: #999999;
      line-height: 20px;
    }
    .button {
      display: inline-block;
      padding: 6px 16px;
      margin-top: 24px;
      background: #103ffa;
      border-radius: 3px;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>

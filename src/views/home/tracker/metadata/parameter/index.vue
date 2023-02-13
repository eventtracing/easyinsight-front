<template>
  <div class="fill g-pt-4">
    <a-tabs
      class="parameter-tabs flex-tab"
      :animated="false"
      v-model:activeKey="activeKey"
      @change="onTabChange"
    >
      <a-tab-pane :key="ParamTypeEnum.OBJ_BUSINESS_PARAM" tab="对象业务私参">
        <BusinessParamTab
          ref="business-param-tab"
          @getFilter="getFilter"
        ></BusinessParamTab>
      </a-tab-pane>
      <a-tab-pane :key="ParamTypeEnum.OBJ_NORMAL_PARAM" tab="对象标准私参">
        <ParameterTab
          ref="normal-param-tab"
          :parameterType="ParamTypeEnum.OBJ_NORMAL_PARAM"
        ></ParameterTab>
      </a-tab-pane>
      <a-tab-pane :key="ParamTypeEnum.EVENT_PARAM" tab="事件公参">
        <ParameterTab
          ref="event-param-tab"
          :parameterType="ParamTypeEnum.EVENT_PARAM"
        ></ParameterTab>
      </a-tab-pane>
      <a-tab-pane :key="ParamTypeEnum.GLOBAL_PUBLIC_PARAM" tab="全局公参">
        <ParameterTab
          ref="public-param-tab"
          :parameterType="ParamTypeEnum.GLOBAL_PUBLIC_PARAM"
        ></ParameterTab>
      </a-tab-pane>
      <template #tabBarExtraContent
        ><a-button
          class="g-mr-24"
          type="primary"
          @click="onAddParameter"
          v-auth="1016"
          >添加参数</a-button
        ></template
      >
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BusinessParamTab from "./BusinessParamTab.vue";
import ParameterTab from "./ParameterTab.vue";
import ParamAddDrawer from "./ParamAddDrawer.vue";
import { ParamTypeEnum } from "@/types/parameter.type";
export default defineComponent({
  name: "Parameter",
  components: {
    BusinessParamTab,
    ParameterTab,
  },

  setup() {
    const _ParamTypeEnum = ParamTypeEnum;

    return {
      ParamTypeEnum: _ParamTypeEnum,
    };
  },

  computed: {
    filterStrategy() {
      const filterStrategy = this.$store.state.paramsTabFilter;

      return filterStrategy;
    },
  },

  data() {
    const _activeKey = ParamTypeEnum.OBJ_BUSINESS_PARAM;

    return {
      activeKey: _activeKey,
    };
  },

  created() {
    const { tab } = this.$route.query;

    if (tab) {
      // @ts-ignore
      this.activeKey = Number(tab);
    }
  },

  methods: {
    businessParamTab() {
      const businessParamTab: typeof BusinessParamTab =
        this.$refs["business-param-tab"];
      return businessParamTab;
    },

    normalParamTab() {
      const normalParamTab: typeof ParameterTab =
        this.$refs["normal-param-tab"];
      return normalParamTab;
    },

    eventParamTab() {
      const eventParamTab: typeof ParameterTab = this.$refs["event-param-tab"];
      return eventParamTab;
    },

    publicParamTab() {
      const publicParamTab: typeof ParameterTab =
        this.$refs["public-param-tab"];
      return publicParamTab;
    },

    getFilter(...rest) {
      return this.$store.commit.apply(
        this.$store,
        ["setParamsTabFilter"].concat(rest)
      );
    },

    refresh() {
      const tabMap = {
        [ParamTypeEnum.OBJ_BUSINESS_PARAM]: this.businessParamTab(),
        [ParamTypeEnum.OBJ_NORMAL_PARAM]: this.normalParamTab(),
        [ParamTypeEnum.EVENT_PARAM]: this.eventParamTab(),
        [ParamTypeEnum.GLOBAL_PUBLIC_PARAM]: this.publicParamTab(),
      };
      const activeTab = tabMap[this.activeKey];

      activeTab && activeTab.refresh();
    },

    onAddParameter() {
      this.$createInstance(ParamAddDrawer, {
        type: this.activeKey,
        onHandlerOk: () => {
          this.refresh();
        },
      });
    },

    onTabChange(n) {
      this.refresh();
      this.setQueryParams("tab", n);
    },
  },
});
</script>

<style lang="less" scoped="true">
.top {
  padding: 16px 24px 6px;
}

.parameter-tabs :deep(.ant-tabs-bar) {
  padding-left: 16px;
  margin-bottom: 0;
}
</style>

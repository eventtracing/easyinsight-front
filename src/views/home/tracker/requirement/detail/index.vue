<template>
  <div class="fill g-p-lr-24 g-pb-24" style="overflow-y: auto">
    <BackToList
      :reqIssueKey="$get(req, 'reqIssueKey', '')"
      :issueUrl="$get(req, 'issueUrl', '')"
    ></BackToList>
    <a-tabs
      class="parameter-tabs g-mt-16"
      :animated="false"
      v-model:activeKey="activeKey"
    >
      <a-tab-pane key="1" tab="埋点方案">
        <TrackerTab :reqId="reqId" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="埋点需求">
        <BaseInfoTab :req="req" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BackToList from "./BackToList.vue";
import BaseInfoTab from "./BaseInfoTab.vue";
import TrackerTab from "./TrackerTab.vue";
import { RequirementDto } from "@/types/requirement.type";

export default defineComponent({
  name: "ReqDetail",
  components: {
    BackToList,
    TrackerTab,
    BaseInfoTab,
  },
  data() {
    const _activeKey = "1";
    const _reqId = null;
    const _req: RequirementDto = null;

    return {
      activeKey: _activeKey,
      reqId: _reqId,
      req: _req,
    };
  },
  async created() {
    const { tab } = this.$route.query;

    if (tab) {
      this.activeKey = String(tab);
    }
  },
  methods: {
    watchActiveKey() {
      this.$router
        .replace({
          path: this.$route.path,
          query: { ...this.$route.query, tab: String(this.activeKey) },
        })
        .catch(() => {});
    },
  },
  watch: {
    activeKey: {
      handler: "watchActiveKey",
    },
  },
});
</script>

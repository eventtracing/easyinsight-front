<template>
  <div class="fill g-p-lr-24">
    <a-tabs
      v-if="terminals && terminals.length"
      :animated="false"
      v-model="activeKey"
    >
      <a-tab-pane v-for="t in terminals" :key="t.name" :tab="t.name">
        <div>
          <VersionTree ref="version-tree" :terminalId="t.id"></VersionTree>
          <VersionList
            class="g-mt-16"
            :id="t.id"
            @sync="onSyncVersionTree"
          ></VersionList>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VersionTree from "./VersionTree.vue";
import VersionList from "./VersionList.vue";
import { getTerminalList } from "@/services/terminal.service";

export default defineComponent({
  name: "VersionConfig",
  components: {
    VersionTree,
    VersionList,
  },
  computed: {
    versionTreeVm() {
      return this.$refs["version-tree"];
    },
  },
  data() {
    return { activeKey: "", terminals: [] };
  },
  async created() {
    const { tab } = this.$route.query;

    getTerminalList({ currentPage: 1, pageSize: 50, search: "" }).then(
      (res) => {
        this.terminals = res.list;
        this.activeKey = tab ? String(tab) : String(this.terminals[0]?.name);
      }
    );
  },
  methods: {
    onSyncVersionTree() {
      this.versionTreeVm?.forEach((vm) => {
        vm.getVersionTreeData();
      });
    },

    watchActiveKey() {
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          tab: this.activeKey,
        },
      });
    },
  },
  watch: {
    activeKey: {
      handler: "watchActiveKey",
    },
  },
});
</script>

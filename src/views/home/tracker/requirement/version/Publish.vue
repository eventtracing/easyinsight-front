<template>
  <div class="g-pl-24 g-mt-8">
    <a-tabs type="card" v-model:activeKey="activeKey">
      <a-tab-pane
        v-for="terminal in terminalLists"
        :key="terminal.id"
        :tab="terminal.name"
      >
        <PublishList :terminalId="terminal.id" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { shallowReactive, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PublishList from "./components/PublishList.vue";
import { getTerminalList } from "@/services/terminal.service";

const terminalLists = shallowReactive<
  Array<Record<string, unknown> & { id: string | number }>
>([]);

const activeKey: any = ref("");
const route = useRoute();

onMounted(() => {
  getTerminalList({ currentPage: 1, pageSize: 50, search: "" }).then((res) => {
    const list = res?.list || [];
    const { terminal = "" } = route.query;
    const flag = list.some((item) => item.id === Number(terminal));

    terminalLists.push(...res.list);
    activeKey.value = terminal && flag ? +terminal : list?.[0]?.id;
  });
});
</script>

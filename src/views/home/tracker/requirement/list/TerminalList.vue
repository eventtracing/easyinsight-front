<template lang="pug">
a-form
  a-form-item(label="选择所属终端")
    a-checkbox-group
      a-checkbox(v-for="terminal in terminalList" :value="terminal.id" :key="terminal.id") {{terminal.name}}
</template>

<script setup lang="ts">
import type { TerminalSimpleDto } from "@/types/terminal.type";
import { shallowReactive, onMounted } from "vue";
import { getTerminalList } from "@/services/terminal.service";

const terminalList = shallowReactive<TerminalSimpleDto[]>([]);

onMounted(() => {
  const params = { currentPage: 1, pageSize: 50, search: "" };

  getTerminalList(params).then((res) => {
    terminalList.length = 0;
    terminalList.push(...res.list);
  });
});
</script>

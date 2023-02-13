<template>
  <a-form-item name="name" label="需求组名称" required>
    <a-input
      v-model:value="reqGroupData.name"
      placeholder="请输入需求组名称, 不超过128个字"
      max-length="128"
    />
  </a-form-item>
  <a-form-item name="owners" label="数据负责人">
    <a-select
      :options="dataOwners"
      mode="multiple"
      placeholder="请选择数据负责人"
      v-model:value="reqGroupData.owners"
    >
    </a-select>
  </a-form-item>
  <a-form-item name="desc" label="描述">
    <a-textarea
      v-model:value="reqGroupData.desc"
      placeholder="请输入需求组描述, 不超过512个字"
      max-length="512"
    />
  </a-form-item>
</template>

<script setup lang="ts">
import type { FilterDto } from "@/types/app.type";

const { dataOwners, reqGroupData } = defineProps<{
  reqGroupData: Record<string, unknown>;
  dataOwners: FilterDto[];
}>();
</script>

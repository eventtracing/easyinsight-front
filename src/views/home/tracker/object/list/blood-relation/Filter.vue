<template>
  <div class="flex-ac flex-wrap">
    <u-filter-select
      label="终端"
      :value="conditions.terminalId"
      :options="terminals"
      :hasAll="false"
      labelAttr="value"
      valueAttr="key"
      :allowClear="false"
      @change="onChangeTerminal"
    ></u-filter-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { TagAggreDto } from "@/types/common.type";

export default defineComponent({
  name: "TableFilter",
  setup() {
    const _displayTypes = reactive([
      { key: "name", value: "名称" },
      { key: "oid", value: "oid" },
    ]);

    return {
      displayTypes: _displayTypes,
    };
  },
  props: {
    id: {},
    conditions: {
      required: true,
      default: () => ({}),
    },
  },
  computed: {
    terminals() {
      return this.terminalTree.map((v) => v.terminal);
    },

    versions() {
      const terminalId = this.conditions.terminalId;

      if (!terminalId) return [];

      const option = this.terminalTree.find(
        (v) => v.terminal.key === `${terminalId}`
      );

      return option?.versions || [];
    },
  },
  data() {
    const _terminalTree: { terminal: TagAggreDto; versions: TagAggreDto[] }[] =
      [];

    return { terminalTree: _terminalTree };
  },
  methods: {
    onChangeDisplayType(v) {
      this.$emit("change", { ...this.conditions, displayType: v });
    },
    onChangeTerminal(v) {
      const option = this.terminalTree.find(
        (item) => item.terminal.key === v
      )?.versions;
      const vs = option?.versions || [];

      this.$emit("change", {
        ...this.conditions,
        terminalId: v,
        versionId: vs[0]?.key,
      });
    },
    onChangeVersionId(v) {
      this.$emit("change", { ...this.conditions, versionId: v });
    },
  },
});
</script>

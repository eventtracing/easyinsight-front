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
import { defineComponent, PropType } from "vue";
import { TagAggreDto } from "@/types/common.type";
import { getSingleObjFilterAggre } from "@/services/object.service";

export default defineComponent({
  name: "TableFilter",
  props: {
    id: {},
    conditions: {
      required: true,
    },
    reqPoolId: {},
    fromObjectManage: {
      type: Boolean as PropType<boolean>,
    },
    fromRequirePool: {
      type: Boolean as PropType<boolean>,
    },
  },
  computed: {
    terminals() {
      return this.terminalTree;
    },
  },
  data() {
    const _terminalTree: { terminal: TagAggreDto }[] = [];

    return {
      terminalTree: _terminalTree,
    };
  },

  async mounted() {
    const res: any = await getSingleObjFilterAggre(this.id, this.reqPoolId);
    this.terminalTree = res?.terminals || [];
    let t = this.terminalTree[0];

    if (this.conditions.terminalId) {
      t =
        this.terminalTree.find(
          (v) => v.terminal?.key === this.conditions.terminalId
        ) || t;
    }

    this.$emit("change", { ...this.conditions, terminalId: t?.key }, true);
  },

  methods: {
    onChangeTerminal(v) {
      this.$emit("change", { ...this.conditions, terminalId: v });
    },
  },
});
</script>

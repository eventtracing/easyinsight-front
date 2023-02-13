<template>
  <div>
    <div class="text-title g-m-tb-16">埋点信息</div>
    <u-info class="g-pl-8" size="large" :labelWidth="80" itemsAlign="center">
      <u-info-item label="终端">{{ terminalName }}</u-info-item>
      <u-info-item label="事件类型">
        <span
          v-for="item in diffEvents"
          :class="['item', genClasses(item.paramChangeType)]"
          :key="item.eventId"
        >
          <span v-if="item.paramChangeType === ChangeTypeEnum.SAME">{{
            item.code
          }}</span>
          <u-hint-tooltip
            v-else
            :text="item.code"
            :title="genTooltip(item)"
          ></u-hint-tooltip>
        </span>
      </u-info-item>
    </u-info>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ChangeTypeEnum } from "@/types/object.type";
import { genClasses, genTooltip } from "./util";
export default defineComponent({
  name: "TrackerInfo",
  setup() {
    const _ChangeTypeEnum = ChangeTypeEnum;
    const _genClasses = genClasses;
    const _genTooltip = (args) => genTooltip(args, "事件类型");

    return {
      ChangeTypeEnum: _ChangeTypeEnum,
      genClasses: _genClasses,
      genTooltip: _genTooltip,
    };
  },

  props: {
    terminalName: {},
    diffEvents: {},
  },
});
</script>

<style lang="less" scoped="true">
.item {
  padding: 2px 10px;
  border: 1px solid #eee;
  & + .item {
    margin-left: 16px;
  }
}
.new-item {
  background: #e9f8f1;
}
.delete-item {
  background: #feedee;
}
</style>

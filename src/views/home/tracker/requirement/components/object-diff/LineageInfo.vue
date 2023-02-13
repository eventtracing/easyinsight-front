<template>
  <div>
    <div class="text-title g-m-tb-16">血缘配置</div>
    <u-info class="g-pl-8" size="large" :labelWidth="80" itemsAlign="center">
      <u-info-item label="父对象">
        <span
          v-for="item in diffParentObjs"
          :class="['item', genClasses(item.paramChangeType)]"
          :key="item.parentObjId"
        >
          <span v-if="item.paramChangeType === ChangeTypeEnum.SAME">{{
            item.parentObjName
          }}</span>
          <u-hint-tooltip
            v-else
            :text="item.parentObjName"
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
  name: "LineageInfo",
  setup() {
    const _ChangeTypeEnum = ChangeTypeEnum;
    const _genClasses = genClasses;
    const _genTooltip = (args) => genTooltip(args, "父对象");

    return {
      ChangeTypeEnum: _ChangeTypeEnum,
      genClasses: _genClasses,
      genTooltip: _genTooltip,
    };
  },
  props: {
    diffParentObjs: {},
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

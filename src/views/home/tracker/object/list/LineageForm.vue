<template>
  <div class="g-mt-24 lineage-form">
    <div class="flex g-mt-16">
      <div class="g-mr-16" style="padding-left: 10px; color: #102048">
        血缘配置(父<br />对象)
      </div>
      <template v-if="disabled">
        <span
          style="color: #a9a9b8; padding-left: 3px"
          class="g-mr-8"
          v-for="t in parentObjsDiff"
          :key="t.id"
          :style="{ background: diffColors[t.diffType] }"
          >{{ `${t.oid}（${t.name}）` }}</span
        >
      </template>
      <a-select
        v-else-if="alive && type !== 3"
        style="width: 600px"
        placeholder="请选择"
        :disabled="disabled"
        mode="multiple"
        :value="parentObjs"
        :filterOption="filterOption"
        :getPopupContainer="$getPopupContainer"
        @change="(v) => onParentObjsChange(v, uuid)"
      >
        <a-select-option
          v-for="t in list"
          :key="t.id"
          :value="t.id"
          :title="t.name"
        >
          {{ `${t.oid}（${t.name}）` }}
        </a-select-option>
      </a-select>
      <a-alert
        style="padding: 4px 15px; height: 32px"
        message="浮层这种对象类型不设置父对象，仅单独管理。"
        type="warning"
        v-else
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ObjSimpleDto } from "@/types/object.type";
import { diffColors } from "@/utils/vars";
import { getAllObject } from "@/services/object.service";
import Bus from "@/bus";

export default defineComponent({
  name: "LineageForm",
  props: {
    type: {
      type: Number,
      required: false,
      default: 1,
    },
    uuid: {
      type: String,
    },
    parentObjs: {},
    parentObjsDiff: {},
    terminalIds: {},
    requireIds: {
      type: Array,
      default: () => [],
    },
    id: {},
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    textParents() {
      const result = this.list.filter((v) => this.parentObjs?.includes(v.id));

      return result;
    },
  },

  created() {
    Bus.$on("changeRequired", this.changeRequired);
  },

  beforeUnmount() {
    Bus.$off("changeRequired");
  },

  data() {
    const _list: ObjSimpleDto[] = [];
    const _alive = true;

    return { list: _list, alive: _alive, diffColors };
  },

  methods: {
    async changeRequired() {
      this.list = await getAllObject({
        terminalIds: this.terminalIds,
        reqPoolId: this.reqPoolId,
      });
    },
    filterOption(input: any, option: any) {
      return (
        option.children[0].children
          .toUpperCase()
          .indexOf(input.trim().toUpperCase()) >= 0
      );
    },

    onParentObjsChange(v, uuid) {
      this.$emit("change", v, uuid);
    },

    async initList() {
      if (this.terminalIds?.length) {
        this.list = await getAllObject({
          terminalIds: this.terminalIds,
          reqPoolId: this.reqPoolId,
        });

        this.alive = false;
        this.$nextTick(() => {
          this.alive = true;
        });
      } else {
        this.list = [];
      }
    },
  },
  watch: {
    terminalIds: {
      handler: "initList",
      immediate: true,
    },
    parentObjs: {
      handler: "showTracker",
      immediate: true,
    },
  },
});
</script>

<style lang="less" scoped="true">
.lineage-form {
  position: relative;
  :deep(.ant-select) {
    [title=""].ant-select-selection__choice {
      border: 1px solid #f24957;
      color: #f24957;
    }
  }
}
</style>

<template>
  <div class="flex-ac flex-wrap">
    <u-filter-select
      label="终端"
      :value="conditions.terminalIds"
      :options="terminals"
      labelAttr="value"
      valueAttr="key"
      :hasAll="false"
      @change="onChange($event, 'terminalIds')"
    ></u-filter-select>
    <u-divider></u-divider>
    <u-filter-select
      label="端版本"
      :value="conditions.versionIds"
      :options="terminalVersions"
      labelAttr="value"
      valueAttr="key"
      :hasAll="false"
      :overlayStyle="{ width: '180px' }"
      @change="onChange($event, 'versionIds')"
    ></u-filter-select>
    <u-divider></u-divider>
    <u-filter-select
      label="对象类型"
      :value="conditions.objectType"
      :options="objTypeOptions"
      labelAttr="value"
      valueAttr="key"
      @change="onChange($event, 'objectType')"
    ></u-filter-select>
    <u-divider></u-divider>
    <u-filter-select
      label="标签"
      mode="multiple"
      :value="conditions.tagIds"
      :options="tags"
      labelAttr="value"
      valueAttr="key"
      @change="onChange($event, 'tagIds')"
    ></u-filter-select>
    <u-divider></u-divider>
    <u-text-button class="g-ml-4" :on-click="onRest">重置</u-text-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from "vue";
import { TagAggreDto } from "@/types/common.type";
import { ObjTypeEnum } from "@/types/object.type";
import { getObjFilterAggre } from "@/services/object.service";
export default defineComponent({
  name: "TableFilter",
  setup() {
    const _objTypeOptions = reactive([
      {
        key: ObjTypeEnum.PAGE,
        value: "页面",
      },
      {
        key: ObjTypeEnum.ELEMENT,
        value: "元素",
      },
      {
        key: ObjTypeEnum.POPOVER,
        value: "浮层",
      },
    ]);

    return {
      objTypeOptions: _objTypeOptions,
    };
  },

  props: {
    conditions: {
      type: Object as PropType<{
        terminalIds: string;
        versionIds: number | string;
        tagIds: number[];
        objectType: ObjTypeEnum | "all";
      }>,
      required: true,
    },
  },

  data() {
    const _terminals: TagAggreDto[] = [];
    const _versions: TagAggreDto[] = [];
    const _tags: TagAggreDto[] = [];
    return {
      terminals: _terminals,
      versions: _versions,
      tags: _tags,
    };
  },

  computed: {
    terminalVersions() {
      const versions = this.versions;

      return versions.filter(
        (v) => +v.associatedKey === +this.conditions.terminalIds
      );
    },
  },

  created() {
    getObjFilterAggre().then((res) => {
      this.terminals = res.terminals;
      this.versions = res.releases;
      if (this.terminals.length || this.versions.length) {
        this.$emit(
          "sync",
          this.conditions.terminalIds || this.terminals[0]?.key,
          this.conditions.versionIds || this.terminalVersions[0]?.key
        );
      }

      this.tags = res.tags;
    });
  },
  methods: {
    onChange(v, key: string) {
      this.$emit("filterChange", key, v);
    },
    onRest() {
      this.$emit("reset");
    },
  },

  watch: {
    "conditions.terminalIds"() {
      this.conditions.versionIds = this.terminalVersions[0]?.key;
      this.onChange(this.conditions.versionIds, "versionIds");
    },
  },
});
</script>

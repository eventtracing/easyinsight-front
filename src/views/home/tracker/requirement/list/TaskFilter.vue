<template>
  <div class="g-mt-8">
    <div class="flex-ac g-mb-8" style="flex-wrap: wrap">
      <u-filter-select
        label="需求"
        :value="conditions.issue"
        :options="requirementList"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'issue')"
      ></u-filter-select>
      <u-divider></u-divider>
      <u-filter-select
        label="数据负责人"
        :value="conditions.doe"
        :options="userLists"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'doe')"
      ></u-filter-select>
      <u-divider></u-divider>
      <u-filter-select
        label="终端"
        :value="conditions.tId"
        :options="teriminalFilter"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'tId')"
      ></u-filter-select>
      <u-divider></u-divider>
      <u-filter-select
        label="任务状态"
        :value="conditions.sts"
        :options="reqStatusOptions"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'sts')"
      ></u-filter-select>
      <u-divider></u-divider>
      <u-filter-select
        label="任务负责人"
        :value="conditions.to"
        :options="userLists"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'to')"
      ></u-filter-select>
      <u-divider></u-divider>
      <u-filter-select
        label="任务验证人"
        :value="conditions.tv"
        :options="userLists"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'tv')"
      ></u-filter-select>
      <u-divider dashed />
    </div>
    <UDividerDash class="g-mb-8" />
    <div class="flex-ac g-mb-8">
      <u-filter-select
        label="SPM/事件状态"
        :value="conditions.ps"
        :options="reqStatusOptions"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'ps')"
      ></u-filter-select>
      <u-divider></u-divider>
      <u-filter-select
        label="SPM/事件负责人"
        :value="conditions.po"
        :options="userLists"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'po')"
      ></u-filter-select>
      <u-divider></u-divider>
      <u-filter-select
        label="SPM/事件验证人"
        :value="conditions.pv"
        :options="userLists"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'pv')"
      ></u-filter-select>
      <u-divider></u-divider>
      <u-filter-select
        label="端版本"
        :value="conditions.terV"
        :options="versions"
        labelAttr="value"
        valueAttr="key"
        ignoreNull
        @change="onChange($event, 'terV')"
      ></u-filter-select>
      <u-divider></u-divider>
      <u-filter-select
        label="迭代"
        :value="conditions.spt"
        :options="interators"
        labelAttr="value"
        valueAttr="key"
        @change="onChange($event, 'spt')"
      ></u-filter-select>
      <u-divider></u-divider>
      <span class="text-link g-ml-8" @click="onRest">重置</span>
    </div>
    <UDividerDash class="g-mb-8" />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw, markRaw } from "vue";
import { TagAggreDto } from "@/types/common.type";
import { reqStatusOptions } from "@/types/requirement.type";
import { getTaskOptions } from "@/services/requirement.service";
import { getAllUsers } from "@/services/app.service";
import store from "@/store";

export default defineComponent({
  name: "TaskFilter",

  setup() {
    const _reqStatusOptions = reqStatusOptions;
    const objectTypeEnum = toRaw<{ key: string | number; value: string }[]>(
      store.state.objectType
    );
    const labelStatus = markRaw<TagAggreDto[]>([
      { key: "1", value: "SPM状态" },
      { key: "2", value: "任务状态" },
    ]);
    const labelOwner = markRaw<TagAggreDto[]>([
      { key: "1", value: "SPM负责人" },
      { key: "2", value: "任务负责人" },
    ]);
    const labelVerifier = markRaw<TagAggreDto[]>([
      { key: "1", value: "SPM验证人" },
      { key: "2", value: "任务验证人" },
    ]);

    return {
      reqStatusOptions: _reqStatusOptions,
      objectTypeEnum,
      labelStatus,
      labelOwner,
      labelVerifier,
    };
  },

  props: {
    conditions: {
      required: true,
      type: Object,
      default: () => ({}),
    },
    terminalLists: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    const _versions: TagAggreDto[] = [];
    const _interators: TagAggreDto[] = [];

    return {
      versions: _versions,
      interators: _interators,
      userLists: [],
      requirementList: [],
    };
  },

  created() {
    getAllUsers().then((userLists) => {
      this.userLists = userLists.map((v) => ({
        key: v.email,
        value: v.userName,
      }));
    });
    getTaskOptions().then((res) => {
      const reqInfos = res?.reqInfos || [];

      this.interators = res.sprints.map((v) => ({
        key: v,
        value: v ?? "null",
      }));
      this.versions = res.termnialVersions.map((v) => ({
        key: v,
        value: v || (v === "" ? "空字符串" : "null"),
      }));

      this.requirementList = reqInfos
        .filter((item: any) => item.reqIssueKey)
        .map((item: any) => {
          const { name, reqIssueKey } = item;

          return {
            value: `${name}（${reqIssueKey}）`,
            key: reqIssueKey,
          };
        });
    });
  },

  computed: {
    teriminalFilter() {
      return this.terminalLists.map((v) => ({ key: v.id, value: v.name }));
    },
  },

  methods: {
    onChange(v, key: string) {
      if (typeof v === "object") return;
      if (v === "all") v = undefined;

      this.$emit("filterChange", key, v);
    },

    onRest() {
      this.$emit("reset");
    },
  },
});
</script>

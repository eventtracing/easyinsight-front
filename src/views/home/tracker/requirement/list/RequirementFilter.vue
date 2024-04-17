<template>
  <div class="g-mt-8">
    <div class="flex-ac g-mb-8">
      <u-filter-select
        label="需求组名称"
        :value="conditions.reqPoolId"
        :options="reqPoolList"
        label-attr="value"
        value-attr="key"
        @change="onChange($event, 'reqPoolId')"
      />
      <u-filter-select
        label="数据负责人"
        :value="conditions.dataOwnerEmail"
        :options="dataOwnersLists"
        label-attr="value"
        value-attr="key"
        @change="onChange($event, 'dataOwnerEmail')"
      />
      <u-filter-select
        label="需求名称"
        :value="conditions.reqId"
        :options="reqList"
        label-attr="value"
        value-attr="key"
        @change="onChange($event, 'reqId')"
      />
      <u-divider />
      <u-filter-select
        label="需求创建人"
        :value="conditions.creatorEmail"
        :options="creatorsLists"
        label-attr="value"
        value-attr="key"
        @change="onChange($event, 'creatorEmail')"
      />
      <u-divider />
      <u-filter-select
        label="来源需求状态"
        :value="conditions.status"
        :options="requirementStatus"
        label-attr="value"
        value-attr="key"
        @change="onChange($event, 'status')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  markRaw,
  PropType,
  shallowReactive,
  watch,
} from "vue";
import { TagAggreDto } from "@/types/common.type";
import type { FilterDto } from "@/types/app.type";
import { SourceMap } from "@/types/requirement.type";
import { getRequirementGroup } from "@/services/requirement.service";
import Bus from '@/bus'
export default defineComponent({
  name: "RequirementFilter",
  props: {
    conditions: {
      type: Object,
      default: () => ({}),
    },
    dataOwners: {
      type: Array as PropType<FilterDto[]>,
      default: () => [],
    },
    creators: {
      type: Array as PropType<FilterDto[]>,
      default: () => [],
    },
  },
  setup(props) {
    const dataOwners = shallowReactive<FilterDto[]>([]);
    const creators = shallowReactive<FilterDto[]>([]);

    watch(
      () => [props.dataOwners, props.creators],
      ([dataOwnersList = [], creatorList]) => {
        dataOwners.length = 0;
        creators.length = 0;
        dataOwners.push(...(dataOwnersList as FilterDto[]));
        creators.push(...(creatorList as FilterDto[]));
      }
    );

    return {
      dataOwnersLists: dataOwners,
      creatorsLists: creators,
      requirementStatus: markRaw<Record<string, unknown>[]>(
        Object.keys(SourceMap)
          .filter((source) => !Number.isNaN(+source))
          .map((source) => {
            return {
              key: source,
              value: SourceMap[source],
            };
          })
      ),
    };
  },

  data() {
    const _owners: TagAggreDto[] = [];
    const _verifiers: TagAggreDto[] = [];
    const _versions: TagAggreDto[] = [];
    const _reqPoolList: any[] = [];
    const __reqList: any[] = [];
    const _list: any = [];

    return {
      owners: _owners,
      verifiers: _verifiers,
      versions: _versions,
      list: _list,
      reqPoolList: _reqPoolList,
      reqList: __reqList,
    };
  },

  methods: {
    onChange(v, key: string) {
      v === "all" && (v = undefined);

      this.$emit("filterChange", key, v);
    },
    getOptions(val) {
      const reqPoolList = val?.map((ele) => ({
        value: `${ele.name}(${ele.id})`,
        key: ele.id
      }))
      const reqList = val
        ?.reduce((prev, cur) => {
          return [...prev, ...cur.requirements]
        }, [])
      this.reqPoolList.length = 0
      this.reqPoolList.push(...reqPoolList)
      this.reqList.length = 0
      this.reqList.push(...reqList)
    }

  },
  created() {
    Bus.$on('getPoolGroupList', (val) => {
      this.getOptions(val)
    })
  },
});
</script>

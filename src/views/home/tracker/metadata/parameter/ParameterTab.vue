<template>
  <div class="tab">
    <div class="g-m-tb-16 clearfix">
      <s-table-search
        class="float-right"
        v-model:search="search"
        placeholder="请输入参数名/中文名称查询"
        @sync="sync"
        @search="sync(true)"
      ></s-table-search>
    </div>
    <List
      :list="list"
      :loading="loading"
      :pagination="pagination"
      :orderBy="orderBy"
      :orderRule="orderRule"
      :creatorFilters="creatorFilters"
      :creators="creators"
      :valueTypes="valueTypes"
      @changeTable="onChangeTable"
      @sync="sync"
    ></List>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import List from "./List.vue";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import { TablePagination } from "@/types/table.type";
import {
  GetParameterListReq,
  ParameterDto,
  ParamValueTypeEnum,
} from "@/types/parameter.type";
import {
  getParameterList,
  getParamFilterAggre,
} from "@/services/parameter.service";
export default defineComponent({
  name: "ParameterTab",
  components: { List },
  mixins: [TableMixin],
  props: {
    parameterType: {},
  },

  data() {
    const _list: ParameterDto[] = [];
    const _orderBy = "createTime";
    const _orderRule: "descend" | "ascend" = "descend";
    const _search = "";
    const _valueTypes: ParamValueTypeEnum[] = [];
    const _creatorFilters = [];
    const _creators: string[] = [];

    // 创建人筛选
    return {
      list: _list,
      orderBy: _orderBy,
      orderRule: _orderRule,
      search: _search,
      valueTypes: _valueTypes,
      creatorFilters: _creatorFilters,
      creators: _creators,
    };
  },

  created() {
    const filter = this.getQueryParams(this.parameterType) || {};
    this.current = filter.current || this.current;
    this.pageSize = filter.pageSize || this.pageSize;
    this.orderBy = filter.orderBy || this.orderBy;
    this.orderRule = filter.orderRule || this.orderRule;
    this.search = (filter !== "" && filter.search) || this.search;
    this.creators = filter.createEmails ? filter.createEmails : this.creators;
    this.valueTypes = filter.valueTypes ? filter.valueTypes : this.valueTypes;
    this.sync();
  },

  methods: {
    async sync(init = false) {
      this.loading = true;

      init && (this.current = 1);

      const reqOptions: GetParameterListReq = {
        currentPage: this.current,
        pageSize: this.pageSize,
        orderBy: this.orderBy,
        orderRule: this.orderRule,
        search: this.search.trim(),
        paramType: this.parameterType,
        createEmails: this.creators.length ? this.creators : null,
        valueTypes: this.valueTypes.length ? this.valueTypes : null,
      };
      const params = JSON.stringify(reqOptions);
      this.setQueryParams(this.parameterType, params);

      this.$emit("getFilter", { key: this.parameterType, value: params });

      getParameterList(reqOptions)
        .then((res) => {
          this.total = res.totalNum;
          this.list = res.list;
          this.loading = false;

          if (res.totalNum > 0 && res.list.length === 0) {
            this.current -= 1;
            this.sync();
          }
        })
        .catch(() => {
          this.loading = false;
        });

      const result = await getParamFilterAggre(this.parameterType);

      this.creatorFilters = result?.creators?.map((c) => ({
        text: c.value,
        value: c.key,
      }));
    },
    onChangeTable(pagination: TablePagination, filter, sorter) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
      this.valueTypes = filter?.valueType || [];
      this.creators = filter?.creator || [];

      if (this.orderBy === sorter.field) {
        this.orderRule = sorter.order || "ascend";
      } else {
        this.orderBy = sorter.field;
        this.orderRule = "ascend";
      }

      this.sync();
    },
    refresh() {
      this.sync(true);
    },
  },
});
</script>

<style lang="less" scoped="true">
.tab {
  padding: 0 24px 24px;
}
</style>

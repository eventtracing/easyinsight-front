<template>
  <div class="fill flex">
    <Pool ref="pool" class="left g-pt-12" @active="onActive" @add="sync"></Pool>
    <div class="right flex-1">
      <div class="g-m-tb-16 clearfix">
        <s-table-search
          class="float-right"
          v-model:search="search"
          placeholder="请输入参数中文名称/关联对象查询"
          @sync="sync"
          @search="sync(true)"
        ></s-table-search>
      </div>
      <List
        :code="code"
        :list="list"
        :loading="loading"
        :pagination="pagination"
        :orderBy="orderBy"
        :orderRule="orderRule"
        :creatorFilters="creatorFilters"
        :creators="creators"
        @changeTable="onChangeTable"
        @sync="sync"
      ></List>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Pool from "./BusinessParamPool.vue";
import List from "./BusinessParamList.vue";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import { TablePagination } from "@/types/table.type";
import {
  GetBusinessParameListReq,
  BusinessPrivateParamDto,
  ParamValueTypeEnum,
  ParamTypeEnum,
} from "@/types/parameter.type";
import {
  getBusinessParamList,
  getParamFilterAggre,
} from "@/services/parameter.service";
export default defineComponent({
  name: "BusinessParamTab",
  components: { Pool, List },
  mixins: [TableMixin],
  computed: {
    poolComp() {
      const poolComp: typeof Pool = this.$refs.pool;

      return poolComp;
    },
  },

  data() {
    const _list: BusinessPrivateParamDto[] = [];
    const _orderBy = "createTime";
    const _orderRule: "descend" | "ascend" = "descend";
    const _search = "";
    const _code = "";
    const _valueTypes: ParamValueTypeEnum[] = [];
    const _creatorFilters: any = [];
    const _creators: string[] = [];

    // 创建人筛选
    return {
      list: _list,
      orderBy: _orderBy,
      orderRule: _orderRule,
      search: _search,
      code: _code,
      valueTypes: _valueTypes,
      creatorFilters: _creatorFilters,
      creators: _creators,
    };
  },

  created() {
    const filter = this.getQueryParams(ParamTypeEnum.OBJ_BUSINESS_PARAM) || {};
    this.current = filter.current || this.current;
    this.pageSize = filter.pageSize || this.pageSize;
    this.orderBy = filter.orderBy || this.orderBy;
    this.orderRule = filter.orderRule || this.orderRule;
    this.search = (filter !== "" && filter.search) || this.search;
    this.code = filter.code || this.code;
    this.creators = filter.createEmails ? filter.createEmails : this.creators;
    this.valueTypes = filter.valueTypes ? filter.valueTypes : this.valueTypes;
    this.loading = false;
  },

  methods: {
    async sync(init = false) {
      if (!this.code) return;

      this.loading = true;

      init && (this.current = 1);

      const reqOptions: GetBusinessParameListReq = {
        currentPage: this.current,
        pageSize: this.pageSize,
        orderBy: this.orderBy,
        orderRule: this.orderRule,
        search: this.search.trim(),
        code: this.code,
        createEmails: this.creators.length ? this.creators : null,
        valueTypes: this.valueTypes.length ? this.valueTypes : null,
      };

      const params = JSON.stringify(reqOptions);
      this.setQueryParams(ParamTypeEnum.OBJ_BUSINESS_PARAM, params);
      this.$emit("getFilter", {
        key: ParamTypeEnum.OBJ_BUSINESS_PARAM,
        value: params,
      });

      getBusinessParamList(reqOptions)
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

      const result = await getParamFilterAggre(
        ParamTypeEnum.OBJ_BUSINESS_PARAM,
        this.code
      );

      this.creatorFilters = result?.creators?.map((c) => ({
        text: c.value,
        value: c.key,
      }));
    },

    onActive(code) {
      this.code = code;
      this.setQueryParams("activeId", code);
      this.sync(true);
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
      this.poolComp && this.poolComp.refresh();
    },
  },
});
</script>

<style lang="less" scoped="true">
.left {
  width: 220px;
  border-right: 1px solid #dee2e9;
}

.right {
  padding: 0 24px 24px;
  overflow-y: auto;
}
</style>

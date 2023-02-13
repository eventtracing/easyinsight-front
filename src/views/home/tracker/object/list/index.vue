<template>
  <div class="g-p-lr-24">
    <div class="g-m-tb-16 flex">
      <div class="flex-1">
        <ObjectFilter
          :conditions="filterConditions"
          @reset="onReset"
          @filterChange="onFilterChange"
          @sync="filterSync"
        ></ObjectFilter>
      </div>
      <s-table-search
        v-model:search="search"
        placeholder="请输入oid/对象名称查询"
        @sync="sync"
        @search="sync(true)"
      ></s-table-search>
    </div>
    <div class="g-mt-16">
      <List
        :list="list"
        :loading="loading"
        :pagination="pagination"
        :orderBy="orderBy"
        :orderRule="orderRule"
        :selectedRowKeys="selectedRowKeys"
        :filterConditions="filterConditions"
        :spmsToExpand="spmsToExpand"
        rowKey="refId"
        @changeTable="onChangeTable"
        @select="onTableSelect"
        @sync="sync"
      ></List>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ObjectAddDrawer from "./ObjectAddDrawer.vue";
import ObjectFilter from "./Filter.vue";
import List from "./List.vue";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import { getObjList } from "@/services/object.service";
import { generateExpandKeys } from "@/utils/common";
import { v4 as uuidv4 } from "uuid";

import { TablePagination } from "@/types/table.type";
import type { ObjTypeEnum } from "@/types/object.type";

export interface FilterDto {
  terminalIds: string;
  versionIds: number;
  tagIds: number[];
  objectType: ObjTypeEnum | "all";
}
var relObjMaps = {};

export default defineComponent({
  name: "object-manage",
  components: { ObjectFilter, List },
  mixins: [TableMixin],
  computed: {
    filterConditions(): FilterDto {
      return {
        terminalIds: this.terminalIds,
        versionIds: this.versionIds,
        tagIds: this.tagIds,
        objectType: this.objectType,
      };
    },
  },

  data() {
    const _orderBy: "createTime" | "updateTime" | "name" | "oid" | "type" =
      "createTime";
    const _orderRule: "descend" | "ascend" = "descend";
    const _versionIds: number | string = "";

    return {
      list: [],
      orderBy: _orderBy,
      orderRule: _orderRule,
      search: "",
      versionIds: _versionIds,
      terminalIds: "",
      requireIds: [],
      tagIds: [],
      objectType: "all",
      selectedRowKeys: [],
      selectRowIds: [],
      initTerminalIds: "",
      initVersionId: "",
      spmsToExpand: [],
    };
  },

  created() {
    const objectFilter = this.getQueryParams("objectFilter") || {};
    this.current = objectFilter.currentPage || this.current;
    this.pageSize = objectFilter.pageSize || this.pageSize;
    this.orderBy = objectFilter.orderBy || this.orderBy;
    this.orderRule = objectFilter.orderRule || this.orderRule;
    this.search = objectFilter.search || this.search;
    this.versionIds = objectFilter.terminalVersionId
      ? objectFilter.terminalVersionId
      : "";
    this.terminalIds = objectFilter.terminalId
      ? objectFilter.terminalId
      : this.terminalIds;
    this.tagIds = objectFilter.tagIds || this.tagIds;
    this.objectType = objectFilter.objectType || this.objectType;
  },

  methods: {
    filterSync(terminalId, versionId) {
      this.initTerminalIds = terminalId;
      this.initVersionId = versionId;
      this.terminalIds = terminalId;
      this.versionIds = versionId;
      this.sync();
    },
    // 循环tree结构拼装数据
    getTaskPropertyLoop({ roots = [], entities = [] }, gap, parentSpm = "") {
      return roots.map((v) => {
        const data = entities[v.objId];

        data && Object.assign(v, data);
        gap === 1 && (v.isRoot = true);

        v.gap = gap;
        v.refId = uuidv4();
        v.spmLink = [v.oid, ...parentSpm.split("|")].filter(Boolean).join("|");

        v.children = v?.children?.length
          ? this.getTaskPropertyLoop(
              { roots: v.children, entities },
              gap + 1,
              v.spmLink
            )
          : undefined;
        v.isReuse = !!relObjMaps[v.objId] || ((relObjMaps[v.objId] = v), false);
        v.isReuse && (relObjMaps[v.objId].isReuse = true);

        return v;
      });
    },
    sync(init = false, changed = true) {
      this.loading = true;

      init && (this.current = 1);

      const reqOptions = {
        orderBy: this.orderBy,
        orderRule: this.orderRule,
        search: this.search.trim(),
        releasedId: this.versionIds,
        tagIds: this.tagIds.length ? this.tagIds : null,
        type: this.objectType === "all" ? null : this.objectType,
      };

      if (!reqOptions.releasedId) {
        this.list = [];
        this.loading = false;
        return;
      }

      this.setQueryParams("objectFilter", JSON.stringify(reqOptions));

      getObjList(reqOptions)
        .then((res) => {
          relObjMaps = {};

          this.list = this.getTaskPropertyLoop(
            { roots: res.tree, entities: res.objInfoMap },
            1
          );

          // 默认都更新
          changed &&
            (this.spmsToExpand = generateExpandKeys(res?.spmsToExpand || []));
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },

    // 展开所有的对象
    expandAllObject(list = this.list) {
      if (!list.length) return;

      list.forEach((v) => {
        this.spmsToExpand.push(v.uuid);

        v?.children?.length && this.expandAllObject(v.children);
      });
    },

    onTableSelect(selectedRowKeys: number[], selectRowIds: number[]) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectRowIds = selectRowIds;
    },

    changeChildren(children, level) {
      return children.map((item) => ({
        ...item,
        uuid: uuidv4(),
        level,
        children: item?.children?.length
          ? this.changeChildren(item.children, level + 1)
          : null,
      }));
    },

    onAdd(withParent = false) {
      this.$createInstance(ObjectAddDrawer, {
        parentIds: withParent ? this.selectRowIds : [],
        onOk: () => {
          this.sync();
        },
      });
    },

    onReset() {
      const { terminalIds, versionIds, requireIds, tagIds, objectType } = this;

      if (
        terminalIds.length ||
        versionIds.length ||
        requireIds.length ||
        tagIds.length ||
        objectType !== "all"
      ) {
        this.terminalIds = this.initTerminalIds;
        this.versionIds = this.initVersionId;
        this.requireIds = [];
        this.tagIds = [];
        this.objectType = "all";
        this.sync();
      }
    },

    onFilterChange(key: string, v: any) {
      this[key] = v;

      key !== "terminalIds" && this.sync(true);
    },

    onChangeTable(pagination: TablePagination, filter, sorter) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;

      if (this.orderBy === sorter.columnKey) {
        this.orderRule = sorter.order || "ascend";
      } else {
        this.orderBy = sorter.columnKey;
        this.orderRule = "ascend";
      }

      this.sync();
    },
  },
});
</script>

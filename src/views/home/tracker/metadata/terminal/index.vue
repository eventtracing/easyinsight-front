<template>
  <div class="g-p-lr-24">
    <s-page-top>
      <h4>终端管理</h4>
    </s-page-top>
    <div class="g-mt-24">
      <List
        :list="list"
        :loading="loading"
        :pagination="pagination"
        :orderBy="orderBy"
        :orderRule="orderRule"
        @changeTable="onChangeTable"
        @sync="sync"
      ></List>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import List from "./List.vue";
import TerminalAddModal from "./TerminalAddModal.vue";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import { TablePagination } from "@/types/table.type";
import { TerminalSimpleDto, GetTerminalListReq } from "@/types/terminal.type";
import { getTerminalList } from "@/services/terminal.service";
export default defineComponent({
  name: "Terminal",
  components: { List },
  mixins: [TableMixin],

  data() {
    const _list: TerminalSimpleDto[] = [];
    const _orderBy = "createTime";
    const _orderRule: "descend" | "ascend" = "descend";
    const _search = "";

    return {
      list: _list,
      orderBy: _orderBy,
      orderRule: _orderRule,
      search: _search,
    };
  },

  created() {
    this.sync(true);
  },

  methods: {
    sync(init = false) {
      this.loading = true;

      init && (this.current = 1);

      const reqOptions: GetTerminalListReq = {
        currentPage: this.current,
        pageSize: this.pageSize,
        orderBy: this.orderBy,
        orderRule: this.orderRule,
        search: this.search.trim(),
      };

      getTerminalList(reqOptions)
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
    },

    onAdd() {
      this.$createInstance(TerminalAddModal, {
        onHandlerOk: () => {
          this.sync();
        },
      });
    },

    onChangeTable(pagination: TablePagination, filter, sorter) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;

      if (this.orderBy === sorter.field) {
        this.orderRule = sorter.order || "ascend";
      } else {
        this.orderBy = sorter.field;
        this.orderRule = "ascend";
      }

      this.sync();
    },
  },
});
</script>

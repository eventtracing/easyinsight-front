<template>
  <div class="g-p-lr-24">
    <s-page-top>
      <h4>规则管理</h4>
    </s-page-top>
    <a-button class="g-mt-10" type="primary" @click="handleAdd">新增</a-button>
    <div class="g-mt-10">
      <a-table
        tableLayout="auto"
        size="middle"
        :columns="columns"
        :dataSource="list"
        :rowKey="(record) => record.id"
        :pagination="false"
      >
        <template #operation="{ record }">
          <a @click="handleDel(record)">删除</a>
        </template></a-table
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  getVariableParamSelect,
  deleteRuleTemplate,
} from "@/services/parameter.service";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import AddRuleModal from "./components/add-rule-modal/index.vue";

export default defineComponent({
  name: "Rule",
  components: {},
  mixins: [TableMixin],
  data() {
    return { list: [] };
  },
  computed: {
    columns(): any[] {
      return [
        {
          key: "name",
          title: "规则名",
          dataIndex: "name",
        },
        {
          key: "rule",
          title: "表达式",
          dataIndex: "rule",
        },
        {
          key: "operation",
          title: "操作",
          width: 165,
          slots: {
            customRender: "operation",
          },
        },
      ];
    },
  },
  created() {
    this.sync();
  },
  methods: {
    sync() {
      getVariableParamSelect().then((res) => {
        this.list = res;
      });
    },
    handleDel(record) {
      this.$confirm({
        title: "确定要删除吗？",
        content: `规则名称：${record.name}`,
        onOk: () => {
          deleteRuleTemplate(record.id)
            .then(() => {
              this.$message.success("删除成功");
              this.sync();
            })
            .catch((e) => {
              this.$warning({
                title: e.message,
              });
            });
        },
      });
    },
    handleAdd() {
      this.$createInstance(AddRuleModal, {
        onHandlerOk: () => {
          this.sync();
        },
      });
    },
  },
});
</script>

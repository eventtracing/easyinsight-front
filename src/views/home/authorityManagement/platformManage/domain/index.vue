<template>
  <div class="fill plaform-domain-wrapper">
    <div class="header">
      <div>
        <a-button style="margin-right: 10px" type="primary" @click="showModal"
          >新建域</a-button
        >
      </div>
      <div>
        <a-input-search
          v-model:value="search"
          @search="fetchList({ currentPage: 1 })"
          style="width: 230px"
        ></a-input-search>
        <ReloadOutlined class="g-ml-8" @click="fetchList" />
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      rowKey="id"
      @change="onTableChange"
      :pagination="pagination"
    >
      <template #name="{ text, record }"
        ><span>
          <span class="text-link mr6" @click="viewDomain(record)">{{
            text
          }}</span>
        </span></template
      >
      <template #user="{ text }"
        ><span>
          <span>{{ text.userName }}</span>
        </span></template
      >
      <template #time="{ text }"
        ><span>
          {{ formatTime(text) }}
        </span></template
      >
      <template #action="{ record }"
        ><span>
          <span class="text-link mr6" @click="edit(record)">编辑</span>
          <a-popconfirm title="确认删除？" @confirm="deleteConfirm(record)">
            <span class="text-link mr6">删除</span>
          </a-popconfirm>
          <span class="text-link mr6" @click="viewDomain(record)"
            >访问该域</span
          >
        </span></template
      >
    </a-table>
    <domain-modal
      :visible="visible"
      :type="type"
      @handlerCancel="handleCancel"
      @handleOk="handleOk"
      :detail="detail"
    ></domain-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { getTimeStringFromTimestamp, TableMixin } from "@/ndsc-vue3/utils/lib";
import DomainModal from "../components/domain-modal/index.vue";
import {
  getDomainList,
  createDomain,
  deleteDomain,
  editDomain,
} from "@/services/auth.service";

export default defineComponent({
  name: "PlatformDomain",
  mixins: [TableMixin],
  components: {
    "domain-modal": DomainModal,
  },

  setup() {
    const _columns = reactive([
      {
        title: "域ID",
        dataIndex: "code",
        slots: {
          customRender: "name",
        },
      },
      {
        title: "域名称",
        dataIndex: "name",
      },
      {
        title: "域负责人账号",
        dataIndex: "owner",
        slots: {
          customRender: "user",
        },
      },
      {
        title: "创建人",
        dataIndex: "creator",
        slots: {
          customRender: "user",
        },
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        sorter: true,
        slots: {
          customRender: "time",
        },
      },
      {
        title: "操作",
        key: "action",
        slots: {
          customRender: "action",
        },
      },
    ]);

    return {
      columns: _columns,
    };
  },

  data() {
    const _visible = false;
    const _type = "add";
    const _detail = {
      id: "",
    };
    const _list = [];
    return {
      visible: _visible,
      type: _type,
      detail: _detail,
      list: _list,
      search: "",
    };
  },

  created() {
    this.fetchList();
  },

  methods: {
    fetchList(searchData = {}) {
      this.loading = true;
      const { current, pageSize } = this.pagination;
      const data = {
        currentPage: current,
        pageSize,
        orderBy: "",
        orderRule: "",
        search: this.search,
        ...searchData,
      };
      getDomainList(data)
        .then((res) => {
          const { list = [], totalNum } = res;
          this.list = list;
          this.pagination.total = totalNum;
          this.pagination.current = data.currentPage;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onTableChange(pagination, filters, sorter) {
      const { order = "", field = "" } = sorter;
      const { current } = pagination;
      this.pagination.current = current;
      this.fetchList({
        orderBy: field,
        orderRule: order,
      });
    },

    showModal() {
      this.visible = true;
      this.type = "add";
      this.detail = {
        id: "",
      };
    },

    edit(record) {
      this.visible = true;
      this.type = "edit";
      this.detail = record;
    },

    viewDomain(record) {
      const { protocol, host } = window.location;
      const hostList = host.split(".");
      hostList.splice(0, 1, record.code);
      window.open(`${protocol}//${hostList.join(".")}`);
    },

    handleCancel() {
      this.visible = false;
    },

    async handleOk(values) {
      const { email, ...others } = values;
      const api = this.type === "add" ? createDomain : editDomain;
      const res = await api({
        owner: {
          email,
        },
        description: "",
        id: this.detail.id || "",
        ...others,
      });

      if (res) {
        this.$message.success("保存成功");
        this.visible = false;
        this.fetchList();
      }
    },

    formatTime(num: number) {
      return getTimeStringFromTimestamp(num);
    },

    async deleteConfirm(record) {
      const res = await deleteDomain(record.id);

      if (res) {
        this.$message.success("删除成功");
        this.fetchList();
      }
    },
  },
});
</script>

<style scoped="true" lang="less">
.plaform-domain-wrapper {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .anticon {
      cursor: pointer;
    }
  }
  .mr6 {
    margin-right: 6px;
  }
}
</style>

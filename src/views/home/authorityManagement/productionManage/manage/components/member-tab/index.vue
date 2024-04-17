<template>
  <div class="fill member-tab-wrapper">
    <div class="header">
      <div>
        <a-button style="margin-right: 10px" type="primary" @click="showModal"
          >添加成员</a-button
        >
        <a-button :disabled="!selectedRowKeys.length" @click="handleRemove"
          >移除成员</a-button
        >
      </div>
      <div>
        <a-input-search
          style="width: 230px"
          @search="onSearch"
          v-model="search"
          placeholder="请输入成员/邮箱账号搜索"
        ></a-input-search>
        <SyncOutlined @click="fetchMemberList" style="margin-left: 10px" />
      </div>
    </div>
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="list"
      rowKey="userId"
      @change="handleChange"
      :pagination="{ current: currentPage, total: total }"
    ></a-table>
    <member-modal
      :visible="visible"
      @handlerCancel="handleCancel"
      @handleOk="handleOk"
    ></member-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import MemberModal from "../member-modal/index.vue";
import {
  getAuthUserList,
  createAuthUser,
  removeAuthUser,
} from "@/services/auth.service";
import { TableMixin } from "@/ndsc-vue3/utils/lib";

export default defineComponent({
  name: "MemeberTab",
  components: {
    "member-modal": MemberModal,
  },
  mixins: [TableMixin],
  setup() {
    const _columns = reactive([
      {
        title: "成员",
        dataIndex: "userName",
      },
      {
        title: "账号",
        dataIndex: "email",
      },
    ]);

    const appId = localStorage.getItem("appId");

    appId === "4" &&
      _columns.splice(2, 0, {
        title: "云音乐ID",
        dataIndex: "musicUserId",
      });

    return {
      columns: _columns,
    };
  },

  props: {
    roleId: {
      type: Number,
      default: () => 0,
    },
  },

  data() {
    const _location = localStorage.getItem("appId");

    const _list = [];
    const _currentPage = 1;
    const _selectedRowKeys = [];
    const _visible = false;
    const _search = "";
    const _total = 0;
    return {
      location: _location,
      list: _list,
      currentPage: _currentPage,
      selectedRowKeys: _selectedRowKeys,
      visible: _visible,
      search: _search,
      total: _total,
    };
  },

  methods: {
    fetchMemberList() {
      getAuthUserList({
        roleId: this.roleId,
        range: 2,
        location: this.location,
        currentPage: this.current,
        pageSize: this.pageSize,
        search: this.search,
      }).then((res) => {
        this.list = res.list || [];
        this.total = res.totalNum;
      });
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    showModal() {
      this.visible = true;
    },

    handleCancel() {
      this.visible = false;
    },

    handleOk(values) {
      createAuthUser({
        roleIds: [this.roleId],
        users: values,
        range: 2,
        location: this.location,
      }).then(() => {
        this.$message.success("添加成功");
        this.visible = false;
        this.fetchMemberList();
      });
    },

    handleRemove() {
      removeAuthUser({
        userIds: this.selectedRowKeys,
        roleId: this.roleId,
        range: 2,
        location: this.location,
      }).then(() => {
        this.$message.success("移除成功");
        this.fetchMemberList();
        this.selectedRowKeys = [];
      });
    },

    onSearch(value) {
      this.search = value;
      this.currentPage = 1;
      this.fetchMemberList();
    },

    handleChange(pagination) {
      this.currentPage = pagination.current;
      this.fetchMemberList();
    },

    fetchList(roleId, oldRoleId) {
      this.selectedRowKeys = [];

      if (roleId !== oldRoleId) {
        this.fetchMemberList();
      }
    },
  },
  watch: {
    roleId: {
      handler: "fetchList",
      immediate: true,
      deep: true,
    },
  },
});
</script>

<style scoped="true" lang="less">
.member-tab-wrapper {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .anticon {
      font-size: 17px;
      cursor: pointer;
      margin-right: 10px;
    }
  }
}
</style>

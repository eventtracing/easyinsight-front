<template>
  <div class="production-memeber-wrapper">
    <u-left-right>
      <div class="flex">
        <a-button type="primary" @click="handleAddMember">添加成员</a-button>
        <a-popconfirm
          :disabled="!selectedRowKeys.length"
          title="确定移除吗？"
          @confirm="removeMember"
        >
          <template #icon>
            <QuestionCircleOutlined style="color: red" />
          </template>
          <a-button class="g-ml-4" :disabled="!selectedRowKeys.length"
            >移除成员</a-button
          >
        </a-popconfirm>
      </div>
      <template #right="">
        <a-input-search
          style="width: 230px"
          v-model="search"
          @search="onSearch"
          placeholder="请输入成员/邮箱账号搜索"
        ></a-input-search>
        <SyncOutlined @click="fetchList" style="margin-left: 6px" />
      </template>
    </u-left-right>
    <a-divider></a-divider>
    <a-table
      ref="memberRef"
      :columns="columns"
      :data-source="data"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      rowKey="userId"
      :pagination="pagination"
      @change="handleChange"
    >
      <template #action="{ record }"
        ><span>
          <span
            class="text-link"
            style="margin-right: 6px"
            @click="editMember(record)"
            >编辑</span
          >
          <a-popconfirm
            title="确定移除吗？"
            @confirm="removeItemMember(record)"
          >
            <template #icon>
              <QuestionCircleOutlined style="color: red" />
            </template>
            <a class="g-ml-4">移除</a>
          </a-popconfirm>
        </span></template
      >
      <template #time="{ text }"
        ><span>
          {{ formatTime(text) }}
        </span></template
      >
      <template #role="{ text }"
        ><span>
          {{ text ? text.map((item) => item.roleName).join(", ") : "" }}
        </span></template
      >
    </a-table>
    <OptionMember
      v-model:visible="visible"
      :member="member"
      :status="status"
      :appId="appId"
      @onOk="onOk"
      :roleList="roleList"
    ></OptionMember>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import moment from "moment";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import OptionMember from "./OptionMember.vue";
import { TableColumn } from "@/types/table.type";
import {
  getAuthUserList,
  getAuthRoleList,
  updateAuthUser,
  createAuthUser,
  removeAuthUser,
} from "@/services/auth.service";
export default defineComponent({
  name: "ProductionManageMember",
  components: {
    OptionMember,
  },
  mixins: [TableMixin],

  setup() {
    const _columns = reactive<TableColumn[]>([
      {
        title: "成员",
        dataIndex: "userName",
        key: "userName",
      },
      {
        title: "邮箱账号",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "角色",
        dataIndex: "roles",
        key: "roles",
        slots: {
          customRender: "role",
        },
      },
      {
        title: "添加时间",
        dataIndex: "createTime",
        key: "createTime",
        slots: {
          customRender: "time",
        },
      },
      {
        title: "最近修改时间",
        dataIndex: "updateTime",
        key: "updateTime",
        slots: { customRender: "time" },
      },
      {
        title: "操作",
        key: "action",
        slots: {
          customRender: "action",
        },
      },
    ]);

    const appId = localStorage.getItem("appId");

    appId === "4" &&
      _columns.splice(2, 0, {
        title: "云音乐ID",
        dataIndex: "musicUserId",
        key: "musicUserId",
      });

    return {
      columns: _columns,
    };
  },

  computed: {
    memberRef() {
      const memberRef: typeof HTMLTableElement = this.$refs.memberRef;
      return memberRef;
    },
  },

  data() {
    const _data = [];
    const _roleList = [];
    const _member: any = {};
    const _visible = false;
    const _status = "add";
    const _search = "";
    const _currentPage = 1;
    const _total = 1;
    const _selectedRowKeys: any[] = [];
    const _appId = "";

    return {
      data: _data,
      roleList: _roleList,
      member: _member,
      visible: _visible,
      status: _status,
      search: _search,
      currentPage: _currentPage,
      total: _total,
      selectedRowKeys: _selectedRowKeys,
      appId: _appId,
    };
  },

  created() {
    this.fetchList();
    this.fetchRoleList();
  },

  methods: {
    fetchList() {
      const appId = localStorage.getItem("appId");
      getAuthUserList({
        range: 2,
        location: appId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        search: this.search,
      }).then((res) => {
        this.data = res.list || [];
        this.total = res.totalNum;
      });
    },

    fetchRoleList() {
      const appId = localStorage.getItem("appId");

      getAuthRoleList({ range: 2, location: appId }).then((res) => {
        this.roleList = res;
      });
    },

    formatTime(input: string) {
      return moment(input).format("YYYY-MM-DD HH:mm:ss");
    },

    handleAddMember() {
      this.visible = true;
      this.status = "add";
      this.member = {};
      this.appId = localStorage.getItem("appId");
    },

    // 编辑成员
    editMember(record) {
      this.status = "edit";
      this.visible = true;
      this.member = record;
      this.appId = localStorage.getItem("appId");
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    // 删除成员
    removeMember() {
      const appId = localStorage.getItem("appId");

      removeAuthUser({
        userIds: this.selectedRowKeys,
        range: 2,
        location: appId,
      }).then(() => {
        this.$message.success("移除成功");
        this.fetchList();
        this.selectedRowKeys = [];
      });
    },

    // 移除单个成员
    removeItemMember(record) {
      const appId = localStorage.getItem("appId");
      removeAuthUser({
        userIds: [record.userId],
        range: 2,
        location: appId,
      }).then(() => {
        this.$message.success("移除成功");
        this.fetchList();
        this.selectedRowKeys = [];
      });
    },

    // 清空选择项
    clearSelect() {
      this.$nextTick(() => {
        // @ts-ignore
        this.memberRef.rowSelection.selectedRowKeys = [];
        this.selectedRowKeys = [];
      });
    },

    onOk(values) {
      const appId = localStorage.getItem("appId");
      const api = this.status === "add" ? createAuthUser : updateAuthUser;
      const { createTime, ...others } = this.member;
      const { users, ...restValues } = values;

      api({
        ...others,
        ...restValues,
        users: users.split("\n").map((item) => ({ email: item })),
        range: 2,
        location: appId,
      }).then(() => {
        this.$message.success("保存成功");
        this.fetchList();
        this.visible = false;
      });
    },

    handleChange(pagination) {
      this.currentPage = pagination.current;
      this.pageSize = pagination.pageSize;
      this.fetchList();
    },

    onSearch(value) {
      this.search = value;
      this.currentPage = 1;
      this.fetchList();
    },
  },
});
</script>

<style scoped="true" lang="less">
.production-memeber-wrapper {
  margin: 12px;
}
.ant-divider {
  margin-top: 8px;
}
</style>

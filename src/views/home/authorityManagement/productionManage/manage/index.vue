<template>
  <div class="fill flex production-manage-wrapper">
    <div class="left fill">
      <div class="flex role-title">
        <span class="text">角色列表</span>
        <a-tooltip placement="bottom">
          <template #title>
            <span>新建角色</span>
          </template>
          <PlusSquareOutlined @click="addRole" />
        </a-tooltip>
      </div>
      <a-divider style="margin: 0"></a-divider>
      <div style="margin: 10px">
        <a-input-search
          placeholder="请输入角色名称"
          @search="onSearch"
        ></a-input-search>
      </div>
      <a-divider style="margin: 0"></a-divider>
      <div
        v-for="item in searchRoleList"
        :key="item.id"
        class="role-item flex"
        :class="{ current: activeItem.id === item.id }"
        @click.stop="handleRoleClick(item)"
      >
        <span>
          {{ item.roleName }}
        </span>
        <span v-if="!item.builtin">
          <EditOutlined @click.stop="editRole(item)" />
          <a-popconfirm title="确认删除？" @confirm="confirm(item)">
            <DeleteOutlined @click.stop="" />
          </a-popconfirm>
        </span>
      </div>
    </div>
    <role-panel
      :detail="activeItem"
      @fetchRoleList="fetchRoleList"
    ></role-panel>
    <role-modal
      :visible="roleModalVisible"
      :type="roleType"
      @handlerCancel="handleRoleModalCancel"
      @handleRoleModalOk="handleRoleModalOk"
      :detail="editItem"
    ></role-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RolePanel from "./components/role-panel/index.vue";
import RoleModal from "./components/role-modal/index.vue";
import {
  getAuthRoleList,
  createAuthRole,
  updateAuthRole,
  deleteAuthRole,
} from "@/services/auth.service";
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  name: "ProductionManageManage",
  components: {
    "role-panel": RolePanel,
    "role-modal": RoleModal,
    PlusSquareOutlined,
    EditOutlined,
    DeleteOutlined,
  },
  computed: {
    searchRoleList() {
      if (this.search) {
        return this.roleList.filter((item) =>
          item.roleName.includes(this.search)
        );
      }

      return this.roleList;
    },
  },

  data() {
    const _roleList = [];
    const _roleModalVisible = false;
    const _roleType = "add";
    const _activeItem = {
      id: 5,
    };
    const _editItem = {};

    const _location = localStorage.getItem("appId");

    const _search = "";
    return {
      roleList: _roleList,
      roleModalVisible: _roleModalVisible,
      roleType: _roleType,
      activeItem: _activeItem,
      editItem: _editItem,
      location: _location,
      search: _search,
    };
  },

  created() {
    this.fetchRoleList();
  },

  methods: {
    onSearch(value) {
      this.search = value;
    },

    async fetchRoleList() {
      const res = await getAuthRoleList({
        range: 2,
        location: this.location,
      });

      this.roleList = res;
    },

    handleRoleClick(item) {
      this.activeItem = item;
    },

    addRole() {
      this.roleModalVisible = true;
      this.roleType = "add";
      this.editItem = {};
    },

    editRole(item) {
      this.roleModalVisible = true;
      this.roleType = "edit";
      this.editItem = item;
    },

    handleRoleModalCancel() {
      this.roleModalVisible = false;
    },

    handleRoleModalOk(values) {
      const api = this.roleType === "add" ? createAuthRole : updateAuthRole;
      const data = { ...this.editItem, ...values };

      if (this.roleType === "add") {
        data.priority = 5;
        data.appId = this.location;
      }

      api(data).then(() => {
        this.$message.success("保存成功");
        this.fetchRoleList();
        this.roleModalVisible = false;
      });
    },

    async confirm(item) {
      await deleteAuthRole({ id: item.id });
      this.$message.success("删除成功");
      await this.fetchRoleList();
      this.activeItem = this.searchRoleList[0];
    },
  },
});
</script>

<style scoped="true" lang="less">
.production-manage-wrapper {
  .anticon {
    cursor: pointer;
  }
}
.production-manage-wrapper.fill {
  padding: 0;
}
.left {
  width: 260px;
  border-right: 1px solid @border-color-split;
  padding: 10px 0;
  overflow-y: auto;
  overflow-x: hidden;

  .role-title {
    padding: 10px;
    padding-bottom: 20px;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    color: #000000;
    .anticon {
      color: #103ffa;
      cursor: pointer;
    }
  }

  .role-item {
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    padding: 15px 10px;
    border-bottom: 1px solid #e8e8f0;
    position: relative;

    &.current {
      background-color: #f5f8fe;
      .anticon {
        color: #103ffa;
      }
    }

    &.current:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 2px;
      background: #103ffa;
    }
  }

  .anticon {
    margin-left: 5px;
  }
}
.right {
  padding: 10px;
  overflow-y: auto;
}
</style>

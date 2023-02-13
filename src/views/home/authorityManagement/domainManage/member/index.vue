<template>
  <div class="g-domain__member">
    <u-left-right>
      <div class="flex">
        <a-button type="primary" @click=";(visible = true), (status = 'add')" v-auth="1040"
          >新增成员</a-button
        >
        <a-popconfirm
          :disabled="!selectItems.length"
          title="确定删除吗？"
          @confirm="removeMember()"
          v-auth="1041"
        >
          <template #icon>
            <QuestionCircleOutlined style="color: red" />
          </template>
          <a-button class="g-ml-4" :disabled="!selectItems.length">删除成员</a-button>
        </a-popconfirm>
      </div>
      <template #right="">
        <s-table-search
          v-model:search="search"
          :width="250"
          placeholder="请输入成员/邮箱账号搜索"
          @search=";[(current = 1), getMemberLists()]"
        ></s-table-search>
      </template>
    </u-left-right>
    <a-divider></a-divider>
    <RowSelectionTable
      ref="memberRef"
      rowKey="userId"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :data="memberData"
      @changeRowKeys="changeRowKeys"
      @change="getMemberLists"
    >
      <template #action="{ record }">
        <div
          class="flex"
          v-if="
            Array.isArray(record.roles) && record.roles.length ? record.roles[0].id !== 2 : true
          "
        >
          <span class="text-link g-mr-4" @click="editMember(record)" v-auth="1042">编辑</span>
          <a-popconfirm title="确定删除用户吗?" @confirm="removeMember(record.userId)">
            <span class="text-link" v-auth="1041">删除</span>
          </a-popconfirm>
        </div>
      </template>
      <template
        #roles="{
          record: {
            text: { roles }
          }
        }"
      >
        <div>
          {{ roles && roles.length ? roles[0].roleName : '' }}
        </div>
      </template>
    </RowSelectionTable>
    <OptionMember
      @getMemberLists="getMemberLists"
      v-model:visible="visible"
      :member="member"
      :status="status"
    ></OptionMember>
    <a-modal title="编辑成员" :visible="showID" @ok="editRole" @cancel="showID = false">
      <a-form autocomplete="off" :model="member" :rules="rules">
        <a-form-item label="成员" v-bind="formItemLayout">
          {{ member.userName }}
        </a-form-item>
        <a-form-item label="邮箱账号" v-bind="formItemLayout">
          {{ member.email }}
        </a-form-item>
        <a-form-item :colon="false" label="身份:" required v-bind="formItemLayout" name="roleIds">
          <a-select
            style="width: 100%"
            placeholder="请选择身份信息"
            v-model:value="member.formRoleId"
            @change="(e) => (member.roleIds = [e])"
          >
            <a-select-option v-for="r in roleLists" :key="r.id" :value="r.id">{{
              r.roleName
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import OptionMember from './OptionMember.vue'
import { TableMixin } from '@/ndsc-vue3/utils/lib'
import { TableColumn } from '@/types/table.type'
import { getUserLists, getRoleLists, removeUser, editUser } from '@/services/authority.service'
import { UserDto, RoleDto } from '@/types/authority.type'
export default defineComponent({
  name: 'DomainManageMember',
  components: {
    OptionMember
  },
  mixins: [TableMixin],

  setup() {
    const _columns = reactive<TableColumn[]>([
      {
        title: '成员',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '邮箱账号',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '所属产品',
        dataIndex: 'apps',
        key: 'apps',
        customRender({ text: apps = [] }) {
          return apps.join(', ')
        }
      },
      {
        title: '身份',
        key: 'roles',
        width: 300,
        slots: {
          customRender: 'roles'
        }
      },
      {
        title: '操作',
        width: 150,
        key: 'action',
        slots: {
          customRender: 'action'
        }
      }
    ])

    return {
      columns: _columns,
      formItemLayout: {
        labelCol: {
          span: 4
        },
        wrapperCol: {
          span: 18
        }
      }
    }
  },

  computed: {
    memberRef() {
      const memberRef: typeof HTMLTableElement = this.$refs.memberRef
      return memberRef
    }
  },

  data() {
    const _memberData: UserDto[] = []
    const _member: Partial<UserDto> = {}
    const _visible = false
    const _status = 'add'
    const _search = ''
    const _selectItems: any[] = []
    const _roleLists: RoleDto[] = [] // 获取成员列表

    // 获取成员列表
    return {
      memberData: _memberData,
      member: _member,
      visible: _visible,
      status: _status,
      search: _search,
      selectItems: _selectItems,
      roleLists: _roleLists,
      showID: false,
      rules: {
        roleIds: [
          {
            required: true,
            message: '请选择身份信息~'
          }
        ]
      }
    }
  },

  mounted() {
    this.getMemberLists()
    this.getRoleLists()
  },

  methods: {
    // 获取成员列表
    getMemberLists({ current = this.current, pageSize = this.pageSize } = {}) {
      this.loading = true
      getUserLists({
        currentPage: current,
        pageSize,
        range: 1,
        search: this.search,
        location: this.$store.state.domainId
      }).then((result) => {
        this.memberData = result.list
        this.current = result.pageNum
        this.pageSize = pageSize
        this.total = result.totalNum
        this.loading = false
      })
    },

    // 编辑成员
    editMember(record) {
      this.status = 'edit'
      this.member = record
      this.member.formRoleId = record.roles.length ? record.roles[0].id : null
      this.showID = true
    },

    // 获取勾选项
    changeRowKeys(data) {
      this.selectItems = data
    },

    // 删除成员
    removeMember(id) {
      removeUser({
        userIds: this.selectItems.length ? this.selectItems : [id]
      }).then(() => {
        this.$message.success('删除成功')
        this.clearSelect()
        this.getMemberLists()
      })
    },

    // 更新角色
    editRole() {
      editUser({ ...this.member, roles: undefined }).then(() => {
        this.showID = false
        this.$message.success('修改身份成功～')
        this.getMemberLists()
      })
    },

    // 清空选择项
    clearSelect() {
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.memberRef.rowSelection.selectedRowKeys = []
        this.selectItems = []
      })
    },

    getRoleLists() {
      getRoleLists({
        range: 1,
        location: localStorage.appId
      }).then((roleLists) => {
        this.roleLists = roleLists.filter((role) => role.id !== 2)
      })
    }
  }
})
</script>

<style scoped="true" lang="less">
.g-domain__member .ant-divider {
  margin-top: 8px;
}
</style>

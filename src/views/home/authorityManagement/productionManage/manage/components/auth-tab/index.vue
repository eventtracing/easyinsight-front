<template>
  <div class="fill auth-tab-wrapper">
    <div style="margin-bottom: 15px">
      <a-radio-group button-style="solid" v-model:value="type">
        <a-radio-button v-for="item in menus" :value="item.id" :key="item.id">
          {{ item.menuName }}
        </a-radio-button>
      </a-radio-group>
    </div>

    <div>
      <a-tree
        :disabled="!editable"
        v-model:checkedKeys="checkedKeys"
        checkable=""
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="menuList"
        @expand="onExpand"
        @check="onCheck"
      ></a-tree>
    </div>

    <div style="margin-top: 20px">
      <a-button type="primary" @click="handleEdit" v-if="!builtin && !editable">编辑</a-button>
      <a-button @click="handleCancel" v-if="editable" style="margin-right: 10px">取消</a-button>
      <a-button type="primary" @click="save" v-if="editable">保存</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAuthMenuList, assignAuthRole } from '@/services/auth.service'
import { transformTreeData, getTreeNodeList } from './utils'
export default defineComponent({
  name: 'AuthTab',

  setup() {
    const _appId = localStorage.getItem('appId')

    const _domainId = localStorage.getItem('domainId')

    return {
      appId: _appId,
      domainId: _domainId
    }
  },

  props: {
    roleId: {
      type: Number,
      default: () => 0
    },
    builtin: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    menuList() {
      return this.menus.find((item) => item.id === this.type)?.children
    }
  },

  data() {
    const _type = ''
    const _menus = []
    const _checkedKeys = []
    const _checkedKeysMap = {}
    const _autoExpandParent = true
    const _expandedKeys = []
    const _editable = false
    return {
      type: _type,
      menus: _menus,
      checkedKeys: _checkedKeys,
      checkedKeysMap: _checkedKeysMap,
      autoExpandParent: _autoExpandParent,
      expandedKeys: _expandedKeys,
      editable: _editable
    }
  },

  methods: {
    fetchMenuList() {
      getAuthMenuList({
        roleId: this.roleId
      }).then((res) => {
        transformTreeData(res)
        res.forEach((item) => {
          const nodeList = []
          getTreeNodeList(item.children, nodeList)
          this.checkedKeysMap[item.id] = nodeList
        })
        this.menus = res
        this.type = res?.[0]?.id || ''
        this.checkedKeys = this.checkedKeysMap[this.type]
        this.expandedKeys = this.checkedKeysMap[this.type]
        this.autoExpandParent = true
      })
    },

    save() {
      const ids = Object.keys(this.checkedKeysMap).reduce(
        (prev, cur) => prev.concat(this.checkedKeysMap[cur]),
        []
      )

      if (!ids.length) {
        this.$message.warning('请选择权限')
        return
      }

      assignAuthRole({
        roleId: this.roleId,
        functions: ids.map((id) => ({
          functionName: '',
          functionId: id
        }))
      }).then(() => {
        this.$message.success('保存成功')
        this.$emit('fetchRoleList')
        this.editable = false
      })
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    onCheck(checkedKeys) {
      this.checkedKeysMap[this.type] = checkedKeys
    },

    handleEdit() {
      this.editable = true
    },

    handleCancel() {
      this.editable = false
    },

    fetchList(roleId, oldRoleId) {
      this.editable = false
      if (roleId !== oldRoleId) {
        this.fetchMenuList()
      }
    },

    change(type, oldType) {
      if (type !== oldType) {
        this.checkedKeys = this.checkedKeysMap[type]
        this.expandedKeys = this.checkedKeysMap[type]
      }
    }
  },
  watch: {
    roleId: {
      handler: 'fetchList',
      immediate: true,
      deep: true
    },
    type: {
      handler: 'change',
      immediate: true,
      deep: true
    }
  }
})
</script>

<style scoped="true" lang="less">
.auth-tab-wrapper {
  position: relative;
}
</style>

<template>
  <a-select
    :style="`min-width: 120px; ${defaultStyle}`"
    :allowClear="allowClear"
    option-label-prop="label"
    :mode="modes"
    :value="value"
    :placeholder="placeholder"
    showSearch=""
    :filterOption="false"
    @change="onChange"
    @search="onSearch"
    @dropdownVisibleChange="onDropdownVisibleChange"
  >
    <a-select-option
      v-for="t in list"
      :key="t.email"
      :value="t.email"
      :label="t.userName"
      :title="`${t.userName} - ${t.email}`"
      >{{ `${t.userName} - ${t.email}` }}</a-select-option
    >
  </a-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAllUsers } from '@/services/app.service'
import { User } from '@/types/common.type'
import { debounce } from 'lodash'
export default defineComponent({
  name: 's-user-select',
  inheritAttrs: false,
  props: {
    defaultStyle: {
      default: ''
    },
    modes: {
      default: null
    },
    value: {
      type: [String, Array]
    },
    hackOptions: {
      type: Array
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择，支持搜索'
    }
  },

  data() {
    const _userList: User[] = []
    const _list: User[] = []
    const _pageSize = 50
    const _search = ''

    const _searchFunc = () => {}

    return {
      userList: _userList,
      list: _list,
      pageSize: _pageSize,
      search: _search,
      searchFunc: _searchFunc
    }
  },

  created() {
    this.searchFunc = debounce(() => {
      this.$_getPagingList()
    }, 200)
    this.initData()
  },

  methods: {
    async initData() {
      // hacker
      if (this.hackOptions) {
        this.list = this.list.concat(this.hackOptions)
      }

      this.userList = await getAllUsers()
      if (this.$attrs.onGetUserLists) {
        this.$emit('getUserLists', this.userList)
      }
      this.$nextTick(() => {
        this.$_getPagingList()
      })
    },

    $_getPagingList() {
      this.list = this.userList
        .filter((u) => `${u.userName} - ${u.email}`.includes(this.search))
        .slice(0, this.pageSize)
    },

    onSearch(v: string) {
      this.search = v
      this.searchFunc()
    },

    onChange(v: string | string[], o) {
      const user = Array.isArray(o)
        ? o.map((item) => {
            return {
              userName: item.label,
              email: item.value
            }
          })
        : o
        ? {
            userName: o.label,
            email: v
          }
        : null
      this.$emit('change', v, user)
      this.$emit('update:value', Array.isArray(user) ? user.map((u) => u.email) : user.email)
    },

    onDropdownVisibleChange(v) {
      if (!v) {
        this.$nextTick(() => {
          this.onSearch('')
        })
      }
    }
  }
})
</script>

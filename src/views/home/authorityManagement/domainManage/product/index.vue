<template>
  <div class="g-domain__member">
    <u-left-right>
      <a-button type="primary" @click=";(visible = true), (status = 'add')" v-auth="1061"
        >新增产品</a-button
      >
      <template #right="">
        <s-table-search
          v-model:search="search"
          :width="250"
          placeholder="请输入产品名称搜索"
          @search=";[(current = 1), searchLists]"
        ></s-table-search>
      </template>
    </u-left-right>
    <a-divider></a-divider>
    <a-table
      bordered
      rowKey="id"
      :loading="loading"
      :pagination="pagination"
      :columns="columns"
      :data-source="productData"
      @change="searchLists"
    >
      <template #action="{ record }">
        <div class="flex">
          <span class="text-link g-mr-4" @click="editMember(record)" v-auth="1062">编辑</span>
          <a-popconfirm title="确定删除吗？" @confirm="removeApp(record.id)">
            <span class="text-link" v-auth="1063">删除</span>
          </a-popconfirm>
        </div>
      </template>
      <template #admins="{ record: { admins } }">
        <div class="g-mr-4 g-mb-4" v-for="admin in admins" :key="admin.id">
          {{ admin.userName }}({{ admin.email }})
        </div>
      </template>
      <template #creator="{ record: { creator } }">
        {{ creator.userName }}({{ creator.email }})
      </template>
    </a-table>
    <option-product
      v-model:visible="visible"
      :product="product"
      :status="status"
      @searchLists="searchLists"
      @close="product = {}"
    ></option-product>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { defineComponent, reactive } from 'vue'
import { TableColumn } from '@/types/table.type'
import OptionProduct from './OptionPruduct.vue'
import { appList, removeApp } from '@/services/authority.service'
import { TableMixin } from '@/ndsc-vue3/utils/lib'
export default defineComponent({
  name: 'DomainManageProduct',
  components: {
    OptionProduct
  },
  mixins: [TableMixin],

  setup() {
    const _columns = reactive<TableColumn[]>([
      {
        title: '产品ID',
        dataIndex: 'id',
        key: 'id',
        width: 80
      },
      {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
        width: 100
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description'
      },
      {
        title: '管理员',
        key: 'admins',
        width: 380,
        slots: {
          customRender: 'admins'
        }
      },
      {
        title: '创建人',
        key: 'creator',
        slots: {
          customRender: 'creator'
        }
      },
      {
        title: '创建时间',
        key: 'createTime',
        customRender: ({ text: record }) => {
          return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '操作',
        width: 100,
        key: 'action',
        slots: {
          customRender: 'action'
        }
      }
    ])

    return {
      columns: _columns
    }
  },

  data() {
    const _productData: any[] = []
    const _visible = false
    const _search = ''
    const _status = ''
    const _product = {}
    return {
      productData: _productData,
      visible: _visible,
      search: _search,
      status: _status,
      product: _product
    }
  },

  mounted() {
    this.searchLists()
  },

  methods: {
    // 获取成员列表
    searchLists({ current = this.current, pageSize = this.pageSize } = {}) {
      this.loading = true
      appList({
        currentPage: current,
        pageSize,
        search: this.search
      }).then((res) => {
        this.productData = res.list
        this.total = res.totalNum
        this.current = res.pageNum
        this.pageSize = pageSize
        this.loading = false
      })
    },

    // 编辑成员
    editMember(product) {
      this.product = product
      this.status = 'edit'
      this.visible = true
    },

    // 删除成员
    removeApp(id) {
      removeApp(id).then(() => {
        this.$message.success('删除成功~')
        this.searchLists()
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

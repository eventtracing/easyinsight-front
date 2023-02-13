<template>
  <a-table
    class="m-rowselection__table"
    :rowKey="rowKey"
    :columns="columns"
    :data-source="data"
    v-bind="tableParams"
    v-on="$attrs"
  >
    <template #expandedRowRender="record" v-if="showExpandRowRender">
      <slot v-bind="record" :row="record"></slot>
    </template>
    <template #action="record">
      <slot name="action" v-bind="record"></slot>
    </template>
    <template #roles="record">
      <slot name="roles" :roles="record.roles" :record="record"></slot>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RowSelectionTable',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    checkProps: {
      type: Function
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    selectParam: {
      type: String,
      default: ''
    },
    showExpandRowRender: {
      type: Boolean,
      default: false
    },
    checkType: {
      type: String,
      default: 'checkbox'
    },
    singleCheck: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tableParams() {
      return {
        rowSelection: this.rowSelection,
        ...this.$attrs
      }
    }
  },

  data() {
    // 配置选中的数据
    const selectedRowKeys = []
    const checkProps = this.checkProps
    const _rowSelection = {
      type: this.checkType,
      getCheckboxProps(record) {
        // @ts-ignore
        return checkProps ? checkProps(record) : null
      },
      ...(this.singleCheck && { columnTitle: ' ' }),
      selectedRowKeys,
      onSelect: (record, selected) => {
        const param = this.rowKey
        if (selected) {
          if (this.singleCheck) {
            // @ts-ignore
            _rowSelection.selectedRowKeys.length = 0
            // @ts-ignore
            _rowSelection.selectedRowKeys.push(record[param])
          } else {
            // @ts-ignore
            _rowSelection.selectedRowKeys.push(record[param])
          }
        } else {
          // @ts-ignore
          const index = _rowSelection.selectedRowKeys.indexOf(record[param])

          if (~index) {
            _rowSelection.selectedRowKeys.splice(index, 1)
          }
        }
        this.$emit('expand', selected, record)
        this.changeRowKeys(
          this.selectParam
            ? selectedRowKeys.map((v) => v.split(this.selectParam)[0])
            : selectedRowKeys
        )
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        const param = this.rowKey

        if (selected) {
          // @ts-ignore
          _rowSelection.selectedRowKeys.push(
            ...selectedRows
              // @ts-ignore
              .filter((v) => !_rowSelection.selectedRowKeys.includes(v[param]))
              .map((v) => {
                this.$emit('expand', selected, v)
                // @ts-ignore
                return v[param]
              })
          )
        } else {
          changeRows.forEach((row) => {
            this.$emit('expand', selected, row)
            // @ts-ignore
            const index = _rowSelection.selectedRowKeys.indexOf(row[param])
            if (~index) {
              _rowSelection.selectedRowKeys.splice(index, 1)
            }
          })
        }

        this.changeRowKeys(
          this.selectParam
            ? selectedRowKeys.map((v) => v.split(this.selectParam)[0])
            : selectedRowKeys
        )
      }
    }
    return {
      rowSelection: _rowSelection
    }
  },

  methods: {
    changeRowKeys(value) {
      if (this.$attrs.onChangeRowKeys) {
        this.$emit('changeRowKeys', value)
      }
      this.$forceUpdate()
    }
  }
})
</script>

<style scoped="true" lang="less">
.m-rowselection__table {
  width: 100%;
  :deep(.ant-table-expanded-row) {
    background: #fff;
  }
}
</style>

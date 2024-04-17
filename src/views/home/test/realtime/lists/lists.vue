<template>
  <RowSelectionTable
    :columns="columns"
    :data="dataSource"
    :loading="loadings"
    :pagination="pagination"
    singleCheck=""
    @change="getLists"
    @changeRowKeys="changeRowKeys"
    :scroll="{ x: 1000 }"
    ref="demandRef"
  >
  </RowSelectionTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { reqStatusOptions } from '@/types/requirement.type'

interface ColumnDTO {
  key: string | number
  title: string
  dataIndex?: string
  customRender?: (row) => string | HTMLElement
}

const relObjMaps = {}
const reqTypeMap = new Map([
  ['UNCHANGE', { text: '无变更' }],
  ['NEW', { text: '对象新建' }],
  ['LINEAGE_CHANGE', { text: '血缘变更' }],
  ['PARAMS_CHANGE', { text: '参数变更' }]
])

export default defineComponent({
  name: 'RealTimeListsTable',
  props: {
    pagination: {
      type: Object,
      default: () => ({})
    },
    conditions: {},
    dataSource: {
      type: Array,
      default: () => []
    },
    loadings: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    columns(): Array<ColumnDTO> {
      return [
        {
          key: 'reqPoolId',
          dataIndex: 'reqPoolId',
          title: '需求组ID'
        },
        {
          key: 'reqIssueKey',
          dataIndex: 'reqIssueKey',
          title: '需求ID'
        },
        {
          key: 'reqName',
          dataIndex: 'reqName',
          title: '需求名称'
        },
        {
          key: 'taskName',
          dataIndex: 'taskName',
          title: '任务名称'
        },
        {
          key: 'terminalVersion',
          dataIndex: 'terminalVersion',
          title: '端解决版本'
        },
        {
          key: 'status',
          dataIndex: 'status',
          title: '任务状态',

          customRender({ text: status }) {
            const findStatus = reqStatusOptions.find((key) => key.key === status)
            return findStatus?.value || ''
          }
        },
        {
          key: 'owner',
          dataIndex: 'owner',
          title: '负责人'
        },
        {
          key: 'verifier',
          dataIndex: 'verifier',
          title: '验证人'
        },
        {
          key: 'sprint',
          dataIndex: 'sprint',
          title: '迭代'
        }
      ]
    },

    childColumns(): Array<ColumnDTO> {
      return [
        {
          key: 'name',
          dataIndex: 'name',
          title: '对象名称'
        },
        {
          key: 'oid',
          dataIndex: 'oid',
          title: 'oid'
        },
        {
          key: 'objType',
          dataIndex: 'objType',
          title: '对象类型',

          customRender: ({ text: objType }) => {
            const objectType = this.$store.state.objectType || []

            return objectType.find((v) => v.key.toUpperCase() === objType)?.value
          }
        },
        {
          key: 'reqType',
          dataIndex: 'reqType',
          title: '需求类型',

          customRender({ text: reqType }) {
            const { text } = reqTypeMap.get(reqType) || {}
            return text
          }
        },
        {
          key: 'status',
          dataIndex: 'status',
          title: '状态',

          customRender({ text: status }) {
            const findStatus = reqStatusOptions.find((key) => key.key === status) || {
              value: ''
            }
            return findStatus.value || ''
          }
        },
        {
          key: 'owner',
          dataIndex: 'owner.userName',
          title: '负责人'
        },
        {
          key: 'verifier',
          dataIndex: 'verifier.userName',
          title: '验证人'
        },
        {
          key: 'checkHistorySum',
          dataIndex: 'checkHistorySum',
          title: '测试记录'
        }
      ]
    },

    demandRef() {
      const demandRef: any = this.$refs.demandRef
      return demandRef
    }
  },

  data() {
    const _trackIds: Array<string | number> = [] // 将需求id转换为关联对象的id

    // 将需求id转换为关联对象的id
    const // 将需求id转换为关联对象的id
      _index = 0
    const _expandKeys: string[] = [] // 扩展key值集合

    // 扩展key值集合
    return {
      trackIds: _trackIds,
      index: _index,
      expandKeys: _expandKeys
    }
  },

  methods: {
    getLists(...rest) {
      this.$emit('getLists', ...rest)
    },

    changeTrackerIds() {
      const id = this.trackIds[0]
      const selected = this.dataSource.find((item) => item.id === id)

      this.$emit('changeTrackerIds', id, selected?.reqPoolId, selected?.reqName)
    },

    getDataSource(row) {
      const {
        record: { relObjLists: data = [], flatrelObjLists = [] }
      } = row
      if (!row.record.displayType) row.record.displayType = 'tree'

      if (row.record.displayType === 'tree') {
        return data
      } else {
        return flatrelObjLists
      }
    },

    changeDisplay(row) {
      row.record.displayType = row.record.displayType === 'list' ? 'tree' : 'list'
      this.$forceUpdate()
    },

    getDedpuList(data) {
      return data.reduce((prev, next) => {
        if (next.childs?.length) {
          prev.push(...this.getDedpuList(next.children))
        }

        if (next.id) {
          prev.push({ ...next, children: undefined })
        }

        return prev
      }, [])
    },

    getDedpuTreeData(data, gap = 1, parent) {
      if (data.childs && data.childs.length) {
        return (data.childs || []).map((v) => {
          const baseParent = parent.slice(0)
          const refId = (v.id || '').toString() + '-' + this.index++ + '-' + v.objId
          baseParent.push(refId)
          const children = this.getDedpuTreeData(v, gap + 1, baseParent)
          const tree = {
            ...v,
            children: children || (v.id && v.canExpandSubTree ? [] : undefined),
            gap,
            name: v.oid + `(${v.objName})`,
            parent: baseParent,
            refId
          }
          tree.isReuse = !!relObjMaps[v.objId] || ((relObjMaps[v.objId] = tree), false)

          if (tree.isReuse) {
            relObjMaps[v.objId].isReuse = true
          }

          return tree
        })
      }

      return null
    },

    optionExpandKeys(expand, record) {
      if (expand) {
        if (record.children && record.children.length) {
          this.expandKeys.push(record.refId)
        }
      } else {
        const index = this.expandKeys.indexOf(record.refId)

        if (~index) {
          this.expandKeys.splice(index, 1)
        }
      }
    },

    setRecursionExpandKeyds(expand, record) {
      this.optionExpandKeys(expand, record)
      const children = record.children || []
      children.forEach((node) => {
        if (node.children && node.children.length) {
          this.setRecursionExpandKeyds(expand, node)
        }
      })
    },
    // 勾选对应的行号，并且将所有被勾选的需求转换成关联对象的trackerid
    changeRowKeys(value) {
      this.trackIds = value
      this.changeTrackerIds()
    }
  }
})
</script>

<style scoped="true">
.g-span-8 {
  flex: none;
  margin-right: 10px;
}
</style>

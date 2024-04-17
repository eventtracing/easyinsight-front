<template>
  <a-table
    size="small"
    :columns="treeColumns"
    :data-source="treeList"
    :expanded-row-keys="expandedRowKeys"
    :pagination="false"
    :customRow="customRow"
    rowKey="spm"
    :rowClassName="!showFail ? rowClassName : failClassName"
    @expand="expand"
  >
    <template #oid="{ text, record }">
      <a-tooltip :overlayStyle="{ maxWidth: '1000px' }">
        <template #title>
          <div v-if="showFail">
            {{ `${record.spm}${record.objName ? `(${record.objName})` : ""}` }}
          </div>
          <div v-else>
            {{ `${text}${record.objName ? `(${record.objName})` : ""}` }}
          </div>
        </template>
        <div
          v-if="showFail"
          v-ellipsis-title
          style="width: 600px; overflow: hidden"
        >
          {{ record.spm }}
          {{ record.objName ? `(${record.objName})` : "" }}
        </div>
        <div
          v-else
          class="c-text"
          v-ellipsis-title
          :style="`float: left; width: calc(100% - 25px - ${
            record.gap * 20
          }px);`"
        >
          {{ text }}
          {{ record.objName ? `(${record.objName})` : "" }}
        </div>
      </a-tooltip>
    </template>
    <template #details="{ text, record }"
      ><span>
        <div
          v-for="item in text"
          :key="item.eventCode"
          class="tree-item"
          :class="
            selectEventCode === `${record.oid}${item.eventCode}`
              ? 'selected'
              : ''
          "
          @click.stop="handleClick(item, record)"
        >
          <span>{{ item.eventCode || "" }}:</span>
          <span>{{ item.num || 0 }}/</span>
          <span style="color: green">{{ item.passSum || 0 }}/</span>
          <span style="color: red">{{ item.failSum || 0 }}/</span>
          <span style="color: #103ffa">{{ item.hitSum || 0 }}/</span>
          <span style="color: #103ffa">{{ item.reqSum || 0 }}</span>
        </div>
      </span></template
    >
    <template #type="{ text }"
      ><span>
        <span>
          {{ typeMap[text] || "" }}
        </span>
      </span></template
    >
  </a-table>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "tree-table",

  setup() {
    const _typeMap = reactive({
      1: "对象新建",
      2: "参数变更",
    });

    return {
      typeMap: _typeMap,
    };
  },

  props: {
    treeColumns: {
      type: Array,
      default: () => [],
    },
    treeList: {
      type: Array,
      default: () => [],
    },
    currentTreeRecord: {
      type: Object,
      default: () => ({}),
    },
    showFail: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const _expandedRowKeys = [];
    return {
      expandedRowKeys: _expandedRowKeys,
      init: true,
      selectEventCode: "",
    };
  },

  methods: {
    rowClassName(record) {
      let extraClass = "";
      if (this.init) extraClass = " c-table__init";
      if (record.isRoot) return "row-root" + extraClass;
      return record.gap % 2 === 0
        ? "row-gray" + extraClass
        : "row-white" + extraClass;
    },
    failClassName(record) {
      return "fail-row";
    },
    customRow(record) {
      return {
        style: {
          "background-color":
            record.spm === this.currentTreeRecord.spm ? "#f3f7ff" : "#ffffff",
        },
        onClick: () => {
          this.init = false;
          this.selectEventCode = "";
          this.$emit("updateCurrentTreeRecord", record);
        },
      };
    },

    handleClick(item, record) {
      this.selectEventCode = `${record.oid}${item.eventCode}`;
      this.$emit("updateCurrentTreeRecord", {
        ...record,
        eventCode: item.eventCode,
      });
    },

    handleExpandKeys(record, result) {
      if (record.children && record.children.length) {
        result.push(record.spm);
        record.children.forEach((item) => {
          this.handleExpandKeys(item, result);
        });
      }
    },

    expand(expand, record) {
      requestAnimationFrame(() => {
        const result = [];
        this.handleExpandKeys(record, result);

        if (expand) {
          this.expandedRowKeys = [...this.expandedRowKeys, ...result];
        } else {
          const omitList = [];
          this.expandedRowKeys.forEach((key) => {
            if (!result.includes(key)) {
              omitList.push(key);
            }
          });
          this.expandedRowKeys = omitList;
        }
      });
    },
  },
});
</script>

<style lang="less" scoped="true">
.update-banner {
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f5bb4e;
  background-color: #fef7e8;
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 15px;

  .anticon {
    margin-right: 10px;
    color: #f4b141;
  }

  .num {
    color: #103ffa;
    margin: 5px;
  }

  .tip {
    color: red;
    font-size: 14px;
  }
}
:deep(.ant-table-row.row-white) {
  background: #fff !important;
}
:deep(.ant-table-row.fail-row) {
  td:first-child {
    background: white !important;
  }
}
:deep(.ant-table-row.row-gray) {
  background: #f6f7fa !important;
}
:deep(.ant-table-row.row-root) {
  background: #dee2e6 !important;
}
:deep(.ant-table .ant-table-row-indent + .ant-table-row-expand-icon) {
  float: left;
  margin-top: 4px;
}
// :deep(.ant-table-tbody tr td){
//   background: white !important;
// }
:deep(.ant-table-row-indent) {
  float: left;
  height: 20px;
}
.c-table__init {
  &.ant-table-row[style="background-color: rgb(243, 247, 255);"] {
    .c-text {
      color: #79809a;
    }
  }
}

.ant-table-row[style="background-color: rgb(243, 247, 255);"] {
  .c-text {
    color: #103ffa;
  }
}

.tree-item {
  margin-right: 5px;
  padding: 3px;
  padding-left: 5px;

  &:hover {
    cursor: pointer;
  }

  &.selected {
    background-color: #6ac2f4;
  }
}
</style>

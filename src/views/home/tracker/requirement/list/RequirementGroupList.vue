<template lang="pug">
a-table(:loading="loading" :columns="columns" :data-source="list" rowKey="id" @change="change" :rowClassName="rowClassName")
  template(#expandedRowRender="{ record }")
    slot(:requirements="record.requirements || []" :reqPoolId="record.id")
  template(#action="{ record }")
    router-link.text-link.g-mr-8(:to="`/tracker/requirement/design/${record.id}`") 埋点设计
    u-text-button(:on-click="() => $emit('onAddReq', record.id)") 添加需求
    a-dropdown
      u-text-button 更多
      template(#overlay)
        a-menu
          a-menu-item(@click="$emit('optionGroup', record.id)") 编辑
          a-menu-item(@click="removeGroup(record.id)") 删除
</template>

<script lang="ts" setup>
import { markRaw } from "vue";
import moment from "moment";
import { removeRequirementGroup } from "@/services/requirement.service";
import { message, Modal } from "ant-design-vue";

const emit = defineEmits<{
  (e: "sync", ...rest: any[]): void;
  (e: "changeCondition", order: "desc" | "asc"): void;
  (e: "onAddReq", id: number);
  (e: "optionGroup", id: number);
}>();
// 定义数据
const { list, loading } = defineProps<{ list: any[]; loading: boolean }>();

// 列配置
const columns = markRaw([
  {
    title: "需求组ID",
    key: "id",
    dataIndex: "id",
  },
  {
    title: "需求组名称",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "对象数/任务数/事件数",
    key: "count",
    dataIndex: "count",
    customRender({ record }) {
      const { objCount = 0, taskCount = 0, eventCount = 0 } = record;
      return `${objCount}/${taskCount}/${eventCount}`;
    },
  },
  {
    title: "指派状态",
    key: "assign",
    dataIndex: "assign",
    customRender({ record }) {
      const { totalAssignCount = 0, assignedCount = 0 } = record;
      return `${assignedCount}/${totalAssignCount}`;
    },
  },
  {
    title: "数据负责人",
    key: "dataOwners",
    dataIndex: "dataOwners",
  },
  {
    title: "创建人",
    key: "creatorName",
    dataIndex: "creatorName",
  },
  {
    title: "创建时间",
    key: "createTime",
    dataIndex: "createTime",
    sorter: "descend",
    sortDirections: ["descend", "ascend"],
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 200,
    slots: {
      customRender: "action",
    },
  },
]);

// 删除需求组
function removeGroup(id: number) {
  const instance = Modal.confirm({
    title: "是否真的删除?",
    onOk() {
      removeRequirementGroup(id).then(() => {
        message.success("删除成功~");
        emit("sync");
        instance.destroy();
      });
    },
  });
}

function change() {
  const sorter = arguments[2];
  if (sorter.order === "descend" || !sorter.order) {
    emit("changeCondition", "desc");
  } else {
    emit("changeCondition", "asc");
  }
}

function rowClassName(record) {
  return record.mergeConflict ? "row-red" : "";
}
</script>

<style scoped lang="less">
:deep(.ant-table-row.row-red) {
  background: #fbe9eb !important;
}
</style>

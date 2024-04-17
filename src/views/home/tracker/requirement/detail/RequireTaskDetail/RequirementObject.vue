<template>
  <a-table
    :columns="columns"
    :data-source="list"
    :loading="loading"
    :rowClassName="rowClassName"
    rowKey="objId"
    size="small"
    @change="tableChange"
  >
    <template #action="{ record }"
      ><span v-if="record.editable">
        <span
          class="text-link mr6"
          :class="{ 'm-text--disabled': hasNoEditAuth }"
          @click="handleDiff(record)"
          v-if="record.mergeConflict"
          >处理冲突</span
        >
        <span
          class="text-link mr6"
          :class="{ 'm-text--disabled': hasNoEditAuth }"
          @click="edit(record)"
          v-else
          >编辑</span
        >
        <a-popconfirm
          title="确定删除吗?"
          @confirm="remove(record)"
          :disabled="hasNoEditAuth"
        >
          <span
            class="text-link g-ml-8"
            :class="{ 'm-text--disabled': hasNoEditAuth }"
            >删除</span
          >
        </a-popconfirm>
      </span></template
    >
  </a-table>
</template>

<script lang="tsx" setup>
import {
  markRaw,
  shallowReactive,
  getCurrentInstance,
  defineAsyncComponent,
  onMounted,
  ref,
} from "vue";
import { useStore } from "vuex";
import { createInstance } from "@/ndsc-vue3/utils/lib";
import { useRoute } from "vue-router";
import {
  getRequirementObject,
  deleteObject,
} from "@/services/requirement.design.service";
import { TaskRelObjectTypeEnum } from "@/types/requirement.type";
import { message } from "ant-design-vue";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import moment from "moment";

const objectOperatorType = markRaw({
  1: "新增终端",
  2: "变更",
  5: "复用开发",
});

const textExplain =
  "埋点结构上跟着父对象被复用；端依据View组件是否复用自行判断是否需要新开发；需求需关注，测试需通过";
const emit = defineEmits<{ (e: "sync") }>();
const props = defineProps<{
  reqPoolId: string | number;
  hasNoEditAuth: boolean;
  searchStr: any;
}>();
const store = useStore();
const objectType = store.state.objectType;
const router: any = useRoute();
const columns = markRaw<Record<string, unknown>[]>([
  {
    title: "序号",
    key: "order",
    customRender({ index }) {
      return index + 1;
    },
  },
  {
    title: "对象oid(名称)",
    key: "oid",
    dataIndex: "oid",
    sorter: "descend",
    sortDirections: ["descend", "ascend"],
    customRender({ record }) {
      return (
        <div class="flex-ac" style="display: inline-flex">
          <span class="text-link" onClick={() => onView(record)}>
            {record.oid}({record.objName})
          </span>
        </div>
      );
    },
  },
  {
    title: "对象类型",
    key: "objType",
    dataIndex: "objType",
    sorter: "descend",
    sortDirections: ["descend", "ascend"],
    customRender: ({ text: type }: { text: TaskRelObjectTypeEnum }) => {
      let text = "";
      const newObjType = objectType.map((item, index) => ({
        key: index + 1,
        value: item.value,
      }));
      for (const { key, value } of newObjType) {
        if (key === type) {
          text = value;
        }
      }
      return <span>{text}</span>;
    },
  },
  {
    title: "终端",
    key: "terminals",
    dataIndex: "terminals",
  },
  {
    title: "是否上传了图片",
    key: "hasPicture",
    dataIndex: "hasPicture",
    customRender({ text }) {
      return text ? "是" : "否";
    },
  },
  {
    title: "操作类型",
    key: "operatorType",
    dataIndex: "operatorType",
    customCell: (record) => {
      const color = record.operatorType === 5 ? "#fadb14" : "";
      return {
        style: {
          color,
        },
      };
    },
    customRender: ({ text: operatorType }) => {
      if (operatorType === 5) {
        return (
          <div>
            <span>{objectOperatorType[operatorType]}</span>
            <a-tooltip title={textExplain} placement="top">
              <QuestionCircleOutlined style="margin-left: 4px; color: #666" />
            </a-tooltip>
          </div>
        );
      } else {
        return <div>{objectOperatorType[operatorType]}</div>;
      }
    },
  },
  {
    title: "添加到池子时间",
    key: "createTime",
    dataIndex: "createTime",
    sorter: "descend",
    sortDirections: ["descend", "ascend"],
    customRender({ text: createTime }) {
      return moment(createTime).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "最后更新时间",
    key: "updateTime",
    sorter: "descend",
    sortDirections: ["descend", "ascend"],
    dataIndex: "updateTime",
    customRender({ text: updateTime }) {
      return moment(updateTime).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "操作",
    key: "action",
    slots: {
      customRender: "action",
    },
  },
]);

const list = shallowReactive<Record<string, unknown>[]>([]);
const loading = ref<boolean>(false);
const instance = getCurrentInstance();

function getRequirementData(options = {}) {
  loading.value = true;

  getRequirementObject({ reqPoolId: router.params.id, ...options }).then(
    (res) => {
      list.length = 0;
      list.push(...res);
      loading.value = false;
    }
  );
}

watch(
  () => props.searchStr,
  (count, prevCount) => {
    getRequirementData({ searchStr: count });
  }
);

onMounted(() => {
  getRequirementData();
});

function edit(record) {
  const component = defineAsyncComponent(
    () => import("@/views/home/tracker/object/list/ObjectEditDrawer.vue")
  );

  const modalInstance = createInstance(component, {
    parentContext: { _: instance },
    id: record.objId,
    reqPoolId: props.reqPoolId,
    historyId: record.historyId || null,
    trackerId: record.trackerId,
    record,
    from: "requirementPool",
    // 变更、复用开发都支持
    operatorChangeType: [2, 5].includes(record.operatorType),
    isPreview: false,
    onHandlerOk() {
      getRequirementData();
      emit("sync");
      modalInstance.destroy();
    },
  });
}

function handleDiff(record) {
  const component = defineAsyncComponent(
    () => import("@/views/home/tracker/object/list/ObjectEditDiffDrawer.vue")
  );

  const modalInstance = createInstance(component, {
    parentContext: { _: instance },
    id: record.objId,
    reqPoolId: props.reqPoolId,
    historyId: record.historyId || null,
    trackerId: record.trackerId,
    record,
    from: "requirementPool",
    // 变更、复用开发都支持
    operatorChangeType: [2, 5].includes(record.operatorType),
    isPreview: false,
    onHandlerOk() {
      getRequirementData();
      emit("sync");
      modalInstance.destroy();
    },
  });
}

function remove(record) {
  deleteObject(record.objId, props.reqPoolId).then(() => {
    message.success("删除成功~");
    getRequirementData();
    emit("sync");
  });
}

// 对象详情
function onView(record) {
  const compopnent = defineAsyncComponent(
    () => import("@/views/home/tracker/object/list/ObjectEditDrawer.vue")
  );

  const modalInstance = createInstance(compopnent, {
    parentContext: { _: instance },
    id: record.objId,
    reqPoolId: props.reqPoolId,
    historyId: record.historyId || null,
    trackerId: record.trackerId,
    record,
    from: "requirementPool",
    // 变更、复用开发都支持
    operatorChangeType: [2, 5].includes(record.operatorType),
    isPreview: true,
    isDiff: true,
    spm: record.spmByObjId,
    onHandlerOk() {
      getRequirementData();
      emit("sync");
      modalInstance.destroy();
    },
  });
}
// 点击排序
function tableChange(_, __, orderOption) {
  const { field, order } = orderOption;
  const rule = order === "ascend";

  getRequirementData({
    rule,
    order: field,
    searchStr: props.searchStr,
  });
}

defineExpose({ getRequirementData });

function rowClassName(record) {
  return record.mergeConflict ? "red" : "";
}
</script>

<style scoped lang="less">
:deep(.ant-table-row.red) {
  background: #fbe9eb !important;
}
</style>

<template>
  <div>
    <div class="flex-ac g-mb-16">
      <a-button @click="cancelAssign" :disabled="!hasSelect">取消指派</a-button>
      <OptionButton
        @refresh="refresh"
        :disabled="!hasSelect"
        :selectTask="selectTask.concat(selectObject).concat(selectEvent)"
      />
    </div>
    <TaskList
      :list="list"
      :loading="loading"
      @objectRowSelect="objectRowSelect"
      :selectedRowKeys="selectedRowKeys"
      :selectedObjectRowKeys="selectedObjectRowKeys"
      :hasNoEditAuth="hasNoEditAuth"
      requirementDetail
      @select="changeRowKeys"
      @seteventrowkeys="setEventRowKeys"
      @refreshTask="refresh"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  markRaw,
  computed,
  shallowReactive,
  reactive,
  ref,
  onMounted,
} from "vue";
import TaskList from "../../list/TaskList.vue";
import OptionButton from "../../components/OptionButton.vue";
import {
  getReqTasksFull,
  cancelTaskOrigin,
  cancelObjOrigin,
} from "@/services/requirement.design.service";
import { message } from "ant-design-vue";

var relObjMaps = markRaw({});
const props = defineProps<{
  reqPoolId: string;
  hasEditAuthManage: boolean;
}>();
const loading = ref<boolean>(false);
const list = reactive([]);
const selectedRowKeys = shallowReactive([]);
const selectedObjectRowKeys = shallowReactive([]);
const selectedObjectItems = shallowReactive([]);
const selectedEventRowKeys = shallowReactive([]);
const hasNoEditAuth = computed(() => {
  return !props.hasEditAuthManage;
});
const hasSelect = computed(
  () =>
    selectedRowKeys.length ||
    selectedObjectRowKeys.length ||
    selectedEventRowKeys.length
);
const selectTask = computed<unknown[]>(() =>
  list.filter((v) => selectedRowKeys.some((key) => key === v.id))
);
const selectObject = computed<any[]>(() => {
  return selectedObjectRowKeys.map((v) => ({ id: v.split("-")[0] }));
});

const selectObjectItemsForCancel = computed(() => {
  return selectedObjectItems.map((ele) => ({
    spmByObjId: ele.spmByObjId,
    reqPoolId: +props.reqPoolId,
    taskId: ele.taskId,
  }));
});

const selectEvent = computed<unknown[]>(() =>
  selectedEventRowKeys.map((ele) => ({ id: ele }))
);

function changeRowKeys(keys) {
  selectedRowKeys.length = 0;
  selectedRowKeys.push(...keys);
}

function objectRowSelect(selectedRowKeys, selectObjects) {
  selectedObjectItems.length = 0;
  selectedObjectItems.push(...selectObjects);
}

function setEventRowKeys(eventKeys) {
  selectedEventRowKeys.length = 0;
  selectedEventRowKeys.push(...eventKeys);
}

function cancelAssign() {
  const objArr = selectObjectItemsForCancel.value;
  const cancel1 = cancelTaskOrigin(
    selectedRowKeys
      .concat(selectObject.value.map((v) => v.id))
      .concat(selectedEventRowKeys)
  );

  const cancel2 = cancelObjOrigin(objArr);

  Promise.all([cancel1, cancel2])
    .then(() => {
      message.success("取消成功~");
      selectedRowKeys.length = 0;
      getData();
    })
    .catch((err) => {
      message.error(err);
    });
}

function getTaskPropertyLoop(
  { roots = [], entities = [], objInfos = [] },
  gap,
  parentSpm = ""
) {
  return roots.map((v, index) => {
    const data = entities.find((ent) => v.spmByObjId === ent.spmByObjId);
    const objectInfo = objInfos.find((ent) => v.objId === ent.objId);

    data && Object.assign(v, data);
    objectInfo && Object.assign(v, objectInfo);

    v.gap = gap;
    v.refId = v.id + "-" + index + "-" + gap;
    v.spmLink = [v.oid, ...parentSpm.split("|")].filter(Boolean).join("|");
    gap === 1 && (v.isRoot = true);

    v.children =
      v.children && !!v.children.length
        ? getTaskPropertyLoop(
            { roots: v.children, entities, objInfos },
            gap + 1,
            v.spmLink
          )
        : undefined;

    v.isReuse = !!relObjMaps[v.objId] || ((relObjMaps[v.objId] = v), false);
    v.isReuse && (relObjMaps[v.objId].isReuse = true);

    return v;
  });
}

function getData(task?) {
  loading.value = true;

  getReqTasksFull(props.reqPoolId).then((res) => {
    res.forEach((item) => {
      const { taskProcess = {} } = item;
      const deleteSpmTree = taskProcess.deleteSpmTree || {};
      const devSpmTree = taskProcess.devSpmTree || {};
      const events = taskProcess.events || [];

      item.devSpmList = getTaskPropertyLoop(devSpmTree, 1);
      item.deleteSpmList = getTaskPropertyLoop(deleteSpmTree, 1);
      item.eventsList = events;
    });

    list.length = 0;
    list.push(...res);

    loading.value = false;
  });
}

onMounted(() => {
  getData();
});

function refresh() {
  getData();
}
</script>

<style scoped>
.c-label {
  width: 80px;
}
</style>

<template lang="pug">
.g-p-lr-24.g-mt-8
  .flex-ac.flex-jbt
    .c-title
      b.title 埋点设计
        a-tooltip(placement="rightBottom")
          template(#title)
            | 对象池是指通过“新建/变更对象”生成的待开发对象血缘树和待下线对象血缘树，待开发对象血缘树包括对象新建、私参变更、血缘新增、事件及其公参变更和全局公参变更五种需求类型，待下线对象血缘树为血缘删除的需求类型。
            | <br/> 事件埋点池是指通过“新建事件埋点”生成的埋点需求，事件埋点是指不挂对象，以事件本身作为埋点的一类埋点。对象池与事件埋点池中生成的埋点记录均需通过“指派任务”来关联任务进行后续开发、测试与上线流转。
          InfoCircleOutlined.g-ml-4
      span.sub-title.g-ml-12 需求组ID: {{ route.params.id }}
      span.sub-title.g-ml-12 需求组名称: {{ detail.name }}
      span.g-ml-12(v-if="!hasEditAuthManage")&attributes({ style: { color: 'red' } }) 当前处于不可编辑状态
    .flex-ac.sub-title
      a-input(placeholder="输入oid/名称/spm搜索, 输入*oid或*名称只模糊匹配对象", @keydown.enter="onKeyDown", style="width: 380px")
  UDividerDash.g-mb-8
  a-tabs(:animate="false", type="card", v-model:activeKey="activeKey" @change="handleTabChange")
    - var tabPane = [...new Array(3).keys()].map((v) => v.toString());
      each item in tabPane
        a-tab-pane(key=`${item}`)
          case item
            when '0'
              template(#tab)
                a-tooltip 对象池
                  span(v-html="spmStat")
                  template(#title) a/b/c：a、b、c分别表示SPM需求总数、未指派SPM数和未上线SPM数。
              RequriementObjectPool(
                ref="objectPoolRef",
                :searchStr="searchStr",
                @changeSyncAllTerminal="changeSyncAllTerminal",
                :hasEditAuthManage="hasEditAuthManage",
                @selectObject="selectObject",
                @selectOutObject="selectOutObject",
                @cancelAssign="cancelAssign",
                @optionModal="optionsModal"
              )
            when '1'
              template(#tab)
                a-tooltip 事件埋点池0
                  span(v-html="eventStat")
                  template(#title) a/b/c：a、b、c分别表示事件埋点需求总数、未指派事件埋点数和未上线事件埋点数。
              RequirementEventPool(
                ref="eventRef",
                @cancelAssignEvent="cancelAssignEvent",
                :hasEditAuthManage="hasEditAuthManage",
                :reqPoolId="route.params.id",
                @selectEventsTable="selectEventsTable",
                @optionModal="optionsModal"
              )
            when '2'
              template(#tab)
                a-tooltip 任务列表 ( {{ stat.tasks }} )
                  template(#title) 数字表示该需求组所有指派的任务数量，若指派了多个需求，则为每个需求指派任务数量总和。
              TaskPool(
                :reqPoolId="route.params.id",
                :hasEditAuthManage="hasEditAuthManage"
              )
  a-modal(
    :width="currentComponent.width || '60vw'",
    :title="currentComponent.title",
    :visible="showRelativeTask",
    @cancel="optionsModal(false)",
    @ok="currentComponent.onOk"
  )
    a-form(:model="formState")
      component(
        :showRelativeTask="showRelativeTask",
        :isEdit="isEdit",
        :activeKey="activeKey",
        :syncAllTerminal="syncAllTerminal",
        :reqPoolId="route.params.id",
        :selectEvents="selectEvents",
        :selectOutLineObjects="selectOutLineObjects",
        :selectObjects="selectPendingObjects",
        :formState="formState",
        :is="currentComponent.component"
      )
</template>

<script setup lang="ts">
import {
  shallowReactive,
  ref,
  computed,
  defineAsyncComponent,
  onMounted,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import RequriementObjectPool from "./RequriementObjectPool.vue";
import RequirementEventPool from "./RequirementEventPool.vue";
import TaskPool from "./TaskPool.vue";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { getRequirementGroupDetail } from "@/services/requirement.service";
import {
  getRequirementStat,
  setTaskOrigin,
  hasEditAuth,
  cancelOrigin,
} from "@/services/requirement.design.service";
import type { StatDto } from "@/types/requirement.design.type";
import { message } from "ant-design-vue";
import { createEventTracker } from "@/services/event.service";

type ActiveType = "event" | "global" | "task";

const hasEditAuthManage = ref<boolean>(true);
const eventRef = ref();
const searchStr = ref("");
const route = useRoute();
const router = useRouter();
const activeKey = ref<string>("0");
const formState = reactive<{ [propName: string]: unknown }>({});
const showRelativeTask = ref<boolean>(false);
const active = ref<ActiveType>("event");
const isEdit = ref<boolean>(false);
const syncAllTerminal = ref<boolean>(false); // 是否多端操作
const detail = ref<Record<"name" | "desc", string>>({
  name: "",
  desc: "",
});

const dynamicComponent = {
  event: {
    title: `${isEdit.value ? "编辑" : "新增"}事件埋点`,
    component: defineAsyncComponent(
      () => import("./components/EventTracker.vue")
    ),
    onOk() {
      createEventTracker({
        reqPoolId: route.params.id,
        eventId: formState.eventId,
        eventParamPackageId: formState.version,
        terminalId: formState.terminalId,
        pubParamPackageId: formState.pubParamPackageId,
      }).then(() => {
        message.success("新增成功~");
        optionsModal(false);
        eventRef.value.getEventLists();
      });
    },
  },
  task: {
    title: `指派任务`,
    width: "40vw",
    component: defineAsyncComponent(
      () => import("./components/ReassignTasks.vue")
    ),
    onOk() {
      const reqPoolId = route.params.id;
      const list = selectPendingObjects.concat(selectOutLineObjects);
      const unOperaList = list
        .filter((ele) => ele.status > 2)
        ?.map((item) => item.oid);
      const unOperaName = unOperaList.join("/");
      const operaList = list.filter(
        (ele) => ele.status <= 2 || ele.status === undefined
      ); // 1 2 和未指派可以操作，未指派没有status字段
      setTaskOrigin({
        assignEntities: activeKey.value === "0" ? operaList : selectEvents,
        taskIds: Object.values(formState) as number[],
        syncAllTerminal:
          activeKey.value === "0" ? syncAllTerminal.value : false,
        reqPoolId,
      }).then(() => {
        message.success("指派成功~");
        if (unOperaList.length > 0) {
          message.warning(`其中${unOperaName}任务无法指派，需要回退任务状态`);
        }
        optionsModal(false);
        const { path, query } = route;
        router.push({
          path,
          query: {
            ...query,
            tab: activeKey.value,
            time: +new Date(), // 页面强制更新
          },
        });
      });
    },
  },
};

// 当前选择的弹窗内容
const currentComponent = computed(() => {
  return dynamicComponent[active.value] || dynamicComponent.event;
});

function optionsModal(show: boolean, type?: ActiveType) {
  if (type) {
    if (type === "task") {
      if (
        activeKey.value === "0" &&
        !selectPendingObjects.length &&
        !selectOutLineObjects.length
      ) {
        return message.error("请选择SPM~");
      }
      if (activeKey.value === "1" && !selectEvents.length) {
        return message.error("请选择事件~");
      }
    }
    active.value = type;
  }
  showRelativeTask.value = show;
  if (!show) {
    for (const key in formState) {
      formState[key] = undefined;
    }
  }
}

const stat = shallowReactive<Partial<StatDto>>({
  allSpms: 0,
  unAssignedSpms: 0,
  assignedSpms: 0,
  allEvents: 0,
  assignedEvents: 0,
  unAssignedEvents: 0,
  tasks: 0,
});
const spmStat = computed({
  get() {
    return `( ${stat.allSpms || 0} / <span class="color-orange">${
      stat.unAssignedSpms || 0
    }</span> / <span class="color-red">${stat.assignedSpms || 0}</span> )`;
  },
  set(value) {
    stat.allSpms = (value as StatDto).allSpms;
    stat.unAssignedSpms = (value as StatDto).unAssignedSpms;
    stat.assignedSpms = (value as StatDto).assignedSpms;
  },
});

const eventStat = computed({
  get() {
    return `( ${stat.allEvents || 0} / <span class="color-orange">${
      stat.unAssignedEvents || 0
    }</span> / <span class="color-red">${stat.assignedEvents || 0}</span> )`;
  },
  set(value) {
    stat.allEvents = (value as StatDto).allEvents;
    stat.assignedEvents = (value as StatDto).assignedEvents;
    stat.unAssignedEvents = (value as StatDto).unAssignedEvents;
  },
});

onMounted(() => {
  const reqPoolId = route.params.id;
  const tab: any = route.query.tab;
  activeKey.value = tab || "0";
  hasEditAuth(reqPoolId).then((res) => {
    hasEditAuthManage.value = res;
  });
  getRequirementGroupDetail(reqPoolId).then((res) => {
    detail.value = res;
  });

  getRequirementStat(reqPoolId).then((res) => {
    spmStat.value = res;
    eventStat.value = res;
    stat.tasks = res.tasks || 0;
  });
});

const selectPendingObjects = shallowReactive([]);
const selectOutLineObjects = shallowReactive([]);
const selectEvents = shallowReactive([]);
// 选择对象
function selectObject(objects) {
  selectPendingObjects.length = 0;
  selectPendingObjects.push(...objects);
}
// 选择对象
function selectOutObject(objects) {
  selectOutLineObjects.length = 0;
  selectOutLineObjects.push(...objects);
}
// 事件埋点池选择对象
function selectEventsTable(objects) {
  selectEvents.length = 0;
  selectEvents.push(...objects);
}
// 搜索void
function onKeyDown(e) {
  searchStr.value = e.target.value;
}
function changeSyncAllTerminal(checked) {
  syncAllTerminal.value = checked;
}
function cancelAssign(params, notOperaList) {
  const reqPoolId = route.params.id;
  const unOperaName = notOperaList.join("/");
  cancelOrigin({
    ...params,
    reqPoolId,
    syncAllTerminal: syncAllTerminal.value,
  }).then(() => {
    message.success("操作成功!");
    if (notOperaList.length > 0) {
      message.warning(`其中${unOperaName}任务无法取消指派，需要回退任务状态`);
    }
    const { path, query } = route;
    router.push({
      path,
      query: {
        ...query,
        tab: activeKey.value,
        time: +new Date(), // 页面强制更新
      },
    });
  });
}
function cancelAssignEvent() {
  if (activeKey.value === "1" && !selectEvents.length) {
    message.error("请选择事件~");
    return;
  }
  // const l = selectEvents.filter((ele) => ele.status === '开始' || ele.status === '待审核')
  const list = selectEvents.map((ele) => ({
    eventBuryPointId: ele.id,
    taskId: ele.taskId,
    type: 2,
  }));
  const params = {
    oidAssignVOS: list,
  };
  // if (list.length === 0) {
  //   message.warning('请选择任务状态处于“开始”或“待审核”的事件')
  //   return
  // }
  cancelOrigin(params).then(() => {
    message.success("取消指派成功");
    const { path, query } = route;
    router.push({
      path,
      query: {
        ...query,
        tab: activeKey.value,
        time: +new Date(), // 页面强制更新
      },
    });
  });
}

function handleTabChange(key) {
  const { path, query } = route;
  router.push({
    path,
    query: {
      ...query,
      tab: key,
    },
  });
}
</script>

<style scoped lang="less">
.c-title {
  line-height: 40px;
  height: 40px;
  .title {
    font-size: 14px;
    color: #102048;
  }
}

.sub-title {
  color: #7880a0;
  font-size: 12px;
}
:deep(.color-red) {
  color: red;
}
:deep(.color-orange) {
  color: orange;
}
</style>

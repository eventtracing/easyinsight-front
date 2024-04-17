<template lang="pug">
teleport(to="#base")
  span.g-ml-16.text-link(:class="{'m-text--disabled': hasNoEditAuth}" @click="showBaseSetting") 基线版本设置
a-modal(width="50vw" :visible="showBase" title="基线版本设置" @ok="handlerBase" @cancel="showBase = false")
  p
    | 说明：需求组的初始基线版本为需求组新建时刻的基线版本，后续流转过程中，需求组内版本发布不会变更基线版本，需求组外版本发布后会红点提示，用户可选择新的基线版本。
    span(:class="$style.red")
      | 新基线只能选择对应终端当前基线之后的版本，并且一旦设置成功，对象血缘树和指派任务将可能发生变化（不影响已发布任务），未发生变化的SPM及其指派任务也不变，新增的SPM无指派任务，需要人工指派，删除的SPM及其指派的未上线的任务将被删除，请谨慎操作。
  a-table(:columns="columns" :data-source="list" rowKey="terminalId" :pagination="false")
    template(#newVersion="{ record }")
      a-select(v-model:value="record.currentBaseReleaseId" :options="record.selections" show-search style="width: 150px" placeholder="请选择新基线版本")
    template(#action="{ record }")
      u-text-button(@click="selectBaseLine(record)") 基线版本历史
a-modal(:visible="showBaseHistory" title="基线版本历史")
  template(#footer)
    a-button(type="primary" @click="showBaseHistory = false") 知道了
  .g-mb-8 端版本
    span.color-gray.g-ml-8 {{activeTerminal}}
  a-table(:columns="historyColumns" :data-source="historyList" rowKey="id" :pagination="false")
</template>

<script setup lang="ts">
import { markRaw, ref, shallowReactive, onMounted, watch } from "vue";
import {
  getBaseLineList,
  getBaseLineHistoryList,
  publishBaseLine,
} from "@/services/requirement.design.service";
import moment from "moment";
import { message } from "ant-design-vue";

const props = defineProps<{ reqPoolId: string; hasNoEditAuth: boolean }>();
const { reqPoolId } = props;
const activeId = ref<number>();
const activeTerminal = ref<string>();
const showBase = ref<boolean>(false);
const showBaseHistory = ref<boolean>(false);
const columns = markRaw([
  {
    title: "终端",
    key: "terminalName",
    dataIndex: "terminalName",
  },
  {
    title: "初始基线版本",
    key: "firstTerminalVersion",
    dataIndex: "firstTerminalVersion",
  },
  {
    title: "当前基线版本",
    key: "currentVersion",
    slots: {
      customRender: "newVersion",
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
const historyColumns = markRaw([
  {
    title: "操作时间",
    key: "createTime",
    dataIndex: "createTime",
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "操作人",
    key: "createUser",
    dataIndex: "createUser",
  },
  {
    title: "基线版本",
    key: "terminalVersion",
    dataIndex: "terminalVersion",
  },
]);

const historyList = shallowReactive([]);
const list = shallowReactive([]);

// 确认基线版本设置
function handlerBase() {
  publishBaseLine({
    reqPoolId,
    details: list.map((v) => ({
      terminalId: v.terminalId,
      newReleaseId: v.currentBaseReleaseId,
    })),
  }).then(() => {
    message.success("发布成功~");
    showBase.value = false;
  });
}

function showBaseSetting() {
  if (!props.hasNoEditAuth) {
    showBase.value = true;
  }
}

function selectBaseLine(record) {
  showBaseHistory.value = true;
  activeId.value = record.terminalId;
  activeTerminal.value = record.terminalName;
}

watch(showBaseHistory, (value) => {
  if (value) {
    getBaseLineHistoryList(reqPoolId, activeId.value).then((res) => {
      historyList.length = 0;
      historyList.push(...res);
    });
  }
});

watch(
  showBase,
  (showBase) => {
    if (!showBase) return;

    getBaseLineList(reqPoolId).then((res) => {
      list.length = 0;
      list.push(
        ...res.terminalBases.map((v) => ({
          ...v,
          selections: (v.selections || []).map((v) => ({
            label: v.terminalVersionName,
            value: v.baseReleaseId,
          })),
        }))
      );
    });
  },
  { immediate: true }
);
</script>

<style scoped lang="less" module>
.red {
  color: red;
}
</style>

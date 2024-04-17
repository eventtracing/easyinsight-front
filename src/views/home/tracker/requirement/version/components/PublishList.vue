<template>
  <div class="g-mr-8">
    <a-tabs>
      <a-tab-pane key="version" tab="版本/任务发布">
        <u-left-right class="g-pl-8 g-pr-8 g-mb-16">
          <a-form layout="inline">
            <a-form-item label="任务状态">
              <a-select
                placeholder="全部"
                class="g-mr-2"
                style="width: 160px"
                v-model:value="taskStatus"
                allowClear=""
              >
                <a-select-option
                  v-for="t in reqStatusOptions"
                  :key="t.key"
                  :value="t.key"
                  :title="t.value"
                >
                  {{ t.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="任务来源状态">
              <a-select
                placeholder="全部"
                class="g-mr-2"
                style="width: 160px"
                v-model:value="taskSourceStatus"
                allowClear=""
              >
                <a-select-option
                  v-for="t in taskSourceStatusOptions"
                  :key="t.key"
                  :value="t.key"
                  :title="t.value"
                >
                  {{ t.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="版本状态">
              <a-select
                placeholder="全部"
                class="g-mr-2"
                style="width: 160px"
                v-model:value="versionDeployedFilter"
                allowClear=""
              >
                <a-select-option
                  v-for="t in versionStatusOption"
                  :key="t.key"
                  :value="t.key"
                  :title="t.value"
                >
                  {{ t.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="版本来源状态">
              <a-select
                placeholder="全部"
                class="g-mr-2"
                style="width: 160px"
                v-model:value="versionSourceStatus"
                allowClear=""
              >
                <a-select-option
                  v-for="t in versionSourceStatusOptions"
                  :key="t.key"
                  :value="t.key"
                  :title="t.value"
                >
                  {{ t.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <template #right>
            <a-input
              v-model:value="search"
              class="g-mr-8"
              style="width: 410px"
              placeholder="输入oid/名称/spm搜索, 输入*oid或*名称只模糊匹配对象"
            ></a-input>
            <s-table-search
              v-model:search="terminalVersionName"
              :width="260"
              placeholder="请输入端版本搜索"
            ></s-table-search>
          </template>
        </u-left-right>
        <div class="g-mb-8">
          <span class="title">端版本聚合任务列表</span>
        </div>
        <VersionList
          ref="versionList"
          :terminalId="terminalId"
          :search="search"
          :taskSourceStatus="taskSourceStatus"
          :versionSourceStatus="versionSourceStatus"
          :childColumns="columns"
          :terminalVersionName="terminalVersionName"
          :taskStatus="taskStatus"
          :versionDeployedFilter="versionDeployedFilter"
        />
        <UDividerDash class="g-mb-16 g-mt-16" />
        <u-left-right class="g-pl-8 g-pr-8 g-mb-16">
          <span class="title">无端版本聚合任务列表</span>
        </u-left-right>
        <TaskList
          :taskColumns="taskColumns"
          :terminalId="terminalId"
          :search="search"
          :terminalVersionName="terminalVersionName"
          :taskStatus="taskStatus"
          :taskSourceStatus="taskSourceStatus"
        />
      </a-tab-pane>
      <a-tab-pane key="history" tab="发布历史">
        <a-table
          size="small"
          @change="changeHistory"
          :columns="historyColumns"
          :data-source="historyList"
          :scroll="{ x: 'max-content' }"
        >
          <template #taskNames="{ text }">
            <div v-for="t in text" :key="t">{{ t }}</div>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="tsx">
import { ref, watchEffect, markRaw, shallowReactive } from "vue";
import VersionList from "./VersionList.vue";
import TaskList from "./TaskList.vue";
import { getHistoryList } from "@/services/terminalVersion.service";
import {
  reqStatusOptions,
  taskSourceStatusOptions,
  versionSourceStatusOptions,
} from "@/types/requirement.type";
import StatusTag from "@/views/home/tracker/requirement/components/StatusTag.vue";
import moment from "moment";

const versionList = ref();
const versionStatusOption = [
  { key: true, value: "已上线" },
  { key: false, value: "待上线" },
];
const { terminalId } = defineProps<{ terminalId: number | string }>();
const columns = markRaw<any>([
  { title: "需求ID", key: "reqIssueKey", dataIndex: "reqIssueKey" },
  { title: "需求名称", key: "reqName", dataIndex: "reqName" },
  { title: "任务名称", key: "taskName", dataIndex: "taskName" },
  {
    title: "计划发布时间",
    key: "planReleaseTime",
    dataIndex: "planReleaseTime",
  },
  {
    title: "发布时间",
    key: "releaseTime",
    dataIndex: "releaseTime",
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "发布人",
    key: "releaserName",
    dataIndex: "releaserName",
  },
  {
    title: "任务状态",
    key: "taskStatus",
    dataIndex: "taskStatus",
    customRender({ text: status }) {
      return <StatusTag status={status}></StatusTag>;
    },
  },
  {
    title: "任务来源状态",
    key: "sourceStatusDesc",
    dataIndex: "sourceStatusDesc",
  },
  {
    title: "负责人",
    key: "ownerName",
    dataIndex: "ownerName",
  },
  {
    title: "验证人",
    key: "verifierName",
    dataIndex: "verifierName",
  },
]);

const taskColumns = markRaw<any>([
  {
    title: "需求ID",
    key: "reqIssueKey",
    dataIndex: "reqIssueKey",
  },
  {
    title: "需求名称",
    key: "reqName",
    dataIndex: "reqName",
  },
  {
    title: "任务名称",
    key: "taskName",
    dataIndex: "taskName",
  },
  {
    title: "任务状态",
    key: "taskStatus",
    dataIndex: "taskStatus",
    customRender({ text: status }) {
      return <StatusTag status={status}></StatusTag>;
    },
  },
  {
    title: "计划发布时间",
    key: "planReleaseTime",
    dataIndex: "planReleaseTime",
  },
  {
    title: "任务来源状态",
    key: "sourceStatusDesc",
    dataIndex: "sourceStatusDesc",
  },
  {
    title: "负责人",
    key: "ownerName",
    dataIndex: "ownerName",
  },
  {
    title: "验证人",
    key: "verifierName",
    dataIndex: "verifierName",
  },
  {
    title: "操作",
    key: "action",
    slots: {
      customRender: "action",
    },
  },
]);

const historyColumns = markRaw<any>([
  {
    title: "发布ID",
    key: "releaseId",
    dataIndex: "releaseId",
  },
  {
    title: "发布人",
    key: "releaserName",
    dataIndex: "releaserName",
  },
  {
    title: "发布时间",
    key: "releaseTime",
    dataIndex: "releaseTime",
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
    sorter: true,
  },
  {
    title: "端版本",
    key: "terminalVersionName",
    dataIndex: "terminalVersionName",
  },
  {
    title: "发布任务",
    key: "taskNames",
    dataIndex: "taskNames",
    slots: {
      customRender: "taskNames",
    },
  },
]);

const search = ref<string>("");
const terminalVersionName = ref<string>("");
const taskStatus = ref<number>();
const taskSourceStatus = ref<number>();
const versionDeployedFilter = ref<boolean>();
const versionSourceStatus = ref<number>();
const historyList = shallowReactive([]);
const asend = ref<boolean>(false);

function changeHistory() {
  const sorter = arguments[2];
  asend.value = sorter.order === "ascend";
}

watchEffect(() => {
  getHistoryList({ terminalId, ascend: asend.value }).then((res) => {
    historyList.length = 0;
    historyList.push(...res);
  });
});
</script>

<style scoped>
.title {
  font-size: 14px;
  color: #102048;
}
</style>

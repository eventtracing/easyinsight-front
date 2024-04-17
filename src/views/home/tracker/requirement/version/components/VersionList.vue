<template>
  <a-table
    size="small"
    :columns="columns"
    :data-source="list"
    :loading="loading"
    :scroll="{ x: 'max-content' }"
    :rowClassName="rowClassName"
    :expanded-row-keys="expandedRowKeys"
    @expandedRowsChange="handleExpand"
    rowKey="terminalVersionId"
  >
    <template #action="{ record }">
      <a-popconfirm
        title="确定发布吗?"
        @confirm="publish(record)"
        v-if="!record.deployed"
      >
        <u-text-button>发布上线</u-text-button>
      </a-popconfirm>
    </template>
    <template #terminal="{ record }">
      <a v-if="record.terminalVersionLink" @click="jump(record)">
        {{ record.terminalVersionName }}
      </a>
      <span v-else>
        {{ record.terminalVersionName }}
      </span>
    </template>
    <template #expandedRowRender="{ record }">
      <a-table
        rowKey="reqIssueKey"
        :rowClassName="rowClassName"
        :columns="childColumns"
        :data-source="record.tasks"
        :pagination="false"
        size="small"
      />
    </template>
  </a-table>
  <version-modal
    :visible="visible"
    :detail="modalData"
    :terminalId="terminalId"
    @handlerCancel="handleCancel"
    @handleOk="handleOk"
  />
</template>

<script setup lang="ts">
import { shallowReactive, ref } from "vue";
import { useRoute } from "vue-router";
import {
  getVersionList,
  publishVersion,
} from "@/services/terminalVersion.service";
import moment from "moment";
import { message } from "ant-design-vue";
import { debouncedWatch } from "@vueuse/core";

const props = defineProps<{
  terminalId: number | string;
  search: string;
  terminalVersionName: string;
  childColumns: Array<any>;
  taskStatus: number;
  taskSourceStatus: number;
  versionSourceStatus: number;
  versionDeployedFilter: boolean;
}>();
const visible = ref<boolean>(false);
const modalData = ref<any>();
const loading = ref<boolean>(false);
const { childColumns } = props;
const route = useRoute();
const list = shallowReactive<Record<string, unknown>[]>([]);
const expandedRowKeys = ref<any>([]);

const columns = [
  {
    title: "版本ID",
    key: "terminalVersionId",
    dataIndex: "terminalVersionId",
  },
  {
    title: "端版本",
    key: "terminalVersionName",
    dataIndex: "terminalVersionName",
    slots: {
      customRender: "terminal",
    },
  },
  {
    title: "版本状态",
    key: "deployed",
    dataIndex: "deployed",
    customRender({ text }) {
      return text ? "已上线" : "待上线";
    },
  },
  {
    title: "版本来源状态",
    key: "sourceStatusDesc",
    dataIndex: "sourceStatusDesc",
  },
  {
    title: "创建人",
    key: "createName",
    dataIndex: "createName",
  },
  {
    title: "创建时间",
    key: "createTime",
    dataIndex: "createTime",
    sorter: true,
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "计划发布时间",
    key: "planReleaseTime",
    dataIndex: "planReleaseTime",
  },
  {
    title: "最新发布人",
    key: "latestReleaserName",
    dataIndex: "latestReleaserName",
  },
  {
    title: "最新发布时间",
    key: "latestReleaseTime",
    dataIndex: "latestReleaseTime",
    sorter: true,
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "操作",
    fixed: "right",
    key: "action",
    slots: {
      customRender: "action",
    },
  },
];

debouncedWatch(
  () => [
    loading,
    props.terminalVersionName,
    props.search,
    props.taskStatus,
    props.taskSourceStatus,
    props.versionDeployedFilter,
    props.versionSourceStatus,
  ],
  (value) => {
    if (!value[0]) return;
    loading.value = true;
    getList();
  },
  { debounce: 500, immediate: true }
);

function getList() {
  getVersionList({
    terminalId: props.terminalId,
    terminalVersionName: props.terminalVersionName,
    search: props.search,
    taskSourceStatus: props.taskSourceStatus,
    taskStatus: props.taskStatus,
    versionDeployedFilter: props.versionDeployedFilter,
    versionSourceStatus: props.versionSourceStatus,
  }).then((res) => {
    const version = route.query.version as string;

    version && handleList(version, res);

    list.length = 0;
    list.push(...res);
    loading.value = false;
  });
}

function handleList(version: string, list: any[]) {
  const selected = list.find((item) => item.terminalVersionName === version);
  const selectedIndex = list.findIndex(
    (item) => item.terminalVersionName === version
  );

  if (selectedIndex > -1) {
    expandedRowKeys.value.push(selected.terminalVersionId);
    list.splice(selectedIndex, 1);
    list.unshift(selected);
  }
}

onMounted(() => {
  loading.value = true;
});
function handleCancel() {
  visible.value = false;
}
function handleOk() {
  visible.value = false;
  loading.value = true;

  getVersionList({
    terminalId: props.terminalId,
    terminalVersionName: props.terminalVersionName,
    search: props.search,
    taskSourceStatus: props.taskSourceStatus,
    taskStatus: props.taskStatus,
    versionDeployedFilter: props.versionDeployedFilter,
    versionSourceStatus: props.versionSourceStatus,
  }).then((res) => {
    list.length = 0;
    list.push(...res);
    loading.value = false;
  });
}
function publish(record) {
  publishVersion({
    terminalId: props.terminalId,
    terminalVersionId: record.terminalVersionId,
    taskIds: (record.tasks || []).map((v) => v.taskId),
  }).then(() => {
    message.success("发布成功");
    loading.value = false;
    getList();
  });
}

function handleExpand(expandedRows: any[]) {
  expandedRowKeys.length = 0;
  expandedRowKeys.value = expandedRows;
}

function jump(record) {
  window.open(record.terminalVersionLink);
}

function rowClassName(record) {
  return record.mergeConflict ? "row-red" : "";
}
</script>

<style lang="less" scoped>
:deep(.ant-table-row.row-red) {
  background: #fbe9eb !important;
}
</style>

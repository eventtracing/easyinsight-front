<template>
  <div>
    <div class="text-link g-mb-8" @click="addTask">
      <PlusOutlined />
      添加任务
    </div>
    <a-table
      class="c-task__table"
      :columns="column"
      :data-source="dataSource"
      rowKey="id"
      :pagination="false"
      :srcoll="{ x: 2000 }"
    >
      <template #name="{ record }">
        <a-input v-model:value="record.name" placeholder="请输入任务名称" />
      </template>
      <template #terminal="{ record }">
        <a-select v-model:value="record.terminalId" placeholder="请选择终端">
          <a-select-option
            v-for="terminal in props.terminalLists"
            :key="terminal.id"
            :value="terminal.id"
            >{{ terminal.name }}</a-select-option
          >
        </a-select>
      </template>
      <template #owenr="{ record }">
        <a-select
          optionFilterProp="label"
          :options="ownerOptions"
          show-search
          v-model:value="record.owner"
          placeholder="请选择负责人"
        >
        </a-select>
      </template>
      <template #verifiers="{ record }">
        <a-select
          optionFilterProp="label"
          :options="ownerOptions"
          show-search
          v-model:value="record.verifier"
          placeholder="请选择验证人"
        >
        </a-select>
      </template>
      <template #option="{ record, index }">
        <span class="text-link g-mr-8" @click="copyTask(record)">复制</span>
        <span class="text-link" @click="removeTask(index)">删除</span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType, reactive, markRaw, watch, computed } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { v4 as uuidv4 } from "uuid";

interface UserInfo {
  email: string;
  userName: string;
}

const props = defineProps({
  terminalLists: Array as PropType<{ name: string; id: number }[]>,
  owners: Array as PropType<UserInfo[]>,
  taskList: Array as PropType<
    Partial<
      {
        id: number | string;
        terminalId: number | string;
        name: string;
        owner: string;
        verifier: string;
      }[]
    >
  >,
  from: Number,
});

const ownerOptions = computed(() =>
  props.owners.map((v) => ({
    label: `${v.userName}(${v.email})`,
    value: v.email,
  }))
);

const hasExist = ref<boolean>(false);

watch(
  () => props.from,
  () => {
    dataSource.length = 0;
  }
);

watch(props.taskList, (tasks) => {
  if (tasks && tasks.length && !hasExist.value) {
    dataSource.push(...tasks);
    hasExist.value = true;
  }
});

const column = markRaw([
  {
    title: "任务名称",
    key: "name",
    dataIndex: "name",
    width: 200,
    slots: { customRender: "name" },
  },
  {
    title: "绑定终端",
    key: "terminal",
    dataIndex: "terminal",
    width: 150,
    slots: { customRender: "terminal" },
  },
  {
    title: "负责人",
    key: "owner",
    dataIndex: "owner",
    width: 150,
    slots: { customRender: "owenr" },
  },
  {
    title: "验证人",
    key: "verifiers",
    dataIndex: "verifiers",
    width: 150,
    slots: { customRender: "verifiers" },
  },
  {
    title: "操作",
    key: "option",
    fixed: "right",
    width: 200,
    slots: { customRender: "option" },
  },
]);

const dataSource = reactive<
  Partial<{
    id: number | string;
    terminalId: number | string;
    name: string;
    owner: string;
    custom?: boolean;
    verifier: string;
  }>[]
>([]);

defineExpose({ dataSource });

function addTask() {
  dataSource.push({
    id: uuidv4(),
    custom: true,
    name: "",
    terminalId: null,
    owner: null,
  });
}

function removeTask(index) {
  dataSource.splice(index, 1);
}

function copyTask(record) {
  dataSource.push({ ...record, custom: true, id: uuidv4() });
}
</script>

<style lang="less" scoped>
.c-task__table :deep(.ant-table-scroll) {
  overflow-x: auto;
}
.c-task__table {
  :deep(th:nth-last-child(1)),
  :deep(td:nth-last-child(1)) {
    box-shadow: 10px 12px 7px 7px #000;
  }
}
</style>

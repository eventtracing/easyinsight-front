<template>
  <div class="g-pl-24 g-mt-8 g-pr-24">
    <u-left-right>
      <u-filter-select
        :value="terminalId"
        @change="changeFilter($event, 'terminalId')"
        label="终端视图"
        :options="terminalLists"
        :hasAll="false"
        valueAttr="key"
        labelAttr="value"
      >
      </u-filter-select>
      <UDivider />
      <u-filter-select
        @change="changeFilter($event, 'releaseId')"
        :value="releaseId"
        label="端版本"
        :options="versionLists"
        :hasAll="false"
        valueAttr="key"
        labelAttr="value"
      >
      </u-filter-select>
      <template #right>
        <s-table-search
          v-model:search="search"
          :width="220"
          placeholder="请输入事件id/名称搜索"
          @sync="sync"
          @search="sync"
        ></s-table-search>
      </template>
    </u-left-right>
    <UDividerDash class="g-mt-10 g-mb-16" />
    <a-table
      :columns="columns"
      :data-source="dataSource"
      rowKey="eventBuryPointId"
    >
      <template #event="{ text, record }">
        <u-text-button @click="handleClick(record)">
          <span>{{ record.eventCode }}</span>
          <span>（{{ text }}）</span>
        </u-text-button>
      </template>
    </a-table>
    <a-modal
      width="70vw"
      :visible="showDetail"
      title="事件详情"
      @cancel="showDetail = false"
    >
      <EventDetail :eventBuryPointId="detail.data.eventBuryPointId" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { shallowReactive, ref, reactive, markRaw } from "vue";
import EventDetail from "./EventDetail.vue";
import { getEventLists, getPoolReleaseList } from "@/services/event.service";
import UDivider from "@/components/common/u-divider.vue";
import { debouncedWatch } from "@vueuse/core";
import moment from "moment";

const terminalLists = shallowReactive([]);
const versionLists = shallowReactive([]);
const poolReleaseList = shallowReactive([]);
const dataSource = shallowReactive([]);
const detail = reactive({ data: {} });
const search = ref<string>();
const terminalId = ref<string>();
const releaseId = ref<string>();
const showDetail = ref<boolean>(false);
const columns = markRaw([
  {
    title: "事件",
    key: "eventName",
    dataIndex: "eventName",
    slots: {
      customRender: "event",
    },
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
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
    sorter: true,
  },
  {
    title: "最近修改人",
    key: "updateName",
    dataIndex: "updateName",
  },
  {
    title: "最近修改时间",
    key: "updateTime",
    dataIndex: "updateTime",
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
    sorter: true,
  },
]);

function sync() {
  getEventLists({
    terminalId: terminalId.value,
    releaseId: releaseId.value,
    search: search.value,
  }).then((res) => {
    dataSource.push(...res);
  });
}

function handleClick(record) {
  showDetail.value = true;
  detail.data = record;
}

const fetchPoolReleaseList = async () => {
  const res = await getPoolReleaseList();

  const { list } = res;

  poolReleaseList.push(...list);

  const terminals = list.map((item) => item.terminal);
  terminalLists.push(...terminals);

  changeFilter(terminalLists?.[0]?.key, "terminalId");
};

onMounted(() => {
  fetchPoolReleaseList();
});

function changeFilter(value, type) {
  if (type !== "terminalId") {
    releaseId.value = value;
    return;
  }

  terminalId.value = value;

  const selected: any = poolReleaseList.filter(
    (item) => item.terminal.key === value
  );
  const releases = selected?.[0]?.releases || [];

  versionLists.length = 0;
  versionLists.push(...releases);

  releaseId.value = releases[0]?.key;
}

debouncedWatch([terminalId, releaseId, search], sync, { debounce: 500 });
</script>

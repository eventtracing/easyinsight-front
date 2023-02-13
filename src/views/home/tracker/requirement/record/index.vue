<template>
  <div class="fill g-p-lr-24 g-pb-24 record-wrapper" style="overflow-y: auto">
    <div class="header">
      <a-breadcrumb>
        <a-breadcrumb-item>测试记录</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <UDividerDash class="g-mt-8" />
    <a-form
      class="g-mb-8"
      layout="inline"
      :model="formState"
      ref="formRef"
      :rules="rules"
    >
      <template v-if="!isFromEvent">
        <a-form-item label="SPM_NO" name="spms">
          <a-select style="width: 250px" v-model:value="formState.spms">
            <a-select-option key="all" value="">全部</a-select-option>
            <a-select-option
              v-for="item in spmsList"
              :key="item.key"
              :value="item.key"
              :title="item.value"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="事件类型" style="margin-bottom: 20px" name="events">
          <a-select style="width: 250px" v-model:value="formState.events">
            <a-select-option key="all" value="">全部</a-select-option>
            <a-select-option
              v-for="item in eventsList"
              :key="item.key"
              :value="item.key"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <a-form-item label="验证结果" name="result">
        <a-select style="width: 160px" v-model:value="formState.result">
          <a-select-option
            v-for="item in resultList"
            :key="item.key"
            :value="item.key"
          >
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">确认</a-button>
        <a-button style="margin-left: 10px" @click="handleReset">重置</a-button>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="list"
      @change="onTableChange"
      :pagination="pagination"
      rowKey="id"
    >
      <template #time="{ text }"
        ><span>
          {{ formatTime(text) }}
        </span></template
      >
      <template #userTime="{ record }"
        ><span>
          <div>{{ record.saver.userName }}</div>
          <div>{{ formatTime(record.saveTime) }}</div>
        </span></template
      >
      <template #result="{ text, record }"
        ><span>
          <div style="margin-bottom: 10px; font-size: 15px">
            <span :style="{ color: text === 1 ? 'green' : 'red' }">{{
              text === 1 ? "验证通过" : "验证不通过"
            }}</span>
            <span>，各项指标如下</span>
          </div>
          <detection :data="record.indicators"></detection> </span
      ></template>
      <template #code-show="{ text }"
        ><span> <code-show :data="text" :showError="false"></code-show> </span
      ></template>
      <template #type="{ text }"
        ><span>
          <span>{{ text === 1 ? "实时测试" : "需求测试" }}</span>
        </span></template
      >
      <template #opts="{ record }"
        ><span>
          <a @click="handleDelete(record)">删除</a>
        </span></template
      >
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import {
  getHistoryAggre,
  getHistoryList,
  deleteRecordHistory,
} from "@/services/test/realTime/index.service";
import { getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";
import Detection from "../../../test/components/point-list/detection.vue";
import CodeShow from "../../../test/components/point-list/code-show.vue";

export default defineComponent({
  name: "TestRecord",
  components: {
    "code-show": CodeShow,
    detection: Detection,
  },
  setup() {
    const _resultList = reactive([
      {
        key: "0",
        value: "全部",
      },
      {
        key: "1",
        value: "验证通过",
      },
      {
        key: "2",
        value: "验证不通过",
      },
    ]);
    const _columns = reactive([
      {
        title: "日志获取时间",
        dataIndex: "logServerTime",
        key: "logServerTime",
        sorter: true,
        slots: {
          customRender: "time",
        },
      },
      {
        title: "日志",
        dataIndex: "log",
        key: "log",
        slots: {
          customRender: "code-show",
        },
        width: "20%",
      },
      {
        title: "规则",
        dataIndex: "rule",
        key: "rule",
        slots: {
          customRender: "code-show",
        },
        width: "20%",
      },
      {
        title: "验证结果和指标",
        dataIndex: "checkResult",
        key: "checkResult",
        ellipsis: true,
        slots: {
          customRender: "result",
        },
      },
      {
        title: "记录来源",
        dataIndex: "type",
        key: "type",
        slots: {
          customRender: "type",
        },
        width: 120,
      },
      {
        title: "保存人和保存时间",
        dataIndex: "saveTime",
        key: "saveTime",
        ellipsis: true,
        sorter: true,
        slots: {
          customRender: "userTime",
        },
      },
      {
        title: "操作",
        dataIndex: "opts",
        key: "opts",
        slots: {
          customRender: "opts",
        },
      },
    ]);

    return { resultList: _resultList, columns: _columns };
  },

  computed: {
    formRef() {
      return this.$refs.formRef;
    },
  },

  data() {
    const _pagination = {
      current: 1,
      pageSize: 10,
      total: 0,
    };
    const _trackerObj = {};
    const _spmsList = [];
    const _eventsList = [];

    let _form;

    const _list = [];
    const _rules = {
      spms: ["spms"],
      events: ["events"],
      result: ["result"],
    };

    return {
      pagination: _pagination,
      trackerObj: _trackerObj,
      spmsList: _spmsList,
      eventsList: _eventsList,
      form: _form,
      list: _list,
      rules: _rules,
      formState: {},
    };
  },

  beforeCreate() {
    this.form = this.formRef;
  },

  created() {
    const { trackerId, from } = this.$route.query;
    this.isFromEvent = from === "event"; // 事件测试记录

    getHistoryAggre({ processId: trackerId }).then((res) => {
      this.spmsList = res?.spms || [];
      this.eventsList = res?.events || [];
    });
  },
  mounted() {
    const { spm } = this.$route.query;

    this.formState.spms = spm;
    this.fetchList();
  },
  methods: {
    fetchList(searchData = {}) {
      this.$refs.formRef.validateFields().then((values) => {
        const { spms = "", events = "", result = "" } = values;
        const { trackerId, eventBuryPointId = "" } = this.$route.query;
        const { current, pageSize } = this.pagination;
        const data = {
          currentPage: current,
          pageSize,
          processId: trackerId,
          orderBy: "",
          orderRule: "",
          spm: spms || "",
          events: events || "",
          result: result || "",
          eventBuryPointId: eventBuryPointId || null,
          ...searchData,
        };

        getHistoryList(data).then((res) => {
          const { list = [], totalNum } = res;
          this.list = list;
          this.pagination.total = totalNum;
        });
      });
    },

    handleSearch() {
      this.fetchList();
    },

    handleReset() {
      this.$refs.formRef.resetFields();
    },

    onTableChange(pagination, filters, sorter) {
      const { order = "", field = "" } = sorter;
      const { current } = pagination;

      this.pagination.current = current;
      this.fetchList({
        orderBy: field,
        orderRule: order,
      });
    },

    formatTime(num: number) {
      return getTimeStringFromTimestamp(num);
    },

    handleDelete(record) {
      deleteRecordHistory({ id: record.id }).then(() => {
        this.$message.success("删除成功");
        this.fetchList();
      });
    },
  },
});
</script>

<style scoped="true" lang="less">
.record-wrapper {
  .header {
    padding: 10px 0;
  }
}
</style>

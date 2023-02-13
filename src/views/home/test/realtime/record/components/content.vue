<template>
  <div>
    <u-left-right>
      <div class="flex flex-ac" style="flex-wrap: wrap">
        <div>
          <label>测试日期：</label>
          <a-range-picker
            :value="condition.time"
            @change="(value) => changeCondition('time', value)"
          />
        </div>
        <u-divider></u-divider>
        <u-filter-select
          label="端版本"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.terminal"
          :options="config.versions"
          @change="(value) => changeCondition('terminal', value)"
        ></u-filter-select>
        <u-divider></u-divider>
        <u-filter-select
          label="操作人"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.userId"
          :options="config.operatorList"
          @change="(value) => changeCondition('userId', value)"
        ></u-filter-select>
        <u-divider></u-divider>
        <u-filter-select
          label="测试需求"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.reqName"
          :options="config.testRequirementList"
          @change="(value) => changeCondition('reqName', value)"
        ></u-filter-select>
        <u-divider></u-divider>
        <u-filter-select
          label="基线版本"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.baseVer"
          :options="config.baseLineVersionList"
          @change="(value) => changeCondition('baseVer', value)"
        ></u-filter-select>
        <u-filter-select
          label="测试结果"
          :hasAll="true"
          labelAttr="label"
          valueAttr="value"
          :value="condition.result"
          :options="resultList"
          @change="(value) => changeCondition('result', value)"
        ></u-filter-select>
        <u-divider></u-divider>
        <a-input
          style="width: 300px"
          placeholder="请输入 测试会话id进行搜索"
          v-model:value="condition.code"
          @keydown.enter="searchLists"
        ></a-input>
      </div>
      <UDividerDash class="g-mt-8" />
    </u-left-right>
    <div>
      <a-table
        :columns="columns"
        :pagination="pagination"
        :dataSource="data"
        @change="tableChange"
      >
        <template #saveTime="{ record }">
          <div>{{ showTime(record.saveTime) }}</div>
        </template>
        <template #code="{ text, record }">
          <a @click="() => jumpTo(record)">{{ text }}</a>
        </template>
        <template #testResult="{ text }">
          <span>{{ resultMap[text] || "" }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { TableColumn } from "@/types/table.type";
import UDividerDash from "@/components/common/u-divider-dash.vue";
import { getAllRequire, getRecordList } from "@/services/record.service";
import { getAllUsers } from "@/services/app.service";
import { getBaseLineList } from "@/services/requirement.design.service";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import { getTerminalList } from "@/services/terminal.service";
import moment from "moment";
import { useRoute } from "vue-router";
// declare let env: string
export default defineComponent({
  name: "RealTimeRecordContent",
  mixins: [TableMixin],
  setup() {
    const _columns = reactive<TableColumn[]>([
      {
        title: "会话id",
        dataIndex: "code",
        key: "code",
        slots: {
          customRender: "code",
        },
      },
      {
        title: "操作人",
        dataIndex: "userName",
        key: "userName",
      },
      {
        title: "测试时间",
        key: "saveTime",
        sorter: "descend",
        sortDirections: ["descend", "ascend"],
        slots: {
          customRender: "saveTime",
        },
      },
      {
        title: "失败数目",
        key: "failedNum",
        sorter: "descend",
        sortDirections: ["descend", "ascend"],
        dataIndex: "failedNum",
      },
      {
        title: "测试需求",
        key: "require",
        dataIndex: "reqName",
      },
      {
        title: "对比基准版本",
        key: "baseVersion",
        dataIndex: "baseVersion",
      },
      {
        title: "测试端",
        key: "require",
        dataIndex: "terminal",
      },
      {
        title: "测试结果",
        key: "testResult",
        dataIndex: "testResult",
        slots: {
          customRender: "testResult",
        },
      },
      {
        title: "测试App版本号",
        key: "appVersion",
        dataIndex: "appVersion",
      },
    ]);

    return {
      columns: _columns,
    };
  },
  data() {
    const _condition: any = {
      time: [moment().subtract(7, "day"), moment()],
      orderBy: "saveTime",
      orderRule: "descend",
      result: null,
    };
    const _config: any = {};
    const _data = [];
    const resultList = [
      {
        label: "未通过",
        value: 0,
      },
      {
        label: "通过",
        value: 1,
      },
      {
        label: "部分通过",
        value: 2,
      },
    ];

    const resultMap = {
      0: "未通过",
      1: "通过",
      2: "部分通过",
    };

    return {
      condition: _condition,
      config: _config,
      data: _data,
      resultList,
      taskId: "",
      resultMap,
    };
  },

  created() {
    const route = useRoute();
    const { query } = route;

    const resultList = ["0", "1", "2"];

    const { result, taskId = "" } = query;

    let conditionResult = null;

    if (resultList.includes(result as any)) {
      conditionResult = Number(result);
    }

    this.condition.result = conditionResult;

    this.taskId = taskId;
  },

  mounted() {
    this.getUsers();
    this.getAllRequire();
    this.getTerminalList();
    this.searchLists();
  },

  methods: {
    getUsers() {
      getAllUsers().then((res) => {
        const list = res.map((item) => ({
          ...item,
          value: `${item.userName}(${item.email})`,
          key: item.id,
        }));
        this.config.operatorList = list;
      });
    },
    showTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    getAllRequire() {
      getAllRequire().then((res) => {
        const list = res.map((item) => ({
          ...item,
          value: item.reqName,
          key: item.reqName,
        }));
        this.config.testRequirementList = list;
      });
    },
    getBaseLineList(reqPoolId) {
      getBaseLineList(reqPoolId).then((res) => {
        const list = res.terminalBases.map((item) => ({
          ...item,
          value: item.currentTerminalVersion,
          key: item.currentTerminalVersion,
        }));
        this.config.baseLineVersionList = list;
      });
    },
    getTerminalList() {
      getTerminalList({
        currentPage: 1,
        pageSize: 50,
        search: "",
      }).then((res) => {
        const list = res.list.map((ele) => ({
          ...ele,
          value: ele.name,
          key: ele.name,
        }));
        this.config.versions = list;
      });
    },
    changeCondition(param, value) {
      // 当输入搜索的时候，点击搜索到的项，value会有问题
      if (Object.prototype.toString.call(value) === "[object Event]") return;

      this.condition[param] = value === "all" ? undefined : value;
      this.searchLists();

      if (param === "reqName") {
        if (value === "all") {
          this.config.baseLineVersionList = [];
          return;
        }
        const list = this.config.testRequirementList.filter(
          (item) => item.key === value
        );
        const reqPoolId = list[0].reqPoolId;
        this.getBaseLineList(reqPoolId);
      }
    },
    // 搜索数据
    searchLists({ current = 1, pageSize = 25 } = {}) {
      this.loading = true;
      getRecordList({
        currentPage: current,
        pageSize,
        ...this.condition,
        startTime: moment(this.condition.time[0]).startOf("day").valueOf(),
        endTime: moment(this.condition.time[1]).endOf("day").valueOf(),
        taskId: this.taskId,
      })
        .then((result) => {
          this.total = result.totalNum;
          this.current = current;
          this.pageSize = pageSize;
          this.data = result.list || [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    tableChange(pagination, filter, orderRule) {
      const { columnKey, order } = orderRule;
      this.condition.orderBy = order ? columnKey : "saveTime";
      this.condition.orderRule = order || "descend";
      this.searchLists(pagination);
    },
    jumpTo(record) {
      window.open(record?.targetUrl);
    },
  },
});
</script>

<style scoped="true" lang="less"></style>

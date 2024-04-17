<template>
  <div>
    <div v-show="updateNum > 0">
      <div class="update-banner flex">
        <div>
          <ExclamationCircleOutlined />
          <span>有</span>
          <span class="num">{{ updateNum }}</span>
          <span>条新日志哦！</span>
        </div>
        <a-button type="primary" @click="handleUpdateClick">马上更新</a-button>
      </div>
    </div>
    <div class="point-list-wrapper">
      <a-table
        size="small"
        :columns="columns"
        :data-source="dataSource"
        :showHeader="false"
        rowKey="id"
        :pagination="pagination"
        :eventId="eventId"
        :searchStr="searchStr"
        :logType="logType"
        @change="changePagination"
      >
        <template #event="{ text, record }"
          ><span>
            <span>
              {{ text }}
              {{ record.eventName ? `(${record.eventName})` : "" }}
            </span>
          </span></template
        >
        <template #first="{ text, record }"
          ><span>
            <span>
              {{ text }}
              {{ record.firstObjName ? `(${record.firstObjName})` : "" }}
            </span>
          </span></template
        >
        <template #result="{ text, record }"
          ><div href="javascript:;">
            <span :style="{ color: text === 1 ? 'green' : 'red' }">{{
              textMap[text]
            }}</span>
            <a-popover placement="bottom">
              <template #title>
                <span
                  :style="{
                    color: text === 1 ? 'green' : 'red',
                    fontSize: '15px',
                  }"
                  >{{ popoverTextMap[text] }}</span
                >
              </template>
              <template #content>
                <p
                  style="font-size: 13px; color: #000000; margin-bottom: 5px"
                  v-if="text !== 3"
                >
                  各指标如下
                </p>
                <detection
                  :data="record.detectionIndicator"
                  v-if="text !== 3"
                ></detection>
                <p v-if="text === 3" style="width: 350px">
                  1、检查日志中是否有spm，若无，请先补齐；若有，检查下一项；
                  <br />
                  2、检查规则校验扫码前是否选中需求，若无，请先勾选；若有，检查下一项；（按基线版本即线上埋点规则校验时可不选需求）
                  <br />
                  3、检查需求中对象树层级是否有多和漏等导致spm不匹配的情况，若无，请与平台反馈；若有，则与埋点方案设计者沟通修改和确认。
                  <br />
                  <br />
                  提示：大多数情况下都是因为需求中对象树层级定义和spm不匹配。
                </p>
              </template>
              <FileSearchOutlined style="margin-left: 5px; cursor: pointer" />
            </a-popover></div
        ></template>
        <template #time="{ text }"
          ><span>
            {{ formatTime(text) }}
          </span></template
        >
        <template #error-code="{ text }"
          ><span>
            {{ `code: ${text}` }}
          </span></template
        >
        <template #error-category="{ text }"
          ><span>
            {{ `错误类型: ${text}` }}
          </span></template
        >
        <template #opts="{ record }">
          <div class="opts-wrapper">
            <a
              size="small"
              style="margin-right: 10px"
              @click="showRuleDrawer(record)"
              >埋点详情</a
            >
            <icon-font
              title="复制"
              class="icon-copy"
              type="icon-fuzhi"
              @click="copyJSON(record.props)"
            ></icon-font>
          </div>
        </template>
      </a-table>
    </div>
  </div>
  <rule-drawer
    :visible="visible"
    @close="handleClose"
    :detail="detail"
    :deviceInfo="deviceInfo"
    :from="from"
    :type="type"
    :taskName="taskName"
    :reqTaskName="reqTaskName"
  ></rule-drawer>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  shallowReactive,
  watch,
} from "vue";
import moment from "moment";
import {
  getTimeStringFromTimestamp,
  usePagination,
} from "@/ndsc-vue3/utils/lib";
import { getLogInfo } from "@/services/test/realTime/index.service";
import Detection from "./detection.vue";
import {
  FileSearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import RuleDrawer from "../rule-drawer/index.vue";

const modeTypeMap = {
  1: "ruleCheck",
  2: "oldVersionLog",
  3: "exceptionStatisticsResult",
};

const logTypeMap = {
  1: "logUpdateNum",
  2: "oldLogUpdateNum",
  3: "exceptionLogNum",
};

export default defineComponent({
  name: "point-list",
  components: {
    detection: Detection,
    FileSearchOutlined,
    ExclamationCircleOutlined,
    "rule-drawer": RuleDrawer,
  },

  setup(props) {
    const _textMap = reactive({
      1: "验证通过",
      2: "验证不通过",
      3: "未匹配到SPM，无法验证",
    });

    const _popoverTextMap = reactive({
      1: "验证通过",
      2: "验证不通过",
      3: "未匹配到SPM的原因，可按如下步骤查找和定位",
    });

    return {
      textMap: _textMap,
      popoverTextMap: _popoverTextMap,
      pagination: shallowReactive(usePagination()),
    };
  },

  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      default: 1,
    },
    from: {
      type: String,
      default: "",
    },
    eventId: {
      type: String,
      default: "",
    },
    logType: {
      // 1：曙光日志 2：老版本日志 3：错误日志
      type: Number,
      default: 1,
    },
    searchStr: {
      type: String,
      default: "",
    },
    currentRecord: {
      // 树模式下进行DataSource筛选
      type: Object,
      default: () => {},
    },
    deviceInfo: {
      // 树模式下进行DataSource筛选
      type: Object,
      default: () => {},
    },
    updateNum: {
      type: Number,
      default: 0,
    },
    checkType: {
      type: Number,
      default: 0,
    },
    clearLog: {
      type: Number,
      default: 0,
    },
    taskName: {
      type: String,
      default: "",
    },
    reqTaskName: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      dataSource: [],
      visible: false,
      detail: {},
    };
  },

  computed: {
    queryParams() {
      const result: { [x: string]: any } = {
        eventId: this.eventId,
        searchStr: this.searchStr,
        checkType: this.checkType ? "2" : "",
      };

      if (this.currentRecord && this.currentRecord.spm) {
        result.updateFlag = true;

        // 如果点击的是事件，把上次的spm去掉
        result.spm = this.eventId ? "" : this.currentRecord.spm;
      }

      if (this.clearLog) {
        result.userOperate = this.clearLog;
        result.updateFlag = this.clearLog !== 1;
      }

      result.eventId = this.currentRecord?.eventCode || "";

      return result;
    },
  },

  created() {
    this.fetchDataSource({ updateFlag: true });
  },

  methods: {
    async fetchDataSource(...args) {
      const res = await getLogInfo(this.getParams(...args));
      const records = res?.records || [];
      const page: any = res?.page || {};

      const list = records
        ?.map((item: any) => {
          const { logInfo = "", id } = item;
          const logInfoObj = JSON.parse(logInfo) || {};
          return { ...logInfoObj, id };
        })
        .filter(Boolean);

      this.dataSource = list;

      // 更新数据
      this.$store.commit("setExtraRecords", {
        extraRecords: res?.extraRecords || [],
        shouldCoverData: res?.shouldCoverData || [],
      });

      page.size && (this.pagination.pageSize = page.size);
      page.page && (this.pagination.current = page.page);
      this.pagination.total = page.total || 0;

      if (this.queryParams.userOperate) {
        // clearLog是一次性的操作，需要手动清空clearLog
        this.$store.commit("setClearLog", 0);
      }
    },

    getParams(data = {}, pageParams = {}) {
      const { conversation, taskId, terminalId, domainId } = this.$route.query;
      const page = {
        size: this.pagination.pageSize,
        page: this.pagination.current,
        total: this.pagination.total || 0,
        ...pageParams,
      };
      const params = {
        indexName: "insight_eslog_test",
        code: conversation,
        taskId,
        terminalId,
        domainId,
        pageRequest: JSON.stringify(page),
        logType: this.logType,
        updateFlag: false,
        ...this.queryParams,
        ...data,
      };

      return params;
    },

    changePagination({ current = 1, pageSize = 25 } = {}) {
      this.fetchDataSource({}, { page: current, size: pageSize });
    },

    formatTime(num: number) {
      return getTimeStringFromTimestamp(num);
    },

    handleUpdateClick() {
      this.$store.commit("setUpdateNum", {
        type: logTypeMap[this.logType],
        num: 0,
      });
      this.$store.commit("setClearLog", 0);
      this.fetchDataSource({ updateFlag: true, userOperate: "" }, { page: 1 });
    },
    showRuleDrawer(record) {
      this.detail = record;
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    },
    copyJSON(data) {
      const input = document.createElement("input");
      document.body.appendChild(input);

      // @ts-ignore
      input.setAttribute("value", JSON.stringify(data));
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$message.success("复制成功~");
      } else {
        this.$message.error("复制失败~");
      }
      document.body.removeChild(input);
    },
  },
  watch: {
    queryParams(newValues, oldValues) {
      const data: any = {};

      if (newValues.eventId !== oldValues.eventId) {
        data.updateFlag = true;
      }

      if (newValues.checkType !== oldValues.checkType) {
        data.updateFlag = true;
      }

      if (!newValues.userOperate && oldValues.userOperate) {
        // 手动清空clearLog的时候，不发请求
        return;
      }

      this.fetchDataSource(data, { page: 1 });
    },
  },
});
</script>

<style scoped="true" lang="less">
.point-list-wrapper {
  margin-top: 20px;
}

.opts-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.update-banner {
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f5bb4e;
  background-color: #fef7e8;
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 15px;

  .anticon {
    margin-right: 10px;
    color: #f4b141;
  }

  .num {
    color: #103ffa;
    margin: 5px;
  }

  .tip {
    color: red;
    font-size: 14px;
  }
}
</style>

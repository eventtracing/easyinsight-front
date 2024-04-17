<template>
  <div class="test-realtime-wrapper fill">
    <div class="detail-header">
      <div class="breadcrumb-wrapper">
        <a-breadcrumb>
          <a-breadcrumb-item
            ><a @click="handleRoute">实时测试</a></a-breadcrumb-item
          >
          <a-breadcrumb-item>测试详情</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="flex flex-ac status-wrapper">
          <span v-if="connectedStatus === 2">
            <a-tag color="green">设备已连接</a-tag>
          </span>
          <span v-else>
            <a-tag color="red">设备已断开</a-tag>
          </span>
          <a-popover trigger="hover" :arrowPointAtCenter="true">
            <template #title>
              <div style="margin: 10px; font-size: 16px">测试信息</div>
            </template>
            <template #content
              ><div>
                <device-detail :deviceInfo="deviceInfo"></device-detail></div
            ></template>
            <ExclamationCircleOutlined
              @mouseenter="iconMouseEnter"
              style="margin-left: -5px; font-size: 15px; cursor: pointer"
            />
          </a-popover>
          <a-popover title="扫码连接" trigger="click">
            <template #content>
              <img :src="qrcodeUrl" />
              <p style="margin-bottom: 3px">请使用测试包进行扫码连接</p>
              <p style="margin-bottom: 3px">当前连接码：{{ qrcodeId }}</p>
            </template>
            <a-button
              size="small"
              style="margin-left: 5px"
              type="primary"
              v-show="connectedStatus !== 2"
              >重新扫码</a-button
            >
          </a-popover>
          <a-button
            size="small"
            style="margin-left: 5px"
            type="primary"
            danger
            @click="closeConnect"
            >保存并退出</a-button
          >
        </div>
      </div>
      <div style="float: right" class="flex">
        <a-button size="small" style="margin-left: 5px" @click="clear"
          >清空日志</a-button
        >
        <a-button
          size="small"
          style="margin-left: 5px"
          type="primary"
          @click="showAll"
          >显示全部</a-button
        >
      </div>
    </div>

    <test-abstract
      :baseStatistic="baseStatistic"
      :taskStatistic="taskStatistic"
      :unMatchTableData="unMatchTableData"
      :eventData="tableData"
      :reqTestInfoStatistic="reqTestInfoStatistic"
      :testStatisticInfoParam="testStatisticInfoParam"
      :taskName="taskName"
      :reqTaskName="reqTaskName"
      :showAbstractResult="showAbstractResult"
    />
    <tab-content
      :logData="logData"
      :oldLOgData="oldLOgData"
      :undefinedStatistics="undefinedStatistics"
      :exceptions="exceptions"
      :baseTree="baseTree"
      :baseObjData="baseObjData"
      :tableData="tableData"
      :unMatchTableData="unMatchTableData"
      :taskTree="taskTree"
      :taskName="taskName"
      :reqTaskName="reqTaskName"
      :deviceInfo="deviceInfo"
      :conversation="qrcodeId"
      @refreshData="fetchStatistics"
      ref="child"
    ></tab-content>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QRCode from "qrcode";
import TabContent from "../../components/tab-content/index.vue";
import TestAbstract from "../../components/test-abstract/index.vue";
import {
  getClientBasicInfo,
  getTaskTree,
  getBaseTree,
  getStatistics,
  setLiveTestQueryParams,
  getTheData,
  stopLiveTest,
  setSnapshot,
} from "@/services/test/realTime/index.service";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import DeviceDetail from "../../components/device-detail/index.vue";

declare const env: string;
const ENV = env;
export default defineComponent({
  name: "test-realtime",
  components: {
    "tab-content": TabContent,
    "device-detail": DeviceDetail,
    ExclamationCircleOutlined,
    "test-abstract": TestAbstract,
  },

  data() {
    const _envHost: string = window.location.hostname;
    const _deviceInfo = {};
    const _logData = {};
    const _oldLOgData = {};
    const _undefinedStatistics = {};
    const _exceptions = [];
    const _connectedStatus = 0; // 1断开，2连接
    const _taskId = this.$route.query.taskId;
    const _terminalId = this.$route.query.terminalId;
    const _baseTree = [];
    const _taskTree = [];
    const _tableData = [];
    const _unMatchTableData = [];
    const _baseObjData = [];
    const _taskName = "";
    const _reqTaskName = "";
    const _routePath = `${window.location.pathname}${window.location.search}`;
    // socket的实例
    const _envHostName: string = window.location.hostname;

    return {
      envHost: _envHost,
      deviceInfo: _deviceInfo,
      logData: _logData,
      oldLOgData: _oldLOgData,
      undefinedStatistics: _undefinedStatistics,
      unMatchTableData: _unMatchTableData,
      exceptions: _exceptions,
      connectedStatus: _connectedStatus,
      taskId: _taskId,
      terminalId: _terminalId,
      baseTree: _baseTree,
      tableData: _tableData,
      baseObjData: _baseObjData,
      taskTree: _taskTree,
      taskName: _taskName,
      reqTaskName: _reqTaskName,
      routePath: _routePath,
      timer: null,
      exceptionLogNum: 0,
      oldLogUpdateNum: 0,
      logUpdateNum: 0,
      qrcodeUrl: "",
      wsSocket: null,
      envHostName: _envHostName,
      baseStatistic: {
        passNum: 0,
        failNum: 0,
        waitTestNum: 0,
        coverNum: 0,
      },
      taskStatistic: {
        passNum: 0,
        failNum: 0,
        waitTestNum: 0,
        coverNum: 0,
      },
      reqTestInfoStatistic: {},
      testStatisticInfoParam: {},
      showAbstractResult: false,
    };
  },

  computed: {
    user() {
      const user = this.$store.state.user;

      return user;
    },
    qrcodeId() {
      const { conversation } = this.$route.query;
      const { qrcodeId } = this.$store.state;

      // 默认先取
      return +conversation || qrcodeId;
    },
    showType() {
      const { type } = this.$store.state.liveTest.selectShow;
      return type;
    },
  },

  created() {
    this.taskId = this.$route.query.taskId;
    this.terminalId = this.$route.query.terminalId;
    this.generateQRCode();
    this.postQueryParams();
    this.fetchDeviceInfo();
    this.buildInterval();
    this.initialCurrentRecord();
    this.fetchTree();
    this.fetchGetTheData();
    this.$store.commit("changeConnectPath", this.routePath); // 同步路由
  },

  unmounted() {
    this.closeInterval();
    this.closeWS();
  },

  watch: {
    connectedStatus: {
      handler: "getQRCodeStatusOnTime",
    },
  },

  methods: {
    insertData(tree, spm, details = [], statistic) {
      tree.forEach((item) => {
        const { children = [] } = item;

        if (item.spm === spm) {
          item.details = details;
          details.forEach((detail: any) => {
            const failSum = detail?.failSum || 0;
            const hitSum = detail?.hitSum || 0;
            const passSum = detail?.passSum || 0;
            const reqSum = detail?.reqSum || 0;

            statistic.passNum += passSum;
            statistic.failNum += failSum;
            statistic.waitTestNum += reqSum;
            statistic.coverNum += hitSum;
          });
        }

        if (children && children.length) {
          this.insertData(children, spm, details, statistic);
        }
      });
    },

    insertEventData(tableData, details) {
      this.tableData =
        tableData?.map((item) => {
          const r =
            details?.filter((ele) => ele.eventCode === item.eventCode) || [];
          return {
            ...item,
            details: r,
          };
        }) || [];
    },

    async fetchGetTheData() {
      const taskId = this.$route.query.taskId;
      const res = await getTheData({ taskId, objSearch: "" });

      this.tableData = res?.events || [];
      this.reqTaskName = res.reqName + res.taskName || "";
    },

    async fetchStatistics() {
      try {
        const { conversation } = this.$route.query;
        const res = await getStatistics({
          indexName: "insight_eslog_test",
          code: conversation,
          terminalId: this.terminalId,
          taskId: this.taskId,
        });

        this.showAbstractResult = true;

        this.baseStatistic = {
          passNum: 0,
          failNum: 0,
          waitTestNum: 0,
          coverNum: 0,
        };
        this.taskStatistic = {
          passNum: 0,
          failNum: 0,
          waitTestNum: 0,
          coverNum: 0,
        };

        const {
          appStatus,
          oldVersionStatistics,
          statistics,
          treeModeStatistic,
          eventStatistic,
          undefinedStatistics,
          exceptionLogNum,
          oldLogUpdateNum,
          logUpdateNum,
          unMatchSpmStatistic,
          errorStatistic,
          reqTestInfoStatistic,
          testStatisticInfoParam,
        } = res;

        if (!appStatus) {
          this.closeInterval();
        }

        if (appStatus && !this.timer) {
          this.buildInterval();
        }

        this.oldLOgData = oldVersionStatistics || {};
        this.connectedStatus = appStatus ? 2 : 1;
        this.logData = statistics || {};
        this.undefinedStatistics = undefinedStatistics || {};
        this.unMatchTableData = unMatchSpmStatistic || [];
        this.reqTestInfoStatistic = reqTestInfoStatistic || {};
        this.exceptions = errorStatistic || 0;
        this.testStatisticInfoParam = testStatisticInfoParam || {};

        this.$store.commit("setUpdateNum", {
          type: "oldLogUpdateNum",
          num: oldLogUpdateNum || 0,
        });
        this.$store.commit("setUpdateNum", {
          type: "logUpdateNum",
          num: logUpdateNum || 0,
        });
        this.$store.commit("setUpdateNum", {
          type: "exceptionLogNum",
          num: exceptionLogNum || 0,
        });

        if (treeModeStatistic && Array.isArray(treeModeStatistic)) {
          treeModeStatistic.forEach((item) => {
            const { spm, details = [] } = item;
            this.insertData(this.baseTree, spm, details, this.baseStatistic);
            this.insertData(this.taskTree, spm, details, this.taskStatistic);
          });
        }
        this.updateSelectedNum();
        if (eventStatistic?.details) {
          const { details } = eventStatistic;
          this.insertEventData(this.tableData, details);
          this.baseObjData = details || [];
        }
      } catch (e) {
        this.closeInterval();
      }
    },

    fetchDeviceInfo() {
      const { conversation } = this.$route.query;
      getClientBasicInfo({
        conversation,
      }).then((res) => {
        this.deviceInfo = res || {};
      });
    },

    async fetchTree() {
      const baseTree = await getBaseTree({
        terminalId: this.terminalId,
      });
      this.handleTree(baseTree);
      this.baseTree = baseTree;
      if (this.taskId) {
        const taskRes = await getTaskTree({
          taskId: this.taskId,
          terminalId: this.terminalId,
        });
        const taskTree = taskRes.roots || [];
        this.handleTree(taskTree);
        this.taskTree = taskTree;
        this.taskName = taskRes.reqName + taskRes.taskName || "";
      }

      this.initialCurrentRecord();
    },

    async postQueryParams() {
      const user = this.$store.state.user;
      const { query } = this.$route;
      setLiveTestQueryParams({ ...user, ...query });
    },

    initialCurrentRecord() {
      const currentRecord = this.taskTree[0] ||
        this.baseTree[0] || {
          spm: "",
        };
      this.$store.commit("setCurrentRecord", currentRecord);
    },

    handleTree(list) {
      if (list.length) {
        list.forEach((item) => {
          item.details = [];

          if (item.childs && item.childs.length) {
            item.children = item.childs;
            this.handleTree(item.childs);
          }
        });
      }
    },

    generateQRCode() {
      const domainId = localStorage.getItem("domainId");
      const { appId } = this.$route.query;

      QRCode.toDataURL(
        `orpheus://devtool/bilog_viewer/connect?ws=${encodeURI(
          `ws://${this.envHostName}/process/realtime/app/${
            this.qrcodeId
          }/${domainId}/${appId}/${this.taskId || null}/${this.terminalId}`
        )}`
      ).then((res) => {
        this.qrcodeUrl = res;
      });
    },
    // 连接WebSocket
    openWS() {
      const domainId = localStorage.getItem("domainId");
      const { appId } = this.$route.query;

      const wsSocket = (this.wsSocket = new WebSocket(
        `ws://${this.envHostName}/process/realtime/scancode/${
          this.qrcodeId
        }?terminalId=${
          this.terminalId
        }&domainId=${domainId}&appId=${appId}&taskId=${this.taskId || ""}`
      ));

      this.wsSocket.addEventListener("open", () => {
        wsSocket.addEventListener("message", (event) => {
          if (event.data !== "completion") return;
          this.closeWS();
          this.buildInterval();
        });
      });

      wsSocket.addEventListener("error", () => {
        setTimeout(() => {
          this.openWS();
        }, 3000);
      });
    },

    // 关闭WebSocket
    closeWS() {
      this.wsSocket?.close();
      this.wsSocket = null;
    },

    handleRoute() {
      const { appId } = this.$route.query;
      this.$router.push(`/test/realtime?appId=${appId}`);
    },

    clear() {
      this.$store.commit("setClearLog", 1);
      this.postSnapshot();
    },

    showAll() {
      this.$store.commit("setClearLog", 2);
    },

    getQRCodeStatusOnTime(newValue, oldValue) {
      if (newValue === oldValue) return;

      if (newValue === 1) {
        this.openWS();
        this.postSnapshot();
      } else {
        if (this.wsSocket) {
          this.closeWS();
        }
      }
    },

    postSnapshot() {
      const { conversation } = this.$route.query;
      const { taskStatistic, baseStatistic, unMatchTableData = [] } = this;

      function getTaskData() {
        const {
          passNum = 0,
          failNum = 0,
          waitTestNum = 0,
          coverNum = 0,
        } = taskStatistic;

        return {
          passNum,
          disPassNum: failNum,
          unCoveredNum: waitTestNum - coverNum,
        };
      }

      function getBaseData() {
        const {
          passNum = 0,
          failNum = 0,
          waitTestNum = 0,
          coverNum = 0,
        } = baseStatistic;

        return {
          passNum,
          disPassNum: failNum,
          unMatchedSpmNum: unMatchTableData?.reduce((pre, cur) => {
            return pre + cur.num;
          }, 0),
        };
      }

      function getTestResult() {
        const { failNum, coverNum, waitTestNum } = taskStatistic;
        if (failNum !== 0 || waitTestNum - coverNum !== 0) {
          return 0; // 不通过
        }

        if (baseStatistic.failNum !== 0) {
          return 2; // 部分通过
        }
        return 1; // 通过
      }

      const data = {
        code: conversation,
        reqCoverInfoDTO: getTaskData(),
        baseCoverInfoDTO: getBaseData(),
        testResult: getTestResult(),
      };

      setSnapshot(data);
    },

    closeConnect() {
      const { conversation } = this.$route.query;
      this.$store.commit("changeConnectPath", "");
      this.closeInterval();
      this.closeWS();
      stopLiveTest({ code: conversation });
      this.$store.commit("setShowFail", false);
      this.$store.commit("setSelectShow", { type: 1, number: 0 });
      this.postSnapshot();
      this.$router.push("/test/realtime");
    },

    buildInterval() {
      this.timer = setInterval(() => {
        this.fetchStatistics();
      }, 3000);
    },

    closeInterval() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    iconMouseEnter() {
      this.fetchDeviceInfo();
    },
    updateSelectedNum() {
      let num = 0;

      switch (this.showType) {
        case 1:
          num = this.taskStatistic.passNum;
          break;
        case 2:
          num = this.taskStatistic.failNum;
          break;
        case 3:
          num = this.taskStatistic.waitTestNum - this.taskStatistic.coverNum;
          break;
        case 4:
          num = this.baseStatistic.passNum;
          break;
        case 5:
          num = this.baseStatistic.failNum;
          break;
        default:
          num = 0;
      }

      this.$store.commit("setSelectShow", {
        type: this.showType,
        number: num || 0,
      });
    },
  },
});
</script>

<style lang="less">
.test-realtime-wrapper {
  .ant-tabs-content {
    height: 100%;
  }
  .ant-tabs-bar {
    margin-bottom: 0px;
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 10px;
}

.breadcrumb-wrapper {
  display: flex;
  margin: 10px;
  align-items: center;

  .status-wrapper {
    margin-left: 10px;
  }
}

.header-wrapper {
  position: relative;
}
</style>

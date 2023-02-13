<template>
  <div>
    <u-left-right>
      <div class="flex flex-ac" style="flex-wrap: wrap">
        <u-filter-select
          label="需求ID"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.reqIssueKey"
          :options="config.requirementIds"
          @change="(value) => changeCondition('reqIssueKey', value)"
        />
        <u-divider></u-divider>
        <u-filter-select
          label="需求名称"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.reqName"
          :options="config.requirementNames"
          @change="(value) => changeCondition('reqName', value)"
        />
        <u-divider></u-divider>
        <u-filter-select
          label="任务状态"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.status"
          :options="reqStatusOptions"
          @change="(value) => changeCondition('status', value)"
        />
        <u-divider></u-divider>
        <u-filter-select
          label="验证人"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.taskVerifier"
          :options="config.users"
          @change="(value) => changeCondition('taskVerifier', value)"
        />
        <u-divider></u-divider>
        <u-filter-select
          label="负责人"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.taskOwner"
          :options="config.users"
          @change="(value) => changeCondition('taskOwner', value)"
        />
        <u-divider></u-divider>
        <u-filter-select
          label="端版本"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.terminalVersion"
          :options="config.versions"
          @change="(value) => changeCondition('terminalVersion', value)"
        />
        <u-divider></u-divider>
        <u-filter-select
          label="迭代"
          :hasAll="true"
          labelAttr="value"
          valueAttr="key"
          :value="condition.sprint"
          :options="config.interators"
          @change="(value) => changeCondition('sprint', value)"
        />
        <u-divider></u-divider>
        <a-input
          style="width: 150px"
          placeholder="任务: 请输入名称"
          v-model:value="condition.taskName"
          @keydown.enter="searchLists"
        />
        <UDividerDash class="g-mt-8" />
        <u-text-button class="g-ml-4" @click="resetForm">重置</u-text-button>
      </div>
    </u-left-right>
    <div @click="showQRCode = false">
      <div class="flex-ac g-mt-8 c-judge__rules">
        <a-button :disabled="!trackerId" type="primary" @click="validateRules"
          >规则校验</a-button
        >
        <transition name="slide-top">
          <div
            class="c-qrcode flex-ac"
            ref="QRCode"
            v-show="showQRCode"
            @click="refreshCode"
          >
            <div class="c-qrcode__title">{{ activeCodeName }}</div>
            <a-divider></a-divider>
            <div class="c-qrcode__content">
              <img class="c-qrcode__url" :src="qrcodeUrl" />
              <div class="flex-ac c-text--white">
                连接码: {{ showQRcodeId }}
              </div>
              <div class="flex-ac g-mt-4 c-text--white" style="font-size: 12px">
                点击二维码可刷新连接码
              </div>
            </div>
          </div>
        </transition>
      </div>
      <Lists
        :data-source="data"
        :loadings="loading"
        :pagination="pagination"
        :conditions="condition"
        @getLists="searchLists"
        @changeTrackerIds="changeTrackerIds"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Lists from "./lists.vue";
import { reqStatusOptions } from "@/types/requirement.type";
import { getTaskList } from "@/services/requirement.service";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import QRCode from "qrcode";
import UDividerDash from "@/components/common/u-divider-dash.vue";

declare let env: string;
const ENV = env;
export default defineComponent({
  name: "RealTimeListsContent",
  mixins: [TableMixin],
  components: {
    Lists,
  },

  setup() {
    const //
      _reqStatusOptions = reqStatusOptions;

    const _objectTypeOptions = Object.freeze([
      { key: 1, value: "页面" },
      { key: 2, value: "元素" },
    ]);

    return {
      reqStatusOptions: _reqStatusOptions,
      objectTypeOptions: _objectTypeOptions,
    };
  },

  props: {
    terminal: {
      type: Number,
    },
    terminalName: {
      type: String,
      default: "Android",
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    terminalTaskOptions() {
      return (this.config.taskName || [])
        .filter((task) => +task.value === +this.terminal)
        .map((item) => {
          return {
            key: item.value,
            value: item.key,
          };
        });
    },

    QRCode() {
      const QRCode: typeof HTMLDivElement = this.$refs.QRCode;
      return QRCode;
    },

    lists() {
      const lists: any = this.$refs.lists;
      return lists;
    },
    showQRcodeId() {
      const qrcodeId: number = this.$store.state.qrcodeId;
      const { appId } = this.$route.query;
      const domainId = localStorage.getItem("domainId");
      const taskId = this.trackerId;
      const terminalId = this.terminal;
      return `${qrcodeId}/${domainId}/${appId}/${taskId}/${terminalId}`;
    },
    qrcodeId() {
      const qrcodeId: number = this.$store.state.qrcodeId;
      return qrcodeId;
    },
  },

  data() {
    const _activeCodeName = "";
    const _showQRCode = false;
    const _data: Array<any> = [];
    const _loading = true;
    const _trackerId: string | number = null;
    const _qrcodeUrl = "";
    const _currentTab: number | null = null;
    const _wsSocket: any = null;
    const _envHostName: string = window.location.hostname;

    // 二维码当前位置
    return {
      condition: {
        reqIssueKey: undefined,
        reqName: undefined,
        taskName: undefined,
        status: undefined,
        objType: undefined,
        taskOwner: undefined,
        terminalVersion: undefined,
        taskVerifier: undefined,
        sprint: undefined,
        terminalId: this.terminal,
      },
      activeCodeName: _activeCodeName,
      showQRCode: _showQRCode,
      data: _data,
      loading: _loading,
      trackerId: _trackerId,
      qrcodeUrl: _qrcodeUrl,
      currentTab: _currentTab,
      wsSocket: _wsSocket,
      envHostName: _envHostName,
      reqPoolId: null,
      reqName: null,
    };
  },

  mounted() {
    this.searchLists();
    this.$store.dispatch("chageQrCode");
  },

  methods: {
    setRealTimeTestId(...rest) {
      return this.$store.commit.apply(
        this.$store,
        ["setRealTimeTestId"].concat(rest)
      );
    },

    changeTrackerIds(trackerId, reqPoolId, reqName) {
      this.trackerId = trackerId;
      this.reqPoolId = reqPoolId;
      this.reqName = reqName;
    },

    // 重置搜索条件
    resetForm() {
      this.condition.reqIssueKey = undefined;
      this.condition.reqName = undefined;
      this.condition.taskName = undefined;
      this.condition.status = undefined;
      this.condition.taskOwner = undefined;
      this.condition.taskVerifier = undefined;
      this.condition.terminalVersion = undefined;
      this.condition.sprint = undefined;
      this.searchLists();
    },

    changeCondition(param, value) {
      if (typeof value === "object") {
        return;
      }

      this.condition[param] = value === "all" ? undefined : value;
      this.searchLists();
    },

    // 搜索数据
    searchLists({ current = 1, pageSize = 25 } = {}) {
      this.loading = true;
      getTaskList({
        currentPage: current,
        pageSize,
        ...this.condition,
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

    changeQRCodeId() {
      this.$store.dispatch("chageQrCode");
    },

    // 刷新二维码
    refreshCode(event) {
      event.stopPropagation();
      this.changeQRCodeId();
    },

    // 触发二维码显示消失
    changeShowQRCode(style = {}, tab, refresh?) {
      const domainId = localStorage.getItem("domainId");
      const { appId } = this.$route.query;

      QRCode.toDataURL(
        `orpheus://devtool/bilog_viewer/connect?ws=${encodeURI(
          `ws://${this.envHostName}/process/realtime/app/${
            this.qrcodeId
          }/${domainId}/${appId}/${this.trackerId || null}/${this.terminal}`
        )}`
      ).then((res) => {
        this.qrcodeUrl = res;
        this.currentTab = tab;

        Object.keys(style).forEach((key) => {
          this.QRCode.style.setProperty(key, style[key]);
        });

        if (!refresh) {
          this.showQRCode = !this.showQRCode;
        }
      });
    },
    changQR() {
      const domainId = localStorage.getItem("domainId");
      const { appId } = this.$route.query;

      QRCode.toDataURL(
        `orpheus://devtool/bilog_viewer/connect?ws=${encodeURI(
          `ws://${this.envHostName}/process/realtime/app/${
            this.qrcodeId
          }/${domainId}/${appId}/${this.trackerId || null}/${this.terminal}`
        )}`
      ).then((res) => {
        this.qrcodeUrl = res;
      });

      this.wsSocket && this.closeWS();

      this.openWS();
    },

    // 校验规则
    validateRules(event) {
      event.stopPropagation();

      this.activeCodeName = "规则校验";
      this.changeShowQRCode({ left: 0, top: "40px", "margin-left": 0 }, 1);
    },

    // 获取实时日志二维码
    getRealTimeLog(event) {
      event.stopPropagation();

      this.activeCodeName = "实时日志";
      this.changeShowQRCode(
        { top: "-98px", "margin-left": "calc(100% - 233px)" },
        2
      );
    },

    // 连接WebSocket
    openWS() {
      const domainId = localStorage.getItem("domainId");
      const { appId } = this.$route.query;

      const wsSocket = (this.wsSocket = new WebSocket(
        `ws://${this.envHostName}/process/realtime/scancode/${
          this.qrcodeId
        }?terminalId=${
          this.terminal
        }&domainId=${domainId}&appId=${appId}&taskId=${this.trackerId || null}`
      ));

      this.wsSocket.addEventListener("open", () => {
        wsSocket.addEventListener("message", (event) => {
          if (event.data !== "completion") return;
          this.closeWS();
          this.jumpToDetail();
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
      this.wsSocket.close();
      this.wsSocket = null;
    },

    jumpToDetail() {
      this.$router.push(
        `/test/realtime/detail?terminal=${this.terminalName}&conversation=${
          this.qrcodeId
        }&requirements=${this.trackerId || ""}&tab=${this.currentTab}&taskId=${
          this.trackerId || ""
        }&terminalId=${this.terminal || ""}&reqPoolId=${
          this.reqPoolId || ""
        }&reqName=${this.reqName || ""}`
      );
    },

    getQRCodeStatusOnTime(showQRCode) {
      if (showQRCode) {
        this.openWS();
      } else {
        if (this.wsSocket) {
          this.closeWS();
        }
      }
    },
  },
  watch: {
    showQRCode: {
      handler: "getQRCodeStatusOnTime",
    },
    qrcodeId: {
      handler: "changQR",
    },
  },
});
</script>

<style scoped="true" lang="less">
.c-judge__rules {
  position: relative;
  margin-bottom: 16px;
  :deep(.ant-alert-icon) {
    top: 8px;
  }
  :deep(.ant-alert) {
    padding-top: 4px;
    padding-bottom: 4px;
  }
  :deep(.ant-divider-horizontal) {
    margin: 0;
    margin-top: 15px;
  }
  .c-qrcode__content {
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
.c-qrcode__url {
  width: 90%;
  margin-bottom: 4px;
  object-fit: contain;
}
.c-text--white {
  color: rgba(121, 128, 154, 1);
}
.c-qrcode {
  padding-top: 10px;
  padding-bottom: 4px;
  opacity: 1;
  width: 233px;
  height: fit-content;
  background: #fff;
  border-radius: 4px;
  position: absolute;
  left: 0;
  top: 40px;
  justify-content: center;
  z-index: 10;
  align-items: flex-start;
  box-shadow: 0px 2px 6px rgba(23, 23, 26, 0.1);
  flex-direction: column;
}

.c-qrcode::before {
  content: "";
  position: absolute;
  left: 30%;
  top: -10px;
  transform: translate(-50%);
  border: 5px solid transparent;
  border-bottom-color: #fff;
}
.c-qrcode__title {
  text-indent: 16px;
  font-size: 18px;
}
</style>

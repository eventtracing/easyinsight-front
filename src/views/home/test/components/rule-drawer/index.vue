<template>
  <a-drawer placement="right" :visible="visible" width="70%">
    <template #title>
      <slot name="title">
        <div class="rule-drawer-title">
          <span>测试日志</span>
          <icon-font
            title="复制"
            class="icon-copy copy"
            type="icon-fuzhi"
            @click="copyJSON(detail.log)"
          ></icon-font>
        </div>
      </slot>
    </template>
    <a-row style="margin-bottom: 20px" :gutter="16">
      <a-col :span="8">
        <p class="mb10 break-all">
          当前查看SPM:
          {{ spm }}
        </p>
      </a-col>
      <a-col :span="8">
        <p class="mb10 break-all">
          当前查看对象:
          {{ event }}
        </p>
      </a-col>
      <a-col :span="8">
        <p class="mb10">日志获取时间：{{ logServerTime }}</p>
      </a-col>
      <a-col :span="8">
        <p class="mb10">
          测试操作人：
          <span>{{ deviceInfo.username || "" }}</span>
        </p>
      </a-col>
      <a-col :span="8">
        <p class="mb10">
          端：
          <span>{{ this.$route.query.terminal || "" }}</span>
        </p>
      </a-col>
      <a-col :span="8">
        <p class="mb10">
          需求：
          <span>{{ reqTaskName || taskName || "" }}</span>
        </p>
      </a-col>
    </a-row>
    <a-descriptions layout="vertical" bordered>
      <a-descriptions-item
        label="埋点详情"
        style="width: 49%; vertical-align: top"
      >
        <code-show :data="detail.log" :showError="type === 1"></code-show>
      </a-descriptions-item>
      <a-descriptions-item
        label="校验规则"
        style="width: 49%; vertical-align: top"
      >
        <code-show
          :data="detail.rule"
          :showError="type === 1"
          :from="from"
          :checkResult="detail.checkResult"
          v-if="type === 1"
        ></code-show>
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";
import CodeShow from "../point-list/code-show.vue";

export default defineComponent({
  name: "rule-drawer",
  components: {
    "code-show": CodeShow,
  },

  data() {
    const _terminal = this.$route.query.terminal;
    return {
      terminal: _terminal,
    };
  },

  props: {
    detail: {
      type: Object,
      default: () => {},
    },
    deviceInfo: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
    from: {
      type: String,
      default: "",
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
  computed: {
    spm() {
      const { firstObjOid = "", firstObjName = "", spm = "" } = this.detail;

      if (firstObjOid) {
        return `${firstObjOid}${firstObjName ? ` ( ${firstObjName} ) ` : ""}`;
      }

      if (spm) {
        return spm;
      }

      return "";
    },
    event() {
      const { eventCode = "", eventName = "" } = this.detail;
      if (eventCode) {
        return `${eventCode}${eventName ? ` ( ${eventName} ) ` : ""}`;
      }
      return "";
    },
    logServerTime() {
      const { logServerTime = "" } = this.detail;

      return logServerTime
        ? moment(logServerTime).format("YYYY-MM-DD HH:mm:ss")
        : "";
    },
    checkResult() {
      const { checkResult } = this.detail;

      return checkResult;
    },
    checkResultText() {
      const { checkResult } = this.detail;
      const textMap = {
        1: "验证通过",
        2: "验证不通过",
        3: "未匹配到SPM，无法验证",
      };

      return textMap[checkResult];
    },
  },
  methods: {
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
});
</script>

<style lang="less" scoped="true">
.rule-drawer-title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .copy {
    margin-right: 35px;
  }
}

.mb10 {
  margin-bottom: 10px;
}
.break-all {
  word-break: break-all;
}
</style>

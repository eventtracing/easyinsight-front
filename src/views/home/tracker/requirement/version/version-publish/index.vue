<template>
  <div class="publish-page">
    <div class="body g-p-lr-24 g-mb-8">
      <BackToList :terminalVersion="version" />
      <a-steps
        size="small"
        :current="currentStep"
        class="g-m-tb-24"
        style="padding: 0 120px"
      >
        <a-step title="确认发布内容"></a-step>
        <a-step title="跨版本冲突检测"></a-step>
        <a-step title="跨需求冲突检测"></a-step>
      </a-steps>
      <DeployContentTable v-if="currentStep === 0" :id="verisonId" />
      <VersionConflictCheck
        v-if="currentStep === 1"
        :verisonId="verisonId"
        :terminalId="terminalId"
        @nextDisabled="validateDisabled"
      />
      <ReqConflictCheck
        v-if="currentStep === 2"
        :verisonId="verisonId"
        :terminalId="terminalId"
      />
    </div>
    <div class="footer">
      <template v-if="currentStep === 0">
        <a-button @click="onCancel">取消</a-button>
        <a-button type="primary" class="g-ml-16" @click="onNext"
          >下一步</a-button
        >
      </template>
      <template v-else-if="currentStep === 1">
        <a-button @click="onPrev">上一步</a-button>
        <a-button
          type="primary"
          class="g-ml-16"
          :disabled="reqConflictCheckDisabled"
          @click="onNext"
          >下一步
        </a-button>
      </template>
      <template v-else>
        <a-button @click="onPrev">上一步</a-button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BackToList from "./BackToList.vue";
import DeployContentTable from "./DeployContentTable.vue";
import VersionConflictCheck from "./VersionConflictCheck.vue";
import ReqConflictCheck from "./ReqConflictCheck.vue";

export default defineComponent({
  name: "VersionPublish",
  components: {
    BackToList,
    DeployContentTable,
    VersionConflictCheck,
    ReqConflictCheck,
  },
  setup() {
    var _reqConflictCheckDisabled = ref(true);
    function validateDisabled(disabled) {
      _reqConflictCheckDisabled.value = disabled;
    }

    return {
      reqConflictCheckDisabled: _reqConflictCheckDisabled,
      validateDisabled,
    };
  },
  data() {
    const _verisonId: number = null;
    const _version = "";
    const _terminalId: number = null;
    const _currentStep = 0;

    return {
      verisonId: _verisonId,
      version: _version,
      terminalId: _terminalId,
      currentStep: _currentStep,
    };
  },
  async created() {
    const { id, tid, version } = this.$route.query;

    version && (this.version = String(version));
    tid && (this.terminalId = Number(tid));
    id && (this.verisonId = Number(id));
  },
  methods: {
    onCancel() {
      this.$router.replace({
        path: "/tracker/requirement/version",
      });
    },
    onNext() {
      this.currentStep++;
    },
    onPrev() {
      this.currentStep--;
    },
  },
});
</script>

<style lang="less" scoped="true">
.publish-page {
  position: relative;
  height: 100%;
  padding-bottom: 48px;

  .body {
    height: 100%;
    overflow-y: auto;
  }
}
.footer {
  position: absolute;
  bottom: 0;
  left: 24px;
  right: 24px;
  height: 48px;
  line-height: 48px;
  border-top: 1px solid @border-color-split;
  background: #fff;
}
</style>

<template>
  <u-drawer
    title="对象变基"
    :width="1000"
    :visible="true"
    :footer="true"
    @handlerClose="handleClose"
  >
    <a-steps :current="currentStep" size="small" class="g-mb-24">
      <a-step title="对象diff"></a-step>
      <a-step title="对象变基"></a-step>
    </a-steps>
    <ObjectDiffDetail
      v-if="currentStep === 0"
      :objId="objId"
      :historyId="historyId"
      :trackerId="trackerId"
      :terminalId="terminalId"
      :baseTerminalVersionId="baseTerminalVersionId"
      :newestTerminalVersionId="newestTerminalVersionId"
    >
    </ObjectDiffDetail>
    <ObjectRebaseForm
      v-if="currentStep === 1"
      ref="object-rebase-form"
      :objId="objId"
      :historyId="historyId"
      :trackerId="trackerId"
      :terminalId="terminalId"
      :newestTerminalVersionId="newestTerminalVersionId"
    >
    </ObjectRebaseForm>
    <template #footer="">
      <template v-if="currentStep === 0">
        <a-button @click="handleClose">取消</a-button>
        <a-button class="g-ml-12" type="primary" @click="onNext">
          下一步
        </a-button>
      </template>
      <template v-else>
        <a-button @click="onPrev">上一步</a-button>
        <a-button class="g-ml-12" type="primary" @click="handleOk">
          对象变基
        </a-button>
      </template>
    </template>
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ObjectDiffDetail from "../../components/object-diff/ObjectDiffDetail.vue";

export default defineComponent({
  name: "ObjectDiffDrawer",
  components: {
    ObjectDiffDetail,
  },
  props: {
    objId: {},
    historyId: {},
    trackerId: {},
    terminalId: {},
    baseTerminalVersionId: {},
    newestTerminalVersionId: {},
  },
  data() {
    return {
      currentStep: 0,
    };
  },
  methods: {
    onNext() {
      this.currentStep++;
    },
    onPrev() {
      this.currentStep--;
    },
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

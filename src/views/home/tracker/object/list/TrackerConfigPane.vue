<template>
  <div>
    <div class="g-pl-8">
      <ParamConfigForm
        :form="form"
        :paramBinds="tracker.paramBinds"
        :formState="formState"
        :rules="rules"
        :disabled="disabled"
        :isDetail="isDetail"
        :optionObj="obj"
        :trackers="trackers"
        :terminalId="terminalId"
      ></ParamConfigForm>
      <LineageForm
        :parentObjs="tracker.parentObjs"
        :parentObjsDiff="tracker.parentObjsDiff"
        :terminalIds="[tracker.terminalId]"
        :id="id"
        :uuid="tracker.uuid"
        :requireIds="tracker.requireId ? [tracker.requireId] : []"
        :disabled="disabled"
        :type="type"
        :reqPoolId="reqPoolId"
        @change="onParentObjsChange"
      ></LineageForm>
    </div>
    <div class="flex g-mt-8">
      <span class="g-mr-8 g-mt-8 text-main">
        事件与事件公参
        <br />
        <u-text-button
          style="margin-left: 30px"
          class="g-mt-8"
          :on-click="copyEvent"
          v-if="isDetail"
        >
          <a-tooltip>
            <template #title>复制事件</template>
            <CopyOutlined :style="{ fontSize: '18px' }" />
          </a-tooltip>
        </u-text-button>
      </span>
      <EventConfigForm
        :obj="obj"
        :events="events"
        :terminalIds="terminalIds"
        :item="tracker"
        :trackerKey="itemKey"
        :form="form"
        :terminals="terminals"
        :disabled="disabled"
        :trackers="trackers"
        :isAdd="isAdd"
        :isDiff="isDiff"
        :isDetail="isDetail"
        ref="eventRef"
        v-bind="$attrs"
      ></EventConfigForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import LineageForm from "./LineageForm.vue";
import ParamConfigForm from "./ParamConfigForm.vue";
import EventConfigForm from "./EventConfigForm.vue";
import useCopy from "hooks/useCopy";
import useFindAndroidAndIPhone from "hooks/Object/useFindAndroidAndIPhone";
import { CopyOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "TrackerConfigPane",
  components: {
    LineageForm,
    ParamConfigForm,
    CopyOutlined,
    EventConfigForm,
  },
  props: {
    type: {
      type: Number,
      default: 1,
    },
    form: {},
    formState: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    obj: {
      default: () => ({ consistency: true }),
    },
    id: {},
    terminalId: {},
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    isAdd: {
      type: Boolean,
      default: false,
    },
    tracker: {
      type: Object,
      default: () => ({}),
    },
    itemKey: {
      type: String,
    },
    trackers: {
      type: Array,
      default: () => [],
    },
    events: {
      type: Array,
      default: () => [],
    },
    terminalIds: {
      type: Array,
      default: () => [],
    },
    terminals: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    isDiff: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.moduleRender();
  },
  methods: {
    onParentObjsChange(v, uuid) {
      const arrs = ["iphone", "android"];

      this.trackers.forEach((tracker) => {
        const text = tracker.terminalName.toLowerCase();

        if (arrs.includes(text) || tracker.uuid === uuid) {
          tracker.parentObjs = v;
        }
      });
    },
    copyEvent() {
      useCopy(
        JSON.stringify(this.$refs.eventRef.eventsEnum?.map((e) => e.code))
      );
    },
    trackerChange(val, oldVal) {
      const androidObj = { 10: true, 11: true };

      if (androidObj[val] && oldVal === 12) {
        this.tracker.parentObjs.length = 0;
        this.tracker.parentObjs = [];
        message.warning("已清空web端血缘配置，其他参数保持不变");
      }

      if (val === 12 && androidObj[oldVal]) {
        this.tracker.parentObjs.length = 0;
        this.tracker.parentObjs = [];
        message.warning("已清空android/iphone端血缘配置，其他参数保持不变");
      }
    },
  },
  watch: {
    "tracker.terminalId": {
      handler: "trackerChange",
      immediate: true,
    },
  },
});
</script>

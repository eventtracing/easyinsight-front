<template>
  <div class="flex g-mt-16" :class="[tabMode ? 'tab-mode' : 'g-pl-8']">
    <div class="g-mr-16" style="flex: none; color: #102048">终端与全局公参</div>
    <div>
      <div
        v-for="(item, index) in trackers"
        :key="item.uuid"
        class="flex-ac g-mb-12"
      >
        <TerminalConfigItem
          :operatorChangeType="operatorChangeType"
          :formState="formState"
          :obj="newObj"
          :form="form"
          :item="item"
          :trackers="trackers"
          :tabMode="tabMode"
          :eventEmitter="eventEmitter"
          :terminalIds="terminalIds"
          :terminals="terminals"
          :requires="requires"
          :events="events"
          :disabled="disabled"
          :index="index"
          :isDetail="isDetail"
          @terminalChange="onTerminalChange"
          @add="onAdd"
          :isAdd="isAdd"
          v-bind="$attrs"
        ></TerminalConfigItem>
      </div>
    </div>
    <div v-if="isDiff" style="margin-left: 200px">
      <div>操作类型</div>
      <div v-for="(value, key) in diffColors" :key="key">
        <span class="diff-span" :style="{ backgroundColor: value }"></span
        >{{ key }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TerminalConfigItem from "./TerminalConfigItem.vue";
import { RequirementDto, ReqStatusEnum } from "@/types/requirement.type";
import { v4 as uuidv4 } from "uuid";
import { diffColors } from "@/utils/vars";
import { EventEmitter } from "eventemitter3";

export default defineComponent({
  name: "TerminalConfigForm",
  components: {
    TerminalConfigItem,
  },

  setup() {
    const _eventEmitter = new EventEmitter();

    return { eventEmitter: _eventEmitter };
  },

  props: {
    form: {},
    operatorChangeType: {
      // 需求池里是否是操作类型是变更
      type: Boolean,
      default: false,
    },
    formState: {
      type: Object,
      default: () => ({}),
    },
    newObj: {},
    events: {
      type: Array,
      default: () => [],
    },
    trackers: {
      default: () => [],
    },
    terminalIds: {
      default: () => [],
    },
    terminals: {
      default: () => [],
    },
    tabMode: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isAdd: {
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

  data() {
    const _requires: RequirementDto[] = [];
    return {
      requires: _requires,
      diffColors,
    };
  },

  methods: {
    onTerminalChange() {
      this.$emit("terminalChange");
    },
    onAdd() {
      if (this.trackers.length === 4) return;

      this.trackers.push({
        uuid: uuidv4(),
        terminalId: undefined,
        terminalName: "",
        requireId: undefined,
        taskId: undefined,
        eventIds: this.events
          .filter((v) => v.selectedByDefault)
          .map((v) => v.id),
        parentObjs: [],
        paramBinds: [],
        status: ReqStatusEnum.START,
      });
    },
  },
});
</script>

<style scoped>
.diff-span {
  display: inline-block;
  height: 15px;
  width: 60px;
  margin-right: 10px;
}
</style>

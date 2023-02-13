<template>
  <div
    class="flex-c"
    :style="{ background: diffColors[item.pubParamPackageIdDiff] }"
  >
    <a-form-item
      class="g-mr-16"
      style="margin-bottom: 0"
      :name="`tracker-terminal-${item.uuid}`"
      v-if="!tabMode"
    >
      <div class="c-mock__select" v-if="isDetail">
        <div style="line-height: 32px; color: #a9a9b8">
          {{ currentTerminal }}
        </div>
      </div>
      <a-select
        class="tracker-terminal"
        placeholder="请选择终端"
        :getPopupContainer="$getPopupContainer"
        :disabled="disabled || operatorChangeType"
        @change="onTerminalChange($event, item)"
        v-model:value="item.terminalId"
        v-else
      >
        <a-select-option
          v-for="t in terminals"
          :key="t.id"
          :value="t.id"
          :title="t.name"
          :disabled="terminalIds.includes(t.id)"
        >
          {{ t.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <div class="g-mr-8" v-else>{{ terminalName }}</div>
    <div class="g-mr-8 flex-c" v-if="!hideGlobalParam">
      <span class="text-main" :class="isDetail ? 'c-mock__label' : ''"
        >全局公参:</span
      >
      <div
        class="text-link g-ml-8 g-mr-8"
        style="min-width: 80px"
        @click="onViewParam($get(globalParams, 'globalPublicParam.params', []))"
        v-if="isDetail && !fromReqEventStatus"
      >
        {{ (list.find((v) => v.id === item.pubParamPackageId) || {}).name }}
      </div>
      <a-form-item
        v-else
        class="g-ml-8 g-mr-8"
        style="margin-bottom: 0"
        label=""
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        :name="`globalParams-${item.uuid}`"
      >
        <a-select
          placeholder="请选择全局公参"
          style="width: 150px"
          :disabled="disabled && !fromReqEventStatus"
          @change="changeTerminalId"
          v-model:value="item.pubParamPackageId"
        >
          <a-select-option
            v-for="t in list"
            :key="t.id"
            :value="t.id"
            :title="t.name"
          >
            {{ t.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <span
        class="text-link"
        @click="onViewParam($get(globalParams, 'globalPublicParam.params', []))"
        v-if="!isDetail"
      >
        查看详情
      </span>
    </div>
    <div class="g-ml-16 flex-c" v-if="!tabMode && !disabled">
      <u-icon-button
        iconFont="remove"
        style="font-size: 18px"
        title="移除"
        v-if="trackers.length > 1"
        @click="onRemove(item.uuid)"
      ></u-icon-button>
      <u-icon-button
        iconFont="plus"
        style="font-size: 22px"
        title="增加"
        @click="$emit('add')"
        v-if="$attrs.index === trackers.length - 1"
      ></u-icon-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TrackerCreateParam, ParamWithValueItemDto } from "@/types/object.type";
import { TaskDto } from "@/types/requirement.type";
import { diffColors } from "@/utils/vars";
import {
  getVersionList,
  getVersionParamDetail,
} from "@/services/version.service";
import ParamTableModal from "../detail/ParamTableModal.vue";

enum Terminals {
  Andriod = 4,
  Iphone = 3,
}
export default defineComponent({
  name: "TerminalConfigItem",
  props: {
    form: {},
    obj: {},
    formState: {},
    fromReqEventStatus: {
      type: Boolean,
      default: false,
    }, // 从event埋点过来的状态
    eventEmitter: {},
    operatorChangeType: {
      // 需求池里是否是操作类型是变更
      type: Boolean,
      default: false,
    },
    terminalName: {
      type: String,
      default: "",
    },
    isAdd: {
      default: false,
    },
    hideGlobalParam: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    trackers: {
      type: Array,
      default: () => [],
    },
    terminalIds: {
      default: () => [],
    },
    tabMode: {
      type: Boolean,
      default: false,
    },
    terminals: {},
    events: {},
    requires: {},
    disabled: {
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentTerminal() {
      return (this.terminals.find((v) => v.id === this.item.terminalId) || {})
        .name;
    },

    currentEvents() {
      return this.events.filter((v) => this.item.eventIds.includes(v.id));
    },

    IphoneAndAndriodTerminal() {
      return (
        this.item.terminalId === Terminals.Andriod ||
        this.item.terminalId === Terminals.Iphone
      );
    },
  },

  data() {
    const _tasks: TaskDto[] = [];
    const _list = [];
    const _globalParams: any = {
      globalPublicParam: {},
      list: [],
      eventParam: [],
    };
    // @ts-ignore
    const uuid = this.item.uuid;
    const _rules = {
      // @ts-ignore
      [`tracker-terminal-${uuid}`]: [
        { required: true, message: "此字段为必填字段" },
      ],
      [`globalParams-${uuid}`]: [{}],
      [`tracker-req-${uuid}`]: [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
      [`tracker-task-${uuid}`]: [
        { required: true, message: "此字段为必填字段" },
      ],
    };
    return {
      list: _list,
      globalParams: _globalParams,
      rules: _rules,
      diffColors: diffColors,
    };
  },
  async created() {
    this.hideGlobalParam &&
      this.eventEmitter.on(`item-${this.item.uuid}`, this.selectRNTask);

    this.getGlobalParams();
    this.getInitialValue();
  },

  methods: {
    getInitialValue() {
      this.formState[`tracker-req-${this.item.uuid}`] = this.item.requireId;
      this.formState[`tracker-task-${this.item.uuid}`] = this.item.taskId;
    },
    getEventsParams(event) {
      const cEvent =
        this.globalParams.eventParam.find((v) => v.id === event.id) || {};

      return cEvent;
    },

    onViewParam(list: ParamWithValueItemDto[]) {
      if (this.item.terminalId) {
        getVersionParamDetail({
          entityId: this.item.terminalId,
          entityType: 1,
          versionId: this.item.pubParamPackageId,
        }).then((res) => {
          this.$createInstance(ParamTableModal, {
            list: res,
            fromObject: true,
          });
        });
      }
    },

    getGlobalParams() {
      if (!this.item.terminalId) return;

      getVersionList({ entityId: this.item.terminalId, entityType: 1 }).then(
        (res) => {
          const defaultParams: any =
            (res || []).find((v: any) =>
              this.item.pubParamPackageId
                ? this.item.pubParamPackageId === v.id
                : v.currentUsing
            ) || {};

          this.list = res;
          this.item.pubParamPackageId = defaultParams.id;
          this.$forceUpdate();
        }
      );
    },

    changeTerminalId(id) {
      this.item.pubParamPackageId = id;
    },

    onTerminalChange(v, item: TrackerCreateParam) {
      this.$emit("terminalChange");
    },

    triggerSelectRN(currentTask, isSetFields) {
      const { requirementId, id, refTaskId } = currentTask;
      const terminals = this.trackers.filter((v) => v.uuid !== this.item.uuid);

      terminals.forEach((t) => {
        this.eventEmitter.emit(
          `item-${t.uuid}`,
          requirementId,
          id,
          refTaskId,
          isSetFields
        );
      });
    },
    onRemove(uuid: string) {
      const idx = this.trackers.findIndex((v) => v.uuid === uuid);

      this.trackers.splice(idx, 1);
      this.$emit("terminalChange", this.trackers);
    },
  },
  watch: {
    "item.terminalId"() {
      this.getGlobalParams();
    },
  },
});
</script>

<style lang="less" scoped="true">
.tracker-terminal {
  width: 150px;
}
.tracker-req {
  width: 200px;
}
.tracker-task {
  width: 200px;
}
.tracker-events {
  width: 300px;
}
.c-mock__select {
  min-width: 120px;
  max-width: 300px;
  padding: 0 10px;
  min-height: 32px;
}
.c-mock__option {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  height: 80%;
  padding: 10px;
  color: #a9a9b8;
}
.c-mock__label {
  color: #a9a9b8;
}
.text-main {
  flex: none;
  color: #000;
}
</style>

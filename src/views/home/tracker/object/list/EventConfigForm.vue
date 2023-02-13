<template>
  <div class="flex-1">
    <a-form-item
      style="margin-bottom: 16px"
      v-if="!isDetail && showAllEvents"
      :name="`tracker-events-${item.uuid}`"
    >
      <a-select
        class="tracker-events"
        :disabled="disabled"
        placeholder="请选择事件类型"
        allowClear
        :options="optionEvents"
        mode="multiple"
        :tagRender="isDiff ? tagRender : null"
        option-filter-prop="label"
        :getPopupContainer="$getPopupContainer"
        @change="($event) => onEventChange($event, item.uuid)"
        v-model:value="item.eventIds"
      >
      </a-select>
    </a-form-item>
    <div class="g-mb-16" v-for="event in eventsEnum" :key="event.id">
      <div
        class="flex g-mb-16"
        style="align-items: center"
        :style="{ backgroundColor: diffColors[event.diffType] || '' }"
      >
        <span class="g-mr-24 g-mt-4">{{ event.code }}({{ event.name }})</span>
        <span class="g-mr-8 g-mt-4 text-main">版本:</span>
        <span class="g-mt-4" v-if="isDetail">
          {{
            (
              (event.versionLists || []).find((v) => v.id === event.version) ||
              {}
            ).name
          }}
        </span>
        <a-select
          placeholder="请选择公参版本"
          :value="event.version"
          @change="(version) => changeVersion(version, event)"
          style="width: 200px"
          :disabled="disabled"
          v-else
        >
          <a-select-option
            v-for="t in event.versionLists"
            :key="t.id"
            :value="t.id"
            :title="t.name"
          >
            {{ t.name }}
          </a-select-option>
        </a-select>
        <u-text-button
          v-if="isDetail"
          style="position: absolute; right: 0"
          :on-click="() => copyEventParam(event.versionParams || [])"
        >
          <a-tooltip>
            <template #title>复制事件公参</template>
            <CopyOutlined :style="{ fontSize: '18px' }" />
          </a-tooltip>
        </u-text-button>
      </div>
      <ParamTableList
        :fromObject="true"
        :list="event.versionParams || []"
      ></ParamTableList>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, h } from "vue";
import {
  getVersionList,
  getVersionParamDetail,
} from "@/services/version.service";
import ParamTableList from "../detail/ParamTableList.vue";
import useCopy from "hooks/useCopy";
import { diffColors } from "@/utils/vars";
import { CopyOutlined } from "@ant-design/icons-vue";
import useCopyParams from "hooks/useCopyParams";

export default defineComponent({
  name: "EventConfigForm",
  components: {
    ParamTableList,
    CopyOutlined,
  },
  setup(props) {
    return {
      optionEvents: computed(() => {
        // @ts-ignore
        return props.events?.map((t) => ({
          label: `${t.code}（${t.name}）`,
          value: t.id,
        }));
      }),
    };
  },
  props: {
    showAllEvents: {
      default: true,
    },
    disabled: {
      default: false,
      required: false,
    },
    isDetail: {
      default: false,
      required: false,
    },
    item: {},
    trackers: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    trackerKey: {},
    events: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    obj: {
      type: Object,
      default: () => ({}),
    },
    isDiff: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    eventsEnum(): any {
      return this.events
        .filter(
          (e: any) =>
            (this.item.eventIds || []).includes(e.id) ||
            (this.item.eventParam || []).some((v) => v.eventName === e.name)
        )
        .map((v) => ({ ...v, versionLists: v.versionLists || [] }));
    },
  },

  data() {
    const _rules = {
      // @ts-ignore
      [`tracker-events-${this.item.uuid}`]: [
        {
          rules: [
            {
              required: true,
              message: "此字段为必填字段",
            },
          ],
        },
      ],
    };

    return { rules: _rules, diffColors };
  },

  created() {
    this.moduleRender();
    this.getVersionLists(this.eventsEnum);
  },

  methods: {
    copyEventParam(params: any[]) {
      useCopy(useCopyParams(params));
    },
    onEventChange(v, uuid) {
      const terminals = ["iphone", "android"];

      this.trackers.forEach((tracker) => {
        const { terminalName } = tracker;

        if (
          tracker.uuid === uuid ||
          terminals.includes(terminalName?.toLowerCase())
        ) {
          tracker.eventIds = v;
        }
      });
    },

    changeVersion(version, event) {
      const selectedTracker = this.trackers.find(
        (item) => item.uuid === this.trackerKey
      );

      event.version = version;

      !selectedTracker.eventParamsVersionIdMap &&
        (selectedTracker.eventParamsVersionIdMap = {});
      selectedTracker.eventParamsVersionIdMap[event.id] = version;

      getVersionParamDetail({
        entityId: event.id,
        entityType: 2,
        versionId: version,
      }).then((res) => {
        event.versionParams = res;

        this.$forceUpdate();
      });
    },

    getVersionLists(eventsEnum) {
      const list = eventsEnum.map((event) =>
        getVersionList({
          entityId: event.id,
          entityType: 2,
        })
      );

      Promise.allSettled(list).then((res: any) => {
        res.forEach((data, index) => {
          const { status, value } = data;

          if (status === "fulfilled") {
            const key = this.eventsEnum[index]?.id;

            this.eventsEnum[index].versionLists = value;

            const version =
              this.item.eventParamVersionIdMap?.[key] ||
              value.find((v) => v.currentUsing)?.id;

            this.eventsEnum[index].version = version;

            version && this.changeVersion(version, this.eventsEnum[index]);
          }
        });

        this._.update();
      });
    },
    tagRender(args) {
      const { label = "", value } = args;
      const selectedTracker =
        this.trackers?.find((item) => item.uuid === this.trackerKey) || {};

      const { eventParamVersionDiff = {} } = selectedTracker;
      const diffType = eventParamVersionDiff[value] || "";
      const spanProps = {
        style: {
          border: "1px solid #ccc",
          padding: "3px",
          "margin-right": "5px",
          "background-color": diffColors[diffType],
        },
      };

      return h("span", spanProps, label);
    },
  },
  watch: {
    eventsEnum: {
      handler: "getVersionLists",
    },
  },
});
</script>

<style scoped="true">
.text-main {
  color: #000;
}
</style>

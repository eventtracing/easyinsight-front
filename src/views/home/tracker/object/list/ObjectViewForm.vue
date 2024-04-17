<template>
  <a-form
    v-if="editObj"
    class="small-12"
    style="padding-left: 0"
    :colon="false"
    labelAlign="left"
    ref="formRef"
  >
    <div>
      <transition name="opacitys">
        <BaseInfoForm
          v-if="defferMoule > 10"
          :obj="editObj"
          :events="events"
          :disabled="true"
          :isDetail="true"
        ></BaseInfoForm>
        <u-spinner v-else></u-spinner>
      </transition>
    </div>
    <TerminalConfigForm
      :disabled="true"
      :form="form"
      :newObj="{}"
      :events="events"
      :trackers="editObj.trackers"
      :terminalIds="terminalIds"
      :terminals="terminals"
      :hideGlobalParam="false"
      :isDetail="true"
    ></TerminalConfigForm>
    <div class="g-pl-12">
      <a-form-item
        label="其他项配置模式"
        style="width: 1000px"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 20 }"
      >
        Android/iPhone是否一致: &nbsp;{{ editObj.consistency ? "是" : "否" }}
      </a-form-item>
    </div>
    <div style="position: relative; min-height: 500px">
      <transition name="opacitys">
        <a-tabs type="card" v-if="defferMoule > 20">
          <a-tab-pane
            v-for="item in tabTrackers"
            :key="item.uuid"
            :tab="item.terminalName"
          >
            <TrackerConfigPane
              :obj="editObj"
              :isDetail="true"
              :terminalIds="terminalIds"
              :form="form"
              :events="events"
              :tracker="item"
              :disabled="true"
              :trackers="editObj.trackers"
              :reqPoolId="reqPoolId"
              :fromObjectManage="fromObjectManage"
              :terminalId="terminalId"
            ></TrackerConfigPane>
          </a-tab-pane>
        </a-tabs>
        <u-spinner v-else></u-spinner>
      </transition>
    </div>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import BaseInfoForm from "./BaseInfoForm.vue";
import TerminalConfigForm from "./TerminalConfigForm.vue";
import TrackerConfigPane from "./TrackerConfigPane.vue";
import { EditTempObjDto, ObjDetailDto } from "@/types/object.type";
import { EventSimpleDto } from "@/types/event.type";
import { getHistoryObjectDetail } from "@/services/object.service";
import { getEventList } from "@/services/event.service";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import { getTerminalList } from "@/services/terminal.service";

export default defineComponent({
  name: "ObjectViewForm",
  components: {
    BaseInfoForm,
    TerminalConfigForm,
    TrackerConfigPane,
  },
  props: {
    id: {},
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    historyId: {
      type: [Number, String] as PropType<number | string>,
    },
    trackerId: {},
    requireId: {},
    terminalId: {},
    fromObjectManage: {
      default: false,
      required: false,
      type: Boolean as PropType<boolean>,
    },
    conditions: {
      default: null,
    },
  },
  computed: {
    terminalIds() {
      return this.editObj.trackers.map((v) => v.terminalId).filter((v) => !!v);
    },

    requireIds() {
      return this.editObj.trackers.map((v) => v.requireId).filter((v) => !!v);
    },

    formRef() {
      return this.$refs.formRef;
    },

    tabTrackers() {
      const trackers = this.editObj.trackers
        .filter((item) => item.terminalName)
        .filter((item) => Number(item.terminalId) === Number(this.terminalId));
      const terminalMap: string[] = ["android", "iphone"];

      let hasCompact = false;

      if (!this.editObj.consistency) return trackers;

      return trackers.reduce((prev, next) => {
        next.terminalName = next.name || next.terminalName;
        if (terminalMap.includes(next.terminalName.toLowerCase())) {
          next.name = next.terminalName;
          if (hasCompact) return prev;
          next.terminalName = "Android/iPhone";
          prev.push(next);

          hasCompact = true;
        } else {
          next.terminalName = next.name || next.terminalName;
          prev.push(next);
        }

        return prev;
      }, []);
    },
  },

  data() {
    const _form = null;
    const _detail: ObjDetailDto = null;
    const _editObj: EditTempObjDto = null;
    const _events: EventSimpleDto[] = [];

    return {
      form: _form,
      detail: _detail,
      editObj: _editObj,
      events: _events,
      terminals: [],
    };
  },

  created() {
    this.initData();

    getTerminalList({ currentPage: 1, pageSize: 50, search: "" }).then(
      (res) => {
        this.terminals = res.list;
      }
    );
  },
  methods: {
    async initData(conditions = this.conditions) {
      this.defferMoule = 0;
      this.moduleRender();
      this.form = this.formRef;
      try {
        this.detail = await getHistoryObjectDetail({
          objId: this.id,
          reqPoolId: this.reqPoolId,
          ...(this.historyId
            ? {
                historyId: this.historyId,
              }
            : this.trackerId
            ? {
                trackerId: this.trackerId,
              }
            : {
                reqPoolId: this.reqPoolId,
              }),
        });
      } catch (err) {
        this.detail = {};
      } finally {
        this.initOptions();
      }
    },
    initOptions() {
      const {
        type,
        oid,
        name,
        description,
        imgUrls,
        consistency,
        trackers = [],
        tags,
        priority,
        routePaths = [],
      } = this.detail;

      const resolvedTrackers = trackers.map((item) => {
        const {
          terminalVersion, // 端版本
          eventParamVersionIdMap, // 事件公参版本Map
          pubParamPackageId, // 全局公参参数包ID
          pubParamPackageIdDiff,
          terminal, // 终端
          events, // 关联事件
          parentObjects, // 父级
          privateParam, // 私参
          status,
        } = item as any;
        return {
          terminalVersion,
          eventParamVersionIdMap,
          uuid: uuidv4(),
          id: item.id,
          terminalId: terminal.id,
          terminalName: terminal.name,
          requireId: this.reqPoolId,
          pubParamPackageId,
          pubParamPackageIdDiff,
          eventIds: events.map((v) => v.id),
          parentObjs: parentObjects.map((v) => v.id),
          paramBinds: cloneDeep(privateParam || []).map((v) => ({
            ...v,
            uuid: uuidv4(),
          })),
          status: status,
        };
      });
      this.editObj = {
        id: this.id,
        type: type,
        oid: oid,
        name: name,
        description: description,
        imgUrls: imgUrls || [],
        tags: tags,
        priority: priority,
        consistency: consistency,
        paramBinds: [],
        parentObjs: [],
        trackers: resolvedTrackers,
        routePathIds: routePaths,
      };

      if (consistency && resolvedTrackers.length) {
        this.editObj.parentObjs = cloneDeep(resolvedTrackers[0].parentObjs);
        this.editObj.paramBinds = cloneDeep(
          resolvedTrackers.find(
            (item) => Number(item.terminalId) === this.terminalId
          )?.paramBinds
        );
      }

      this.$emit("getObjImage", imgUrls, resolvedTrackers);

      getEventList({ currentPage: 1, pageSize: 80, search: "" }).then((res) => {
        this.events = res.list;
      });
    },
  },
});
</script>

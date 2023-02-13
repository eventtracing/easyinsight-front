<template>
  <u-drawer
    title="对象详情"
    width="75vw"
    :class="fromObjectManage && activeKey === 3 ? 'c-object__container' : ''"
    :visible="true"
    :maskClosable="true"
    @handlerClose="handleClose"
  >
    <template #title
      ><div class="flex-ac">
        <span style="flex: none">对象详情</span>
        <a-tag class="g-ml-8" color="orange" v-if="record.isReuse">
          复用对象
        </a-tag>
        <status-tag
          :status="record.status"
          v-if="record.id && !fromObjectManage && !fromRequirePool"
        ></status-tag>
        <template v-if="spmContent.length">
          <a-tooltip placement="top">
            <template #title>
              <span v-html="getSpmContent"></span>
            </template>
            <div class="flex-1 flex-ac">
              <div
                class="g-ml-8"
                ref="spm"
                v-ellipsis-title
                style="
                  color: rgb(169, 169, 184);
                  font-weight: normal;
                  font-size: 14px;
                "
                v-html="getSpmContent"
              ></div>
              <icon-font
                title="复制"
                class="icon-copy"
                type="icon-fuzhi"
                @click="copySpm"
              ></icon-font>
            </div>
          </a-tooltip>
        </template></div
    ></template>
    <div>
      <div class="g-position" v-if="reqPoolId || fromObjectManage">
        <TopFilter
          class="c-top__filter"
          :id="id"
          :conditions="filterConditions"
          :reqPoolId="reqPoolId"
          @change="onFilterChange"
          :fromObjectManage="fromObjectManage"
          :fromRequirePool="fromRequirePool"
          v-show="fromRequirePool && activeKey === 2"
        ></TopFilter>
        <a-tabs
          :animated="false"
          style="margin-top: -16px"
          @change="(key) => (activeKey = key)"
        >
          <a-tab-pane :key="1" tab="对象信息">
            <ObjectViewForm
              ref="viewForm"
              :id="id"
              :reqPoolId="reqPoolId"
              :historyId="historyId"
              :trackerId="trackerId"
              :conditions="filterConditions"
              :fromObjectManage="fromObjectManage"
              :terminalId="terminalId"
              @getObjImage="getObjImage"
            ></ObjectViewForm>
          </a-tab-pane>
          <a-tab-pane :key="2" tab="血缘关系">
            <div style="height: calc(100vh - 150px)">
              <LineageTab
                :id="id"
                :conditions="filterConditions"
                :objImage="objImage"
                :reqPoolId="reqPoolId"
                :releasedId="conditions.versionIds"
                :fromObjectManage="true"
                v-if="fromObjectManage"
              ></LineageTab>
              <ObjectViewLineage
                :trackerId="trackerId"
                :terminalId="terminalId"
                :reqPoolId="reqPoolId"
                :id="id"
                :objImage="objImage"
                :releasedId="conditions.versionIds"
                v-else
              ></ObjectViewLineage>
            </div>
          </a-tab-pane>
          <a-tab-pane :key="3" tab="样例数据" v-if="fromObjectManage">
            <div style="height: calc(100vh - 150px)">
              <sample-data :id="id" :conditions="filterConditions" />
            </div>
          </a-tab-pane>
          <a-tab-pane :key="4" tab="版本历史" v-if="fromObjectManage">
            <div style="height: calc(100vh - 150px)">
              <HistoryList
                :releasedId="releasedId"
                :reqPoolId="reqPoolId"
                :terminalId="terminalId"
                :objId="id"
              />
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template v-else>
        <ObjectViewForm
          :reqPoolId="reqPoolId"
          :id="id"
          :historyId="historyId"
          :terminalId="terminalId"
        ></ObjectViewForm>
      </template>
      <drawer-footer v-if="record.status < 6 && record.id">
        <span></span>
        <template #right v-if="!isList">
          <a-button
            danger
            ghost
            v-if="record.status > 1"
            @click="onWithdraw"
            :loading="loading"
            >撤回</a-button
          >
          <a-button
            class="g-ml-8"
            @click="onOperate()"
            v-if="record.status < 5"
            :loading="loading"
          >
            {{ taskOperateTextMap[record.status] }}
          </a-button>
        </template>
      </drawer-footer>
      <ObjectEditDrawer
        :task="task"
        :reqPoolId="reqPoolId"
        :isList="isList"
        :id="record.objId"
        :historyId="record.historyId || null"
        :record="record"
        :visible="visible"
        :spm="spm"
        :disabled="
          record.relObjMaxStatus !== ReqStatusEnum.START &&
          record.relObjMaxStatus !== ReqStatusEnum.WAIT_VRFY
        "
        :getUpdatedData="updateWatcher"
        fromView=""
        @handlerClose="visible = false"
        @ok="updateRecord"
      ></ObjectEditDrawer>
    </div>
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import LineageTab from "../detail/LineageTab.vue";
import ObjectViewForm from "./ObjectViewForm.vue";
import ObjectViewLineage from "./ObjectViewLineage.vue";
import HistoryList from "./HistoryList.vue";
import TopFilter from "../detail/ParamConfigFilter.vue";
import {
  TaskRelObjDto,
  taskOperateTextMap,
  ReqStatusEnum,
} from "@/types/requirement.type";
import { getSpm } from "@/services/object.service";
import ObjectEditDrawer from "./ObjectEditDrawer.vue";
import { forwardTaskData, backTaskData } from "@/services/requirement.service";
import StatusTag from "../../requirement/components/StatusTag.vue";

import SampleData from "./SampleData.vue";

interface FilterDto {
  terminalId: number;
  versionId?: number;
}

export default defineComponent({
  name: "ObjectViewDrawer",
  components: {
    ObjectViewForm,
    ObjectEditDrawer,
    ObjectViewLineage,
    StatusTag,
    LineageTab,
    TopFilter,
    HistoryList,
    SampleData,
  },

  setup(props) {
    const _taskOperateTextMap = taskOperateTextMap;
    const _ReqStatusEnum = ReqStatusEnum;
    const { terminalIds, versionIds } = props.conditions;
    const terminalId = ref(terminalIds);
    const versionId = ref(versionIds);

    return {
      taskOperateTextMap: _taskOperateTextMap,
      ReqStatusEnum: _ReqStatusEnum,
      terminalId,
      versionId,
      resolvedTrackers: [],
      spmContent: props.spm,
      loading: ref<boolean>(false),
    };
  },

  props: {
    id: {},
    releasedId: {},
    from: {
      type: String,
      default: "",
      required: false,
    },
    record: {
      default: () => ({}),
    },
    task: {
      default: () => ({}),
    },
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    trackerId: {},
    historyId: {
      type: [String, Number],
    },
    getUpdatedData: {},
    spm: {
      default: () => [],
    },
    isList: {
      default: false,
    },
    conditions: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    filterConditions() {
      return {
        terminalId: this.terminalId,
        releaseId: this.releasedId,
      };
    },

    viewFormRef() {
      const viewFormRef: any = this.$refs.viewForm;
      return viewFormRef;
    },

    fromObjectManage() {
      return this.from === "objectManage";
    },

    fromRequirePool() {
      return this.from === "requirementPool";
    },
  },
  data() {
    const _objImage: any = [];
    const _visible = false;

    return {
      objImage: _objImage,
      visible: _visible,
      activeKey: "1",
      getSpmContent: "",
    };
  },
  created() {
    if (!this.spm.length) return;

    getSpm(this.spm).then((res) => {
      this.getSpmContent = res;
    });
  },
  methods: {
    async onFilterChange(conditions: FilterDto, init = false) {
      if (this.reqPoolId || this.fromObjectManage) {
        const { terminalId } = conditions;

        terminalId && (this.terminalId = terminalId);
      }

      !init && (this.spmContent = "");
    },
    copySpm() {
      const input = document.createElement("input");
      document.body.appendChild(input);

      input.setAttribute("value", this.getSpmContent);
      input.select();

      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$message.success("复制成功~");
      } else {
        this.$message.error("复制失败~");
      }

      document.body.removeChild(input);
    },
    updateWatcher(...rest) {
      const promise = this.getUpdatedData.apply(null, rest);

      return promise.then((res) => res);
    },
    getObjImage(image, resolvedTrackers) {
      this.objImage = image;
      this.resolvedTrackers = resolvedTrackers;
    },
    async onOperate(record: TaskRelObjDto = this.record) {
      const operate = () => {
        this.loading = true;

        forwardTaskData(record.id)
          .then(() => {
            this.$message.success("操作成功");
            if (!this.getUpdatedData) return;

            const updateRecordPromise = this.getUpdatedData(
              this.task,
              undefined,
              "drawer"
            );

            updateRecordPromise.then(() => {
              this.record.status++;
            });
          })
          .finally(() => {
            this.loading = false;
          });
      };

      operate();
    },
    // 对象状态回撤
    onWithdraw() {
      this.loading = true;

      backTaskData(this.record.id)
        .then(() => {
          this.$message.success("撤回成功");
          const updateRecordPromise = this.getUpdatedData(
            this.task,
            undefined,
            "drawer"
          );

          updateRecordPromise.then((res) => {
            this.record.status--;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updateRecord() {
      this.$nextTick().then(() => {
        this.viewFormRef.$options.created.forEach((hook) =>
          hook.call(this.viewFormRef)
        );
        this.visible = false;
      });
    },
    handleClose() {
      this.$emit("handlerClose");
    },
    showEdit() {
      this.visible = true;
    },
  },
});
</script>

<style scoped="true" lang="less">
.c-object__container .ant-tabs {
  overflow: unset;
}
.icon-copy {
  font-size: 14px;
  color: rgb(169, 169, 184);
  margin-left: 8px;
  flex: none;
}
.c-top__filter {
  position: absolute;
  right: 6px;
  top: 7px;
  z-index: 10;
}
.c-object__container .c-top__filter {
  right: 30px;
  top: 15px;
}
.c-object__container .g-position {
  overflow-y: auto;
  padding: 24px;
}
.g-position {
  position: relative;
}
</style>

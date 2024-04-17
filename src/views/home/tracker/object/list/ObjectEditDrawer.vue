<template>
  <u-drawer
    width="75vw"
    :visible="visible"
    @handlerClose="handleClose"
    @handleOk="handleOk"
    :maskClosable="isPreview && !isManager"
    :class="fromObjectManage && activeKey === 3 ? 'c-object__container' : ''"
  >
    <template #title>
      <div class="flex-ac" v-if="!isPreview">
        {{ change ? "变更对象" : "编辑对象" }}
        <span v-html="spmContent" style="margin-left: 5px"></span>
        <icon-font
          title="复制"
          class="icon-copy"
          type="icon-fuzhi"
          @click="copySpm"
          v-if="spmContent"
        ></icon-font>
      </div>
      <div class="flex-ac" v-else>
        <span style="flex: none">对象详情</span>
        <a-tag class="g-ml-8" color="orange" v-if="record.isReuse">
          复用对象
        </a-tag>
        <span v-html="spmContent" style="margin-left: 5px"></span>
        <icon-font
          title="复制"
          class="icon-copy"
          type="icon-fuzhi"
          @click="copySpm"
          v-if="spmContent"
        >
        </icon-font>
      </div>
    </template>
    <div class="g-position">
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
          <ObjectEditForm
            class="g-bottom-padding"
            ref="object-edit-form"
            :id="id"
            :record="record"
            :trackerId="trackerId"
            :reqPoolId="reqPoolId"
            :disabled="disabled"
            :operatorChangeType="operatorChangeType"
            :historyId="historyId"
            :isChange="change"
            :isPreview="isPreview"
            :isDiff="isDiff"
            :partEditAuth="partEditAuth"
            @handlerOk="$emit('handlerOk')"
            @initDetailData="initData"
            @refresh="refreshTable"
          ></ObjectEditForm>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="血缘关系" v-if="isPreview">
          <div style="height: calc(100vh - 150px)">
            <LineageTab
              :conditions="filterConditions"
              :id="id"
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
        <a-tab-pane
          :key="3"
          tab="样例数据"
          v-if="(fromObjectManage || showSampleData) && isPreview"
        >
          <div style="height: calc(100vh - 150px)">
            <sample-data :record="record" />
          </div>
        </a-tab-pane>
        <a-tab-pane
          :key="4"
          tab="版本历史"
          v-if="fromObjectManage && isPreview"
        >
          <div style="height: calc(100vh - 150px)">
            <HistoryList
              :releasedId="releasedId"
              :reqPoolId="reqPoolId"
              :terminalId="terminalId"
              :objId="id"
            />
          </div>
        </a-tab-pane>
        <a-tab-pane :key="5" tab="标签配置">
          <TagSettingVue :formData="tagFormData" :isPreview="isPreview" />
        </a-tab-pane>
      </a-tabs>
    </div>

    <drawer-footer
      @close="handleClose"
      @ok="handleOk"
      :loading="loading"
      v-if="!isPreview"
    >
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
      <template
        #center
        v-if="disabled && record.status < record.relObjMaxStatus"
      >
        <span class="g-ml-8" style="color: red">
          该对象存在SPM状态流转至已审核或以后，参数和血缘等信息不支持编辑
        </span>
      </template>
    </drawer-footer>

    <drawer-footer v-if="isPreview && record.status < 6 && record.id">
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

    <drawer-footer
      @close="handleClose"
      @ok="handlePartSubmit"
      v-if="isPreview && isManager"
    />
  </u-drawer>
</template>

<script lang="tsx">
/**
 * 编辑对象弹层
 */

import { defineComponent, PropType, ref } from "vue";
import ObjectEditForm from "./ObjectEditForm.vue";
import LineageTab from "../detail/LineageTab.vue";
import ObjectViewLineage from "./ObjectViewLineage.vue";
import HistoryList from "./HistoryList.vue";
import SampleData from "../../requirement/components/sample-data/index.vue";
import TopFilter from "../detail/ParamConfigFilter.vue";
import TagSettingVue from "./TagSetting.vue";

import {
  TaskRelObjDto,
  taskOperateTextMap,
  ReqStatusEnum,
} from "@/types/requirement.type";
import { forwardTaskData, backTaskData } from "@/services/requirement.service";
import { getAuthUserList } from "@/services/auth.service";

interface FilterDto {
  terminalId: number;
  versionId?: number;
}

export default defineComponent({
  name: "ObjectEditDrawer",
  components: {
    ObjectEditForm,
    ObjectViewLineage,
    LineageTab,
    HistoryList,
    TagSettingVue,
    SampleData,
    TopFilter,
  },

  setup(props) {
    const _taskOperateTextMap = taskOperateTextMap;
    const { terminalIds, versionIds } = props.conditions;
    const terminalId = ref(terminalIds);
    const versionId = ref(versionIds);

    return {
      taskOperateTextMap: _taskOperateTextMap,
      spmContent: props?.record?.spmLink || "",
      terminalId,
      versionId,
      resolvedTrackers: [],
    };
  },
  props: {
    id: {
      type: Number as PropType<number>,
    },
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    operatorChangeType: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    task: {},
    record: {
      type: Object,
      default: () => ({}),
    },
    historyId: {
      type: [Number, String] as PropType<number | string>,
    },
    trackerId: {},
    spm: {
      default: () => [],
    },
    change: {
      type: Boolean,
      default: false,
    },
    isList: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    fromView: {
      type: Boolean,
      default: false,
    },
    from: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isPreview: {
      // 是否是预览态
      type: Boolean,
      default: false,
    },
    showSampleData: {
      // 是否展示样例数据
      type: Boolean,
      default: false,
    },
    conditions: {
      type: Object,
      default: () => ({}),
    },
    releasedId: {},
    getUpdatedData: {},
    isDiff: {
      // 是否展示diff的数据
      type: Boolean,
      default: false,
    },
    refreshTable: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    filterConditions() {
      return {
        terminalId: this.terminalId,
        releaseId: this.releasedId,
      };
    },

    getSpmContent() {
      return this.spm;
    },

    objectChangeForm() {
      const objectChangeForm: typeof ObjectEditForm =
        this.$refs["object-edit-form"];

      return objectChangeForm;
    },

    fromObjectManage() {
      return this.from === "objectManage";
    },

    fromRequirePool() {
      return this.from === "requirementPool";
    },

    partEditAuth() {
      if (!this.isPreview) return false;

      return this.isManager;
    },
  },
  data() {
    return {
      loading: false,
      activeKey: "1",
      objImage: [],
      // 是否有优先级、标签等四个字段的编辑权限，应该是有管理员有这个权限
      isManager: false,
    };
  },

  mounted() {
    this.getPartAuth();
  },
  methods: {
    async onFilterChange(conditions: FilterDto) {
      if (this.reqPoolId || this.fromObjectManage) {
        const { terminalId } = conditions;

        terminalId && (this.terminalId = terminalId);
      }
    },

    async getPartAuth() {
      const appId = localStorage.getItem("appId");
      const user = this.$store.state.user;

      const res = await getAuthUserList({
        roleId: 5,
        range: 2,
        location: appId,
        currentPage: 1,
        pageSize: 1000,
        search: "",
      });

      this.isManager = (res?.list || []).some(
        (item) => item.email === user.email
      );
    },

    copySpm() {
      const input = document.createElement("input");

      document.body.appendChild(input);

      input.setAttribute("value", this.spmContent);
      input.select();

      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$message.success("复制成功~");
      } else {
        this.$message.error("复制失败~");
      }

      document.body.removeChild(input);
    },

    changeDisabled() {
      if (!this.fromView) {
        const error = window.console.error;
        const { relObjMaxStatus } = this.record;

        window.console.error = function () {};

        const flag = ![ReqStatusEnum.START, ReqStatusEnum.WAIT_VRFY].includes(
          relObjMaxStatus
        );

        this.$emit("updateDisabled", flag);

        window.console.error = error;
      }
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
              this.changeDisabled();
              this.handleClose();
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

          updateRecordPromise.then(() => {
            this.record.status--;
            this.$forceUpdate();
            this.changeDisabled();
            this.handleClose();
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleOk(close) {
      const objectChangeForm = this.$refs["object-edit-form"];

      if (objectChangeForm) {
        this.loading = true;

        return objectChangeForm
          .handleOk()
          .then((data) => {
            if (close !== "circulation") {
              this.$emit("ok", data);
            }

            return true;
          })
          .finally(() => {
            this.loading = false;
          });
      }

      return Promise.resolve();
    },

    handleClose() {
      this.$emit("handlerClose");
    },
    getObjImage(image, resolvedTrackers) {
      this.objImage = image;
      this.resolvedTrackers = resolvedTrackers;
    },
    handlePartSubmit() {
      const objectChangeForm = this.$refs["object-edit-form"];

      if (objectChangeForm) {
        this.loading = true;

        return objectChangeForm
          .handlePartSubmit()
          .then(() => true)
          .finally(() => {
            this.loading = false;
          });
      }

      return Promise.resolve();
    },
    initData(detail) {
      const { analyseCid, basicTag, cidTagInfos, tags } = detail;

      this.tagFormData = {
        analyseCid,
        cidTagInfos,
        tags,
        ...basicTag,
      };
    },
  },
});
</script>

<style scoped="true" lang="less">
.g-bottom-padding {
  padding-bottom: 100px;
}

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

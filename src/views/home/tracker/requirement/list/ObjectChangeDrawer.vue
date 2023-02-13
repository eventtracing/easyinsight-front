<template>
  <u-drawer
    title="新建/变更对象"
    width="75vw"
    :visible="true"
    :footer="true"
    @handlerClose="handleClose"
  >
    <a-tabs v-if="viewObjDetail" :animated="false" style="margin-top: -16px">
      <a-tab-pane :key="1" tab="对象信息">
        <ObjectEditForm
          :id="viewObjId"
          :requireId="requireId"
          :reqPoolId="reqPoolId"
          :record="record"
          :isPreview="true"
        />
      </a-tab-pane>
      <a-tab-pane :key="2" tab="血缘关系">
        <div style="height: calc(100vh - 150px)">
          <BloodRelation :id="viewObjId" />
        </div>
      </a-tab-pane>
    </a-tabs>
    <template v-else>
      <a-steps :current="currentStep" size="small" class="g-mb-24">
        <a-step title="选择对象"></a-step>
        <a-step title="新建/变更对象"></a-step>
      </a-steps>
      <ObjectChangeSelect
        v-if="currentStep === 0"
        ref="object-change-select"
        :requireId="requireId"
        :reqPoolId="reqPoolId"
        @viewObj="onViewObj"
        @viewLevel="() => (backToList = true)"
        @next="onNext"
        @oncreatenext="onCreateNext"
        @refresh="handleRefreshData"
      />
      <template v-if="currentStep === 1">
        <ObjectEditForm
          v-if="operateType === 'change'"
          :reqPoolId="reqPoolId"
          :id="changeObjId"
          :requireId="requireId"
          :historyId="changeHistoryId"
          :isChange="true"
          :isPreview="true"
          ref="editRef"
        />
        <ObjectAddForm
          v-else
          :openTerminal="selectedTerminalType"
          :openTerminalId="selectedTerminalId"
          :reqPoolId="reqPoolId"
          :requireId="requireId"
          :parentIds="createObjParentIds"
          ref="createRef"
        />
      </template>
    </template>

    <template #footer="">
      <template v-if="currentStep === 0">
        <a-button @click="handleClose">取消</a-button>
        <a-button
          class="g-ml-4"
          v-if="backToList || viewObjDetail"
          type="primary"
          @click="onBackToList"
        >
          返回原列表
        </a-button>
      </template>
      <template v-else>
        <div class="flex-ac m-footer">
          <a-button @click="handleClose">取消</a-button>
          <div class="">
            <a-button @click="onBack">上一步</a-button>
            <a-button class="g-ml-12" type="primary" @click="handleOk">
              确定
            </a-button>
          </div>
        </div>
      </template>
    </template>
  </u-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  getCurrentInstance,
  defineAsyncComponent,
} from "vue";
import { createInstance } from "@/ndsc-vue3/utils/lib";
import ObjectChangeSelect from "./ObjectChangeSelect.vue";
import ObjectEditForm from "../../object/list/ObjectEditForm.vue";
import ObjectAddForm from "../../object/list/ObjectAddForm.vue";
import BloodRelation from "../../object/list/blood-relation/index.vue";
export default defineComponent({
  name: "ObjectChangeDrawer",
  components: {
    ObjectChangeSelect,
    ObjectEditForm,
    ObjectAddForm,
    BloodRelation,
  },
  props: {
    requireId: {},
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
  },
  setup() {
    const instance = getCurrentInstance();

    return {
      createRef: ref(),
      editRef: ref(),
      instance,
    };
  },
  computed: {
    objectChangeSelect() {
      return this.$refs["object-change-select"];
    },
  },

  data() {
    const _currentStep = 0;
    const _operateType: "change" | "create" = "create";
    const _changeObjId: number = null;
    const _createObjParentIds: number[] = [];
    const _viewObjDetail = false;
    const _viewObjId = null;
    const _backToList = false;
    // 选中的终端视图
    const _selectedTerminalType = "app";
    const _selectedTerminalId = 11;

    return {
      currentStep: _currentStep,
      operateType: _operateType,
      changeObjId: _changeObjId,
      createObjParentIds: _createObjParentIds,
      viewObjDetail: _viewObjDetail,
      viewObjId: _viewObjId,
      backToList: _backToList,
      record: {},
      selectedTerminalType: _selectedTerminalType,
      selectedTerminalId: _selectedTerminalId,
    };
  },

  methods: {
    onNext(
      type: "change" | "create",
      id: number | number[],
      historyId: number
    ) {
      this.operateType = type;
      if (type === "change") {
        this.changeObjId = id as number;
        this.changeHistoryId = historyId;
      } else {
        this.createObjParentIds = id as number[];
      }

      this.currentStep = 1;
    },
    onCreateNext(
      type: "create",
      id: number | number[],
      terminalType: string,
      terminalId: number
    ) {
      this.operateType = type;
      this.createObjParentIds = id as number[];
      this.currentStep = 1;
      this.selectedTerminalType = terminalType;
      this.selectedTerminalId = terminalId;
    },
    onBack() {
      this.currentStep = 0;
    },
    onViewObj(record, terminalId) {
      const compopnent = defineAsyncComponent(
        () => import("@/views/home/tracker/object/list/ObjectEditDrawer.vue")
      );

      createInstance(compopnent, {
        parentContext: { _: this.instance },
        id: record.objId,
        reqPoolId: this.reqPoolId,
        historyId: record.historyId || null,
        trackerId: record.trackerId,
        record,
        conditions: { terminalIds: terminalId },
        isPreview: true,
      });
    },
    onBackToList() {
      this.viewObjDetail = false;
      this.backToList = false;
      this.objectChangeSelect && this.objectChangeSelect.onBackToList();
    },
    handleRefreshData() {
      this.$emit("handlerOk");
    },
    handleOk() {
      const form =
        this.operateType === "create" ? this.createRef : this.editRef;

      if (!form) return;

      form.handleOk().then(() => {
        this.$emit("handlerOk");
      });
    },
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

<style scoped="true">
.m-footer {
  justify-content: space-between;
}
</style>

<template>
  <u-drawer
    width="90vw"
    wrapClassName="edit-diff-dialog"
    :visible="visible"
    title="编辑对象-冲突解决"
    @handlerClose="handleClose"
    @handleOk="handleOk"
    :maskClosable="false"
  >
    <div class="g-position">
      <a-card class="require-diff-obj-item" title="当前需求组内改动">
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
          :isPreview="true"
          :isDiff="true"
          :partEditAuth="partEditAuth"
        ></ObjectEditForm>
      </a-card>
      <a-card class="diff-obj-item" title="当前对象" style="width: 950px">
        <ObjectEditForm
          class="g-bottom-padding"
          ref="object-edit-form"
          :id="id"
          :record="record"
          :trackerId="trackerId"
          :reqPoolId="reqPoolId"
          :operatorChangeType="operatorChangeType"
          :historyId="historyId"
          :partEditAuth="partEditAuth"
          :editDiff="true"
          @handlerOk="$emit('handlerOk')"
        ></ObjectEditForm>
      </a-card>
      <a-card class="diff-obj-item" title="最新基线变更">
        <ObjectEditForm
          class="g-bottom-padding"
          ref="base-object-edit-form"
          :id="id"
          :record="record"
          :trackerId="trackerId"
          :reqPoolId="reqPoolId"
          :operatorChangeType="operatorChangeType"
          :historyId="historyId"
          :isPreview="true"
          :isDiff="true"
          :isBaseDiff="true"
          :partEditAuth="partEditAuth"
        ></ObjectEditForm>
      </a-card>
    </div>
    <drawer-footer @close="handleClose" @ok="handleOk" />
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import ObjectEditForm from "./ObjectEditForm.vue";
import { taskOperateTextMap } from "@/types/requirement.type";

interface FilterDto {
  terminalId: number;
  versionId?: number;
}

export default defineComponent({
  name: "ObjectEditDrawer",
  components: {
    ObjectEditForm,
  },
  setup(props) {
    const _taskOperateTextMap = taskOperateTextMap;
    const { terminalIds, versionIds } = props.conditions;
    const terminalId = ref(terminalIds);
    const versionId = ref(versionIds);
    return {
      taskOperateTextMap: _taskOperateTextMap,
      // spmContent: props.spm
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
  },
  computed: {
    objectChangeForm() {
      const objectChangeForm: typeof ObjectEditForm =
        this.$refs["object-edit-form"];
      return objectChangeForm;
    },

    fromObjectManage() {
      return this.from === "objectManage";
    },

    partEditAuth() {
      if (!this.isPreview) return false;

      return this.isManager;
    },
  },
  data() {
    return {
      loading: false,
      isManager: false, // 是否有优先级、标签等四个字段的编辑权限，应该是有管理员有这个权限
    };
  },
  mounted() {},
  methods: {
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
          .catch()
          .finally(() => {
            this.loading = false;
          });
      }

      return Promise.resolve();
    },
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

<style scoped="true" lang="less">
.g-position {
  display: flex;
}

.diff-obj-item {
  width: 850px;
  margin-right: 30px;

  &:last-child {
    margin-right: 0;
  }
}
</style>

<template>
  <u-modal
    :visible="true"
    :confirmLoading="confirmLoading"
    title="打回"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <a-form
      :model="formState"
      :colon="false"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="打回类型">
        <a-radio-group v-model:value="type">
          <a-radio :value="2"> 自定义 </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        v-if="type === 2"
        label="打回状态"
        required=""
        name="target-status"
      >
        <template #extra>
          <div style="margin-top: 20px">
            注：可打回状态根据勾选列表的状态最小值确定，可打回至最小值状态往前的所有状态，最小值为开始状态则不可打回。
          </div>
          <div style="margin-top: 7px">
            当前所选任务中，状态最小值为: <span>{{ minStatus }}</span>
          </div>
        </template>
        <a-select
          placeholder="请选择"
          v-model:value="formState['target-status']"
        >
          <a-select-option
            v-for="{ key, value } in reqStatusOptions"
            :key="key"
            :value="key"
            >{{ value }}</a-select-option
          >
        </a-select>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ReqStatusEnum, reqStatusNameMap } from "@/types/requirement.type";
import { batchRejectTask } from "@/services/requirement.service";

const rejectStatusOptions = {
  [ReqStatusEnum.WAIT_VRFY]: [
    {
      key: ReqStatusEnum.START,
      value: "开始",
    },
  ],
  [ReqStatusEnum.VRFY_FINISHED]: [
    {
      key: ReqStatusEnum.START,
      value: "开始",
    },
    {
      key: ReqStatusEnum.WAIT_VRFY,
      value: "待审核",
    },
  ],
  [ReqStatusEnum.DEV_FINISHED]: [
    {
      key: ReqStatusEnum.START,
      value: "开始",
    },
    {
      key: ReqStatusEnum.WAIT_VRFY,
      value: "待审核",
    },
    {
      key: ReqStatusEnum.VRFY_FINISHED,
      value: "已审核",
    },
  ],
  [ReqStatusEnum.TEST_FINISHED]: [
    {
      key: ReqStatusEnum.START,
      value: "开始",
    },
    {
      key: ReqStatusEnum.WAIT_VRFY,
      value: "待审核",
    },
    {
      key: ReqStatusEnum.VRFY_FINISHED,
      value: "已审核",
    },
    {
      key: ReqStatusEnum.DEV_FINISHED,
      value: "已完成",
    },
  ],
};

export default defineComponent({
  name: "RejectTaskModal",
  props: {
    id: {},
    status: {},
    isBatch: {
      default: false,
      required: false,
    },
    selectedRowKeys: {
      default: () => [],
      required: false,
      type: Array,
    },
    selectedObjectRowKeys: {
      default: () => [],
      required: false,
      type: Array,
    },
  },
  computed: {
    reqStatusOptions() {
      return rejectStatusOptions[this.status];
    },

    formRef() {
      return this.$refs.formRef;
    },
    minStatus() {
      const status = this.status;
      return reqStatusNameMap[status];
    },
  },

  data() {
    const _form: any = null;
    const _type = 2;
    const _confirmLoading = false;
    const _rules = {
      "target-status": [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
    };

    return {
      form: _form,
      type: _type,
      confirmLoading: _confirmLoading,
      rules: _rules,
      formState: {
        "target-status": null,
      },
    };
  },

  async created() {
    this.form = this.formRef;
  },
  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values: any) => {
        this.confirmLoading = true;
        const targetStatus = values["target-status"];

        const promise = batchRejectTask(
          this.selectedObjectRowKeys,
          this.selectedRowKeys,
          targetStatus
        );

        promise
          .then(() => {
            this.$message.success("打回成功");
            this.$emit("handlerOk");
          })
          .catch((e) => {
            this.$handleError(e, "打回");
          })
          .finally(() => {
            this.confirmLoading = false;
          });
      });
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

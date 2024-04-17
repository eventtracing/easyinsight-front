<template>
  <u-modal
    :visible="true"
    title="批量指派相关人"
    :confirmLoading="confirmLoading"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <a-form
      :model="formState"
      :colon="false"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="选择转交类型" required="">
        <a-radio-group v-model:value="deliverType">
          <a-radio :value="DeliverTypeEnum.OWNER"> 负责人 </a-radio>
          <a-radio :value="DeliverTypeEnum.VERIFIER"> 验证人 </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="选择转交人" required="" name="deliver-user">
        <s-user-select
          @change="onUserSelect"
          v-model:value="formState['deliver-user']"
        ></s-user-select>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { User } from "@/types/common.type";
import { DeliverTypeEnum, DeliverTargetEnum } from "@/types/requirement.type";
import { batchDeliverTaskAndObject } from "@/services/requirement.service";
export default defineComponent({
  name: "BatchOperateModal",
  setup() {
    const _DeliverTypeEnum = DeliverTypeEnum;

    return {
      DeliverTypeEnum: _DeliverTypeEnum,
    };
  },
  props: {
    selectedRowKeys: {
      default: () => [],
    },
    selectedObjectRowKeys: {
      default: () => [],
    },
  },
  computed: {
    formRef() {
      return this.$refs.formRef;
    },
  },

  data() {
    const _form: any = null;
    const _deliverUser: User = null;
    const _deliverType: DeliverTypeEnum = DeliverTypeEnum.OWNER;
    const _confirmLoading = false;
    const _rules = {
      "deliver-user": [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
    };

    return {
      form: _form,
      deliverUser: _deliverUser,
      deliverType: _deliverType,
      confirmLoading: _confirmLoading,
      rules: _rules,
      formState: {},
    };
  },

  async created() {
    this.form = this.formRef;
  },

  methods: {
    onUserSelect(v: string, u: User) {
      this.deliverUser = u;
      this.formState["deliver-user"] = Array.isArray(u)
        ? u.map((u) => u.email)
        : u.email;
    },

    handleOk() {
      this.$refs.formRef.validateFields().then(() => {
        this.confirmLoading = true;
        const data = {
          type: this.deliverType,
          user: this.deliverUser,
          targetList: this.selectedRowKeys
            .map((v) => ({ id: v, type: DeliverTargetEnum.TASK }))
            .concat(
              this.selectedObjectRowKeys.map((v) => ({
                id: v,
                type: DeliverTargetEnum.OBJECT,
              }))
            ),
        };
        const params = {
          deliverType: this.deliverType,
          taskIds: this.selectedRowKeys,
          processIds: this.selectedObjectRowKeys,
          userDTO: this.deliverUser,
        };

        batchDeliverTaskAndObject(params)
          .then(() => {
            this.$message.success("转交成功");
            this.$emit("handlerOk");
          })
          .catch((e) => {
            this.$handleError(e, "转交");
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

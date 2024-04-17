<template>
  <u-modal
    :visible="true"
    title="添加规则"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <a-form
      :model="formState"
      :colon="false"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="规则名" required name="name">
        <a-input v-model:value="formState['name']"></a-input>
      </a-form-item>
      <a-form-item label="表达式" required name="rule">
        <a-input v-model:value="formState['rule']"></a-input>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { addRuleTemplate } from "@/services/parameter.service";

export default defineComponent({
  name: "RuleAddModal",
  computed: {
    formRef() {
      return this.$refs.formRef;
    },
  },
  data() {
    const _form: any = null;
    const _rules = {
      name: [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
      rule: [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
    };

    return {
      form: _form,
      rules: _rules,
      formState: { name: "", rule: "" },
    };
  },
  async created() {
    this.form = this.formRef;
  },
  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values: any) => {
        addRuleTemplate(values)
          .then(() => {
            this.$message.success("添加成功");
            this.$emit("handlerOk");
          })
          .catch((e) => {
            this.$handleError(e, "添加");
          });
      });
    },
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

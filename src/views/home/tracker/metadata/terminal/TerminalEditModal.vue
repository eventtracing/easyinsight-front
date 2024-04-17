<template>
  <u-modal
    :visible="true"
    title="编辑终端"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <a-form
      v-if="detail"
      :model="detail"
      :colon="false"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="终端ID">{{ detail.id }}</a-form-item>
      <a-form-item label="终端类型" required="" name="type">
        <a-select :options="terminalTypeOptions" v-model:value="detail.type">
        </a-select>
      </a-form-item>
      <a-form-item label="终端名称" required="" name="name">
        <a-input
          placeholder="支持中英文、数字、'_'和'-'，不超过64个字符"
          v-model:value="detail.name"
        ></a-input>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TerminalTypeEnum, TerminalSimpleDto } from "@/types/terminal.type";
import { getTerminalDetail, updateTerminal } from "@/services/terminal.service";
import { nameValidator } from "@/utils/validator";

export default defineComponent({
  name: "TerminalEditModal",
  setup() {
    const _nameValidator = nameValidator;
    const _TerminalTypeEnum = TerminalTypeEnum;

    return {
      nameValidator: _nameValidator,
      TerminalTypeEnum: _TerminalTypeEnum,
    };
  },
  props: {
    id: {},
  },
  computed: {
    terminalTypeOptions() {
      return [
        {
          value: TerminalTypeEnum.PC,
          label: "PC",
        },
        {
          value: TerminalTypeEnum.WIRELESS,
          label: "无线",
        },
      ];
    },
    formRef() {
      return this.$refs.formRef;
    },
  },
  data() {
    const _form: any = null;
    const _detail: Partial<TerminalSimpleDto> = {};

    return {
      rules: {
        type: [{ required: true, message: "此字段为必填字段" }],
        name: [
          { required: true, message: "此字段为必填字段" },
          { max: 64, message: "不超过64个字符" },
          { validator: nameValidator },
        ],
      },
      form: _form,
      detail: _detail,
    };
  },
  async created() {
    this.form = this.formRef;
    this.detail = await getTerminalDetail(this.id);
  },
  methods: {
    handleOk() {
      this.$nextTick(() => {
        this.$refs.formRef.validateFields().then((values: any) => {
          const data = { type: values.type, name: values.name };

          updateTerminal({ id: this.id, ...data })
            .then(() => {
              this.$message.success("编辑成功");
              this.$emit("handlerOk");
            })
            .catch((e) => {
              this.$handleError(e, "编辑");
            });
        });
      });
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

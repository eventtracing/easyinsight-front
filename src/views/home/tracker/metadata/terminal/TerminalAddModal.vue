<template>
  <u-modal
    :visible="true"
    title="添加终端"
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
      <a-form-item label="终端类型" required="" name="terminal-type">
        <a-select
          :options="terminalTypeOptions"
          v-model:value="formState['terminal-type']"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="终端名称" required="" name="terminal-name">
        <a-input
          placeholder="支持中英文、数字、'_'和'-'，不超过64个字符"
          v-model:value="formState['terminal-name']"
        ></a-input>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TerminalTypeEnum } from "@/types/terminal.type";
import { addNewTerminal } from "@/services/terminal.service";
import { nameValidator } from "@/utils/validator";
export default defineComponent({
  name: "TerminalAddModal",

  setup() {
    const _nameValidator = nameValidator;
    const _TerminalTypeEnum = TerminalTypeEnum;

    return {
      nameValidator: _nameValidator,
      TerminalTypeEnum: _TerminalTypeEnum,
    };
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
    const _rules = {
      "terminal-type": [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
      "terminal-name": [
        { required: true, message: "此字段为必填字段" },
        { max: 64, message: "不超过64个字符" },
        { validator: nameValidator },
      ],
    };
    return {
      form: _form,
      rules: _rules,
      formState: {
        "terminal-type": TerminalTypeEnum.WIRELESS,
        "terminal-name": "",
      },
    };
  },
  async created() {
    this.form = this.formRef;
  },
  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values: any) => {
        const data = {
          type: values["terminal-type"],
          name: values["terminal-name"],
        };

        addNewTerminal(data)
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

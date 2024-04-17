<template>
  <u-modal
    :visible="true"
    title="添加终端"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <a-form
      :form="form"
      :colon="false"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="选择终端" required="" name="`tracker-terminal`">
        <a-select placeholder="请选择终端">
          <a-select-option
            v-for="t in terminals"
            :key="t.id"
            :value="t.id"
            :title="t.name"
            :disabled="terminalIds.includes(t.id)"
          >
            {{ t.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TerminalSimpleDto } from "@/types/terminal.type";
import { getTerminalList } from "@/services/terminal.service";

export default defineComponent({
  name: "TerminalAddModal",
  props: {
    terminalIds: {
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
    const _terminals: TerminalSimpleDto[] = [];
    const _rules = {
      "`tracker-terminal`": [
        {
          rules: [
            {
              required: true,
              message: "此字段为必填字段",
            },
          ],
        },
      ],
    };

    return {
      form: _form,
      terminals: _terminals,
      rules: _rules,
    };
  },
  async created() {
    this.form = this.formRef;

    getTerminalList({ currentPage: 1, pageSize: 50, search: "" }).then(
      (res) => {
        this.terminals = res.list;
      }
    );
  },
  methods: {
    handleOk() {
      this.form.validateFields({ force: true }, (err: any, values: any) => {
        if (!err) {
          const id = values["tracker-terminal"];
          const name = this.terminals.find((v) => v.id === Number(id)).name;
          this.$emit("ok", id, name);
        }
      });
    },
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

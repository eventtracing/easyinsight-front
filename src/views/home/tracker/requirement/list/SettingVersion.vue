<template>
  <u-modal
    :visible="showVersion"
    title="设置版本"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <a-form
      :colon="false"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      ref="formRef"
    >
      <a-form-item label="端解决版本" required="">
        <a-input
          placeholder="请输入端解决版本名称"
          v-model:value="version"
        ></a-input>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { setVersion } from "@/services/requirement.service";

export default defineComponent({
  name: "SettingVersion",
  props: {
    selectTask: {
      default: () => [],
    },
    show: {
      default: false,
    },
  },
  computed: {
    showVersion: {
      get() {
        return this.show;
      },

      set(value) {
        this.$emit("update:show", value);
      },
    },

    formRef() {
      return this.$refs.formRef;
    },
  },

  data() {
    const _version = "";

    return { version: _version };
  },

  methods: {
    handleClose() {
      this.version = "";
      this.$emit("update:show", false);
    },

    handleOk() {
      setVersion({
        taskId: this.selectTask,
        terminalVersion: this.version,
      }).then(() => {
        this.$message.success("设置成功～");
        this.$emit("refresh");
        this.handleClose();
      });
    },
  },
});
</script>

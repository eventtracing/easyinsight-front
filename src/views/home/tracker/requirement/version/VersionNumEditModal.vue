<template>
  <u-modal :visible="true" title="编辑版本号" @cancel="handleClose">
    <a-form
      :model="formState"
      :colon="false"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="版本号" required="" name="version-number">
        <a-input
          placeholder="请输入版本号"
          v-model:value="formState['version-number']"
        />
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VersionNumModal",
  props: {
    id: {},
    versionNum: {},
  },
  computed: {
    formRef() {
      return this.$refs.formRef;
    },
  },
  data() {
    return {
      form: null,
      rules: {
        "version-number": [{ required: true, message: "此字段为必填字段" }],
      },
      formState: {},
    };
  },

  async created() {
    this.formState["version-number"] = this.versionNum;
  },

  methods: {
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

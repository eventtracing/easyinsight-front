<template>
  <u-modal
    :visible="true"
    :title="copy ? '复制版本' : '添加版本'"
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
      <a-form-item label="版本名称" required="" name="version-name">
        <a-input
          placeholder="支持中英文、数字、'_'和'-'，不超过64个字符"
          v-model:value="formState['version-name']"
        ></a-input>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { addNewVersion } from "@/services/version.service";
import { nameValidator } from "@/utils/validator";
export default defineComponent({
  name: "EventAddModal",
  setup() {
    const _nameValidator = nameValidator;

    return { nameValidator: _nameValidator };
  },
  props: {
    copy: { type: Boolean, default: false },
    name: {},
    entityId: {},
    entityType: {},
  },
  computed: {
    formRef() {
      return this.$refs.formRef;
    },
  },
  data() {
    const _form: any = null;

    return {
      rules: {
        "version-name": [
          { required: true, message: "此字段为必填字段" },
          { max: 64, message: "不超过64个字符" },
          { validator: nameValidator },
        ],
      },
      formState: {
        "version-name": this.name,
      },
      form: _form,
    };
  },

  async created() {
    this.form = this.formRef;
  },
  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values: any) => {
        const data = {
          name: values["version-name"],
          entityId: this.entityId,
          entityType: this.entityType,
        };

        if (this.copy) {
          this.$emit("handlerOk", data.name);
          return;
        }

        addNewVersion(data)
          .then((id: number) => {
            this.$message.success("添加成功");
            this.$emit("handlerOk", id);
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

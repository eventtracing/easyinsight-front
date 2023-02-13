<template>
  <u-drawer
    :title="copy ? '复制模板' : '编辑模板'"
    :width="1000"
    :visible="true"
    @handlerClose="handleClose"
  >
    <a-form
      v-if="detail"
      :model="detail"
      :colon="false"
      labelAlign="left"
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 22 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="模板名称" required="" name="name">
        <a-input placeholder="请输入" v-model:value="detail.name"></a-input>
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea
          placeholder="请输入"
          :rows="4"
          :maxLength="255"
          v-model:value="detail.description"
        ></a-textarea>
      </a-form-item>
      <ParamConfigForm
        :formState="detail"
        :rules="rules"
        :form="formRef"
        :bindValues="bindValues"
      ></ParamConfigForm>
    </a-form>
    <drawer-footer @close="handleClose" @ok="handleOk"></drawer-footer>
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ParamConfigForm from "./ParamConfigForm.vue";
import { ParamBindItemDto, TemplateDetailDto } from "@/types/template.type";
import {
  getTemplateDetail,
  addNewTemplate,
  updateTemplate,
} from "@/services/template.service";
import { v4 as uuidv4 } from "uuid";
export default defineComponent({
  name: "TemplateEditDrawer",
  components: { ParamConfigForm },
  props: {
    id: {},
    copy: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const formRef = ref(null);

    return { formRef };
  },
  data() {
    const _form = null;
    const _detail: TemplateDetailDto = null;
    const _bindValues: ParamBindItemDto[] = [];
    const _rules = {
      name: [
        {
          required: true,
          message: "此字段为必填字段",
        },
        {
          max: 64,
          message: "不超过64个字符",
        },
      ],
    };

    return {
      form: _form,
      detail: _detail,
      bindValues: _bindValues,
      rules: _rules,
    };
  },
  async created() {
    this.form = this.formRef;
    this.detail = await getTemplateDetail(this.id);

    this.copy && (this.detail.name = this.detail.name + "_copy");

    this.bindValues = (this.detail?.binds || []).map((b) => ({
      ...b,
      uuid: uuidv4(),
      names: [],
    }));
  },

  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values) => {
        const data = {
          name: values.name,
          description: values.description,
          binds: this.bindValues.map((bv) => ({
            paramId: bv.id,
            description: bv.description,
            values: bv.selectedValues,
            notEmpty: bv.notEmpty,
            must: bv.must,
            isEncode: bv.isEncode,
          })),
        };
        if (this.copy) {
          addNewTemplate(data)
            .then(() => {
              this.$message.success("添加成功");
              this.$emit("ok");
            })
            .catch((e) => {
              this.$handleError(e, "添加");
            });
        } else {
          updateTemplate({ id: this.id, ...data })
            .then(() => {
              this.$message.success("编辑成功");
              this.$emit("ok");
            })
            .catch((e) => {
              this.$handleError(e, "编辑");
            });
        }
      });
    },
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

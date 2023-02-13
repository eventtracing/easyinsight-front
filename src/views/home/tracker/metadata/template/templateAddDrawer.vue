<template>
  <u-drawer
    title="添加模板"
    :width="1000"
    :visible="true"
    footer=""
    @handlerClose="handleClose"
    @handleOk="handleOk"
  >
    <a-form
      :colon="false"
      labelAlign="left"
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 22 }"
      ref="formRef"
      :model="formState"
      :rules="rules"
    >
      <a-form-item label="模板名称" name="tempalte-name">
        <a-input
          placeholder="请输入"
          v-model:value="formState['tempalte-name']"
        ></a-input>
      </a-form-item>
      <a-form-item label="描述" name="tempalte-desc">
        <a-textarea
          placeholder="请输入"
          :maxLength="255"
          :rows="4"
          v-model:value="formState['tempalte-desc']"
        ></a-textarea>
      </a-form-item>
      <ParamConfigForm
        :rules="rules"
        :formState="formState"
        :form="formRef"
        :bindValues="computedBindValues"
      ></ParamConfigForm>
    </a-form>
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ParamConfigForm from "./ParamConfigForm.vue";
import { ParamBindItemDto } from "@/types/template.type";
import { addNewTemplate } from "@/services/template.service";
import { v4 as uuidv4 } from "uuid";
export default defineComponent({
  name: "TemplateAddDrawer",
  components: { ParamConfigForm },
  setup() {
    const formRef = ref(null);

    return {
      formRef,
    };
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const _form = null;
    const _bindValues: ParamBindItemDto[] = [
      {
        uuid: uuidv4(),
        id: undefined,
        code: undefined,
        name: undefined,
        names: [],
        selectedValues: [],
        values: [],
        valueType: undefined,
        paramType: undefined,
        description: "",
        notEmpty: true,
        must: true,
      },
    ];

    const _rules = {
      "tempalte-name": [
        {
          required: true,
          message: "此字段为必填字段",
          trigger: "change",
        },
        {
          max: 64,
          message: "不超过64个字符",
        },
      ],
    };

    return {
      form: _form,
      bindValues: _bindValues,
      rules: _rules,
      formState: {
        "tempalte-name": "",
        "tempalte-desc": "",
      },
    };
  },
  computed: {
    computedBindValues() {
      if (this.list && this.list.length) return this.list;

      return this.bindValues;
    },
  },
  methods: {
    handleOk() {
      this.$nextTick(() => {
        this.$refs.formRef.validateFields().then((values) => {
          const data = {
            name: values["tempalte-name"],
            description: values["tempalte-desc"],
            binds: this.computedBindValues.map((bv) => ({
              paramId: bv.id,
              description: bv.description,
              values: bv.selectedValues,
              notEmpty: bv.notEmpty,
              must: bv.must,
              isEncode: bv.isEncode,
            })),
          };

          addNewTemplate(data)
            .then(() => {
              this.$message.success("添加成功");
              this.$emit("handlerOk");
            })
            .catch((e) => {
              this.$handleError(e, "添加");
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

<template>
  <u-drawer
    title="编辑参数"
    :width="600"
    :visible="true"
    footer=""
    @handlerClose="handleClose"
    @handleOk="handleOk"
  >
    <a-form
      v-if="detail"
      :model="detail"
      :colon="false"
      labelAlign="left"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="参数类型" required="" style="margin-bottom: 8px">
        <span>{{ paramTypeName }}</span>
      </a-form-item>
      <a-form-item label="参数名" required="" name="code">
        <a-input
          placeholder="支持英文、数字、'_'和'-'，不超过64个字符"
          v-model:value="detail.code"
        ></a-input>
      </a-form-item>
      <a-form-item label="中文名称" required="" name="name">
        <a-input
          placeholder="支持中英文、数字、'_'和'-'，不超过64个字符"
          v-model:value="detail.name"
        ></a-input>
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea
          placeholder="请输入"
          :rows="4"
          :maxLength="255"
          v-model:value="detail.description"
        ></a-textarea>
      </a-form-item>
      <a-form-item label="取值类型" required="" name="valueType">
        <a-radio-group v-model:value="detail.valueType">
          <a-radio :value="ParamValueTypeEnum.VARIABLE"> 变量</a-radio>
          <a-radio :value="ParamValueTypeEnum.CONSTANT"> 常量 </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  paramTypeNameMap,
  ParamValueTypeEnum,
  ParameterDetailDto,
} from "@/types/parameter.type";
import { codeValidator, nameValidator } from "@/utils/validator";
import { getParamDetail, updateParam } from "@/services/parameter.service";
export default defineComponent({
  name: "ParamEditDrawer",

  setup() {
    const _codeValidator = codeValidator;
    const _nameValidator = nameValidator;
    const _ParamValueTypeEnum = ParamValueTypeEnum;

    return {
      codeValidator: _codeValidator,
      nameValidator: _nameValidator,
      ParamValueTypeEnum: _ParamValueTypeEnum,
      rules: {
        code: [
          { required: true, message: "此字段为必填字段" },
          { max: 64, message: "不超过64个字符" },
          { validator: codeValidator },
        ],
        name: [
          { required: true, message: "此字段为必填字段" },
          { max: 64, message: "不超过64个字符" },
          { validator: nameValidator },
        ],
        valueType: [{ required: true, message: "此字段为必填字段" }],
      },
    };
  },

  props: {
    id: {},
  },
  computed: {
    paramTypeName() {
      return this.detail?.paramType
        ? paramTypeNameMap[this.detail.paramType]
        : "";
    },
  },

  data() {
    const _detail: ParameterDetailDto = null;

    return { detail: _detail };
  },

  async created() {
    this.detail = await getParamDetail(this.id as any);
  },

  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values) => {
        const data = {
          id: this.id,
          code: values.code,
          name: values.name,
          description: values.description,
          valueType: values.valueType,
          paramType: this.detail.paramType,
        };

        updateParam(data)
          .then(() => {
            this.$message.success("编辑成功");
            this.$emit("ok");
          })
          .catch((e) => {
            this.$handleError(e, "编辑");
          });
      });
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

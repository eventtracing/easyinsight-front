<template>
  <u-modal :visible="true" :title="title" @cancel="handleClose" @ok="handleOk">
    <a-form
      :model="detail"
      :colon="false"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
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
        <a-radio-group
          :defaultValue="
            (detail && detail.valueType) || ParamValueTypeEnum.VARIABLE
          "
          v-model:value="detail.valueType"
        >
          <a-radio :value="ParamValueTypeEnum.VARIABLE"> 变量</a-radio>
          <a-radio :value="ParamValueTypeEnum.CONSTANT"> 常量 </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import {
  ParamValueTypeEnum,
  BusinessPrivateParamDetailDto,
  ParamTypeEnum,
} from "@/types/parameter.type";
import {
  getBusinessParamDetail,
  addNewBusinessParam,
  updateBusinessParam,
} from "@/services/parameter.service";
import { nameValidator } from "@/utils/validator";
export default defineComponent({
  name: "BusinessParamAddOrEditModal",
  setup() {
    const _nameValidator = nameValidator;
    const _ParamValueTypeEnum = ParamValueTypeEnum;

    const rules = reactive({
      name: [
        { required: true, message: "此字段为必填字段" },
        { max: 64, message: "不超过64个字符" },
        { validator: nameValidator },
      ],
      valueType: [{ required: true, message: "此字段为必填字段" }],
    });

    return {
      nameValidator: _nameValidator,
      ParamValueTypeEnum: _ParamValueTypeEnum,
      rules,
    };
  },
  props: {
    code: {},
    id: {},
  },
  computed: {
    title() {
      return this.id ? "编辑参数含义" : "添加参数含义";
    },

    formRef() {
      return this.$refs.formRef;
    },
  },
  data() {
    const _form: any = null;
    const _detail: Partial<BusinessPrivateParamDetailDto> = {
      valueType: ParamValueTypeEnum.VARIABLE,
    };

    return { form: _form, detail: _detail };
  },
  async created() {
    this.form = this.formRef;

    if (this.id) {
      this.detail = await getBusinessParamDetail(this.id);
      this.detail.valueType =
        this.detail.valueType || ParamValueTypeEnum.VARIABLE;
    }
  },
  methods: {
    handleOk() {
      return this.$refs.formRef.validateFields().then((values: any) => {
        const data = {
          code: this.code,
          name: values.name,
          description: values.description,
          valueType: values.valueType,
          paramType: ParamTypeEnum.OBJ_BUSINESS_PARAM,
        };

        if (this.id) {
          updateBusinessParam({ id: this.id, ...data })
            .then(() => {
              this.$message.success("编辑成功");
              this.$emit("handlerOk");
            })
            .catch((e) => {
              this.$handleError(e, "编辑");
            });
        } else {
          addNewBusinessParam(data)
            .then(() => {
              this.$message.success("添加成功");
              this.$emit("handlerOk");
            })
            .catch((e) => {
              this.$handleError(e, "添加");
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

<template>
  <u-modal
    :visible="true"
    title="添加参数"
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
      <a-form-item label="选择参数" required="" name="param-item">
        <a-select
          v-model:value="formState['param-item']"
          placeholder="请选择"
          allowClear=""
          mode="multiple"
          optionLabelProp="value"
          :maxTagCount="4"
        >
          <a-select-option
            v-for="t in paramList"
            :key="t.code"
            :value="t.code"
            :title="t.code"
          >
            {{ `${t.code}${t.items[0] ? `（${t.items[0].name}）` : ""}` }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EntityTypeEnum } from "@/types/version.type";
import { ParamListItemObj, ParamTypeEnum } from "@/types/parameter.type";
import { getAllParamList, getParamValues } from "@/services/parameter.service";
import { v4 as uuidv4 } from "uuid";
export default defineComponent({
  name: "ParamBindModal",
  props: {
    entityType: {},
  },
  computed: {
    formRef() {
      return this.$refs.formRef;
    },
  },

  data() {
    const _form: any = null;
    const _paramList: ParamListItemObj[] = [];
    const _rules = {
      "param-item": [{ required: true, message: "此字段为必填字段" }],
    };

    return {
      form: _form,
      paramList: _paramList,
      rules: _rules,
      formState: {
        "param-item": [],
      },
    };
  },

  async created() {
    this.form = this.formRef;
    const paramType =
      this.entityType === EntityTypeEnum.EVENT
        ? ParamTypeEnum.EVENT_PARAM
        : ParamTypeEnum.GLOBAL_PUBLIC_PARAM;
    this.paramList = await getAllParamList([paramType]);
  },

  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values: any) => {
        const codes = values["param-item"];
        const tasks = codes.map((code) => {
          return new Promise((resolve) => {
            const param = this.paramList.find((p) => p.code === code);
            const { id, valueType, name } = param.items[0];

            getParamValues(id).then((values) => {
              resolve({
                uuid: uuidv4(),
                id: id,
                name: name,
                code: code,
                valueType: valueType,
                paramType: param.paramType,
                description: "",
                selectedValues: [],
                values: values,
                notEmpty: true,
                must: true,
                isEncode: false,
              });
            });
          });
        });
        Promise.all(tasks).then((res) => {
          this.$emit("handlerOk", res);
        });
      });
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

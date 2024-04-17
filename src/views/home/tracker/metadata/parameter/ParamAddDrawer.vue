<template>
  <u-drawer
    title="添加参数"
    :width="600"
    :visible="true"
    @handlerClose="handleClose"
  >
    <a-form
      :model="formState"
      :colon="false"
      labelAlign="left"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="参数类型" required="">
        <div class="flex-wrap" style="justify-content: space-between">
          <div
            :class="['item', item.type === paramType && 'active']"
            v-for="item in paramTypes"
            :key="item.type"
            @click="() => (paramType = item.type)"
          >
            <div class="title">{{ item.name }}</div>
            <div class="desc">{{ item.desc }}</div>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="参数名" required="" name="param-code">
        <a-alert
          v-if="paramType === ParamTypeEnum.OBJ_BUSINESS_PARAM"
          message="对业务私参的key没有实际含义，需要配合oid一起使用；只有锁定具体的对象后，才需要定义私参的名称和取值范围。"
          type="warning"
          show-icon=""
          class="g-mb-8"
        ></a-alert>
        <a-input
          placeholder="支持英文、数字、'_'和'-'，不超过64个字符"
          v-model:value="formState['param-code']"
        ></a-input>
      </a-form-item>
      <template v-if="paramType !== ParamTypeEnum.OBJ_BUSINESS_PARAM">
        <a-form-item label="中文名称" required="" name="param-name">
          <a-input
            placeholder="支持中英文、数字、'_'和'-'，不超过64个字符"
            v-model:value="formState['param-name']"
          ></a-input>
        </a-form-item>
        <a-form-item label="描述" name="param-desc">
          <a-textarea
            placeholder="请输入"
            :maxLength="255"
            :rows="4"
            v-model:value="formState['param-desc']"
          ></a-textarea>
        </a-form-item>
        <a-form-item label="取值类型" required="" name="param-valueType">
          <a-radio-group v-model:value="formState['param-valueType']">
            <a-radio :value="ParamValueTypeEnum.VARIABLE"> 变量</a-radio>
            <a-radio :value="ParamValueTypeEnum.CONSTANT"> 常量 </a-radio>
          </a-radio-group>
        </a-form-item>
      </template>
    </a-form>
    <drawer-footer @close="handleClose" @ok="handleOk"></drawer-footer>
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { ParamTypeEnum, ParamValueTypeEnum } from "@/types/parameter.type";
import { codeValidator, nameValidator } from "@/utils/validator";
import {
  addNewParam,
  addNewBusinessParamPoolItem,
} from "@/services/parameter.service";
export default defineComponent({
  name: "ParamAddDrawer",
  setup() {
    const _codeValidator = codeValidator;
    const _nameValidator = nameValidator;
    const _ParamTypeEnum = ParamTypeEnum;
    const _ParamValueTypeEnum = ParamValueTypeEnum;

    const _paramTypes = reactive([
      {
        type: ParamTypeEnum.OBJ_BUSINESS_PARAM,
        name: "对象业务私参",
        desc: "与特定对象相关，命名不可与前三者冲突",
      },
      {
        type: ParamTypeEnum.OBJ_NORMAL_PARAM,
        name: "对象标准私参",
        desc: "在所有对象上含义相同，同一产品下全局唯一",
      },
      {
        type: ParamTypeEnum.EVENT_PARAM,
        name: "事件公参",
        desc: "与事件相关，同一产品下全局唯一",
      },
      {
        type: ParamTypeEnum.GLOBAL_PUBLIC_PARAM,
        name: "全局公参",
        desc: "与终端相关，同一产品下全局唯一",
      },
    ]);
    return {
      codeValidator: _codeValidator,
      nameValidator: _nameValidator,
      ParamTypeEnum: _ParamTypeEnum,
      ParamValueTypeEnum: _ParamValueTypeEnum,
      paramTypes: _paramTypes,
      rules: reactive({
        "param-code": [
          { required: true, message: "此字段为必填字段" },
          { max: 64, message: "不超过64个字符" },
          { validator: codeValidator },
        ],
        "param-name": [
          { required: true, message: "此字段为必填字段" },
          { max: 64, message: "不超过64个字符" },
          { validator: nameValidator },
        ],
        "param-valueType": [{ required: true, message: "此字段为必填字段" }],
      }),
      formState: reactive({
        "param-valueType": ParamValueTypeEnum.VARIABLE,
      }),
    };
  },

  props: {
    type: {
      default: ParamTypeEnum.OBJ_BUSINESS_PARAM,
    },
  },
  computed: {
    formRef() {
      return this.$refs.formRef;
    },
  },

  data() {
    const _paramType = ParamTypeEnum.OBJ_BUSINESS_PARAM;
    const _form = null;

    return {
      paramType: _paramType,
      form: _form,
    };
  },

  created() {
    this.form = this.formRef;
    this.paramType = this.type;
  },

  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values) => {
        if (this.paramType === ParamTypeEnum.OBJ_BUSINESS_PARAM) {
          addNewBusinessParamPoolItem(values["param-code"])
            .then(() => {
              this.$message.success("添加成功");
              this.$emit("handlerOk");
            })
            .catch((e) => {
              this.$handleError(e, "添加");
            });
        } else {
          const data = {
            paramType: this.paramType,
            code: values["param-code"],
            name: values["param-name"],
            description: values["param-desc"],
            valueType: values["param-valueType"],
          };

          addNewParam(data)
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

<style lang="less" scoped="true">
.item {
  width: 215px;
  height: 100px;
  padding: 16px;
  background: #f5f7fa;
  line-height: 1.5;
  cursor: pointer;

  &:nth-child(3) {
    margin-top: 16px;
  }
  &:nth-child(4) {
    margin-top: 16px;
  }

  .title {
    color: #102048;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &.active {
    .title,
    .desc {
      color: @primary-color;
    }
  }
}
</style>

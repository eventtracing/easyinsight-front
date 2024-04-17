<template>
  <u-drawer
    title="取值管理"
    :width="800"
    :visible="true"
    @handlerClose="handleClose"
  >
    <div v-if="detail">
      <u-info size="large" :labelWidth="90">
        <u-info-item label="参数名">{{ detail.code }}</u-info-item>
        <u-info-item label="中文名称">{{ detail.name }}</u-info-item>
        <u-info-item label="取值类型">{{ paramValueTypeName }}</u-info-item>
      </u-info>
      <a-form
        :model="formState"
        :form="form"
        class="g-mt-16 table-form"
        ref="formRef"
        :rules="rules"
      >
        <a-table
          size="small"
          :columns="columns"
          :dataSource="values"
          :pagination="false"
          :rowKey="(record) => record.uuid"
        ></a-table>
        <a-button class="g-mt-16" type="primary" ghost="" @click="onAddValue"
          >新增</a-button
        >
      </a-form>
    </div>
    <drawer-footer @close="handleClose" @ok="handleOk"></drawer-footer>
  </u-drawer>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import {
  ParamValueTypeEnum,
  ParameterDetailDto,
  VariableParamReq,
} from "@/types/parameter.type";
import {
  getParamDetail,
  getBusinessParamDetail,
  setParamValue,
  getVariableParamSelect,
} from "@/services/parameter.service";
import { v4 as uuidv4 } from "uuid";
import { omit } from "@/ndsc-vue3/utils/lib";
import VariableParamSelect from "./VariableParamSelect.vue";
import { EventEmitter } from "eventemitter3";
import { MinusCircleOutlined } from "@ant-design/icons-vue";

interface ParamValueEditDto {
  id?: any;
  uuid: string;
  code: string;
  name: string;
  description: string;
  used: boolean;
}
export default defineComponent({
  name: "ParamValueDrawer",
  components: {
    VariableParamSelect,
    MinusCircleOutlined,
  },
  props: {
    isBusinessPrivateParam: {
      type: Boolean,
      default: false,
    },
    id: {},
  },
  computed: {
    isConstant() {
      return this.detail?.valueType === ParamValueTypeEnum.CONSTANT;
    },
    paramValueTypeName() {
      if (!this.detail?.valueType) return "";

      return this.isConstant ? "常量" : "变量";
    },
    columns() {
      return [
        {
          key: "code",
          title: () => (this.isConstant ? "code" : "规则"),
          dataIndex: this.isConstant ? "code" : "name",
          customRender: ({
            record,
          }: {
            text: string;
            record: ParamValueEditDto;
          }) => {
            return (
              <a-form-item label="" required>
                {this.isConstant ? (
                  <a-input
                    value={this.formState[`param-code-${record.uuid}`]}
                    disabled={record.used}
                    placeholder="请输入"
                    onChange={(e) =>
                      this.isConstant
                        ? ((record.code = e.target.value),
                          (this.formState[`param-code-${record.uuid}`] =
                            e.target.value))
                        : (record.name = e.target.value)
                    }
                  ></a-input>
                ) : (
                  <VariableParamSelect
                    eventEmitter={this.eventEmitter}
                    param="name"
                    variableOptions={this.variableOptions}
                    id={record.id}
                    uuid={record.uuid}
                    initialValue={record.name}
                    on-changeSelect={(...rest: string[]) =>
                      this.changeValue.call(null, record, ...rest)
                    }
                  />
                )}
              </a-form-item>
            );
          },
        },
        {
          key: "name",
          title: () => {
            return this.isConstant ? "中文名称" : "表达式";
          },
          dataIndex: this.isConstant ? "name" : "code",
          customRender: ({
            record,
          }: {
            text: string;
            record: ParamValueEditDto;
          }) => {
            return (
              <a-form-item label="" required>
                {this.isConstant ? (
                  <a-input
                    value={this.formState[`param-name-${record.uuid}`]}
                    placeholder="请输入"
                    disabled={record.used}
                    onChange={(e) =>
                      this.isConstant
                        ? ((record.name = e.target.value),
                          (this.formState[`param-name-${record.uuid}`] =
                            e.target.value))
                        : (record.code = e.target.value)
                    }
                  ></a-input>
                ) : (
                  <VariableParamSelect
                    eventEmitter={this.eventEmitter}
                    param="rule"
                    id={record.id}
                    uuid={record.uuid}
                    variableOptions={this.variableOptions}
                    initialValue={record.code}
                    on-changeSelect={(...rest: string[]) =>
                      this.changeValue.call(null, record, ...rest)
                    }
                  />
                )}
              </a-form-item>
            );
          },
        },
        {
          key: "description",
          title: "描述",
          dataIndex: "description",
          customRender: ({
            record,
          }: {
            text: string;
            record: ParamValueEditDto;
          }) => (
            <a-form-item label="" required>
              <a-textarea
                value={this.formState[`param-desc-${record.uuid}`]}
                placeholder="请输入"
                rows={1}
                onChange={(e) => {
                  const value = e.target.value;
                  record.description = value;
                  this.formState[`param-desc-${record.uuid}`] = value;
                }}
              ></a-textarea>
            </a-form-item>
          ),
        },
        {
          key: "operation",
          title: "",
          width: 50,
          align: "center",
          customRender: ({
            record,
          }: {
            text: number;
            record: ParamValueEditDto;
          }) => {
            if (record.used) return "";

            return (
              <MinusCircleOutlined
                class="icon-delete"
                onClick={this.onDeleteValue.bind(this, record)}
              />
            );
          },
        },
      ];
    },

    formRef() {
      return this.$refs.formRef;
    },
  },
  data() {
    const _form = null;
    const _detail: ParameterDetailDto = null;
    const _values: ParamValueEditDto[] = [];
    const _eventEmitter: any = new EventEmitter();
    let _variableOptions: Array<Partial<VariableParamReq>>[];

    return {
      form: _form,
      detail: _detail,
      values: _values,
      variableOptions: _variableOptions,
      eventEmitter: _eventEmitter,
      formState: {},
      rules: {},
    };
  },
  async created() {
    this.form = this.formRef;
    const req = this.isBusinessPrivateParam
      ? getBusinessParamDetail
      : getParamDetail;
    const detail = await req(this.id);
    this.values = detail.values.map((item) => {
      const uuid = uuidv4();
      this.formState[`param-code-${uuid}`] = item.code;
      this.formState[`param-name-${uuid}`] = item.name;
      this.formState[`param-desc-${uuid}`] = item.description;
      this.rules[`param-code-${uuid}`] = [
        {
          required: true,
          message: "此字段为必填字段",
        },
        {
          max: 64,
          message: "不超过64个字符",
        },
      ];

      this.rules[`param-name-${uuid}`] = [
        {
          required: true,
          message: "此字段为必填字段",
        },
        {
          max: 64,
          message: "不超过64个字符",
        },
      ];
      this.formState[`param-name-${uuid}`] = item.name;
      this.formState[`param-desc-${uuid}`] = item.description;

      return {
        id: item.id,
        code: item.code,
        name: item.name,
        description: item.description,
        uuid,
        used: item.used,
      };
    });

    this.detail = detail;
  },
  mounted() {
    getVariableParamSelect().then((res) => {
      this.variableOptions = res;
      this._.update();
    });
  },
  methods: {
    changeValue(context, param, value) {
      context[param] = value;
    },
    onAddValue() {
      this.values.push({
        uuid: uuidv4(),
        code: undefined,
        name: undefined,
        description: "",
        used: false,
      });
    },
    onDeleteValue(record: ParamValueEditDto) {
      const idx = this.values.findIndex((v) => v.uuid === record.uuid);
      this.formState[`param-code-${record.uuid}`] = undefined;
      this.formState[`param-name-${record.uuid}`] = undefined;
      this.formState[`param-desc-${record.uuid}`] = undefined;
      this.rules[`param-code-${record.uuid}`] = undefined;
      this.rules[`param-name-${record.uuid}`] = undefined;
      this.values.splice(idx, 1);
    },
    handleOk() {
      this.$refs.formRef.validateFields().then(() => {
        const values = this.values.map((item) => omit(item, ["uuid", "used"]));

        setParamValue(this.id, values)
          .then(() => {
            this.$message.success("取值编辑成功");
            this.$emit("handlerOk");
          })
          .catch((e) => {
            this.$handleError(e, "取值编辑");
          });
      });
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

<style lang="less" scoped="true">
:deep(.icon-delete) {
  font-size: 16px;
  margin-top: 8px;

  &:hover {
    color: #2651fa;
  }
}
.table-form {
  padding-bottom: 50px;
}
</style>

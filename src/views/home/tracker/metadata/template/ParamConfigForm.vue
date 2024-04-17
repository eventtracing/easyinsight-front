<template>
  <a-form-item :label="label" :class="[!label && 'no-label']">
    <div class="header flex-ac">
      <div class="param-order">序号</div>
      <div class="param-must">必传</div>
      <div class="param-code">参数名</div>
      <div class="param-name">中文名称</div>
      <div class="param-valueType">取值类型</div>
      <div class="param-values">取值</div>
      <div class="param-notEmpty">取值非空</div>
      <div class="param-encryption">是否编码</div>
      <div class="param-valueDesc">取值描述</div>
      <div style="width: 18px" v-if="!disabled" class="g-ml-16"></div>
    </div>
    <div
      v-for="(bv, index) in bindValues"
      :key="bv.uuid"
      class="flex-ac value-item"
      :class="bv.diffType"
    >
      <div class="param-order">{{ index + 1 }}</div>
      <div class="param-must">
        <a-checkbox v-model:checked="bv.must" :disabled="disabled"></a-checkbox>
      </div>
      <div class="param-code" v-if="disabled">{{ bv.code }}</div>
      <a-form-item
        class="param-code"
        style="margin-bottom: 0"
        v-else
        :name="`param-code-${bv.uuid}`"
      >
        <u-single-select
          class="param-code"
          :options="paramList"
          labelAttr="code"
          valueAttr="code"
          :disabled="disabled"
          style="width: 80%; margin-left: 1%"
          @change="onParamCodeChange($event, bv)"
          :defaultValue="bv.code || undefined"
          v-model:value="formState[`param-code-${bv.uuid}`]"
        ></u-single-select>
      </a-form-item>
      <a-form-item
        v-if="bv.paramType === ParamTypeEnum.OBJ_BUSINESS_PARAM && !isDetail"
        class="param-name"
        style="margin-bottom: 0"
        :name="`param-name-${bv.uuid}`"
      >
        <u-single-select
          class="param-name"
          placeholder="请选择"
          :options="bv.names"
          labelAttr="name"
          valueAttr="name"
          :disabled="disabled"
          allowClear
          @change="onParamNameChange($event, bv)"
          :defaultValue="bv.name || undefined"
          v-model:value="formState[`param-name-${bv.uuid}`]"
        ></u-single-select>
      </a-form-item>
      <div v-else class="param-name">
        {{ bv.name || "-" }}
      </div>
      <div class="param-valueType">
        <a-tag>{{
          !bv.valueType
            ? "-"
            : bv.valueType === ParamValueTypeEnum.CONSTANT
            ? "常量"
            : "变量"
        }}</a-tag>
      </div>
      <div
        class="param-values"
        v-if="disabled"
        v-html="getValueDetail(bv)"
      ></div>
      <a-form-item
        class="param-values"
        style="margin-bottom: 0"
        v-else
        :name="`param-values-${bv.uuid}`"
      >
        <a-select
          placeholder="请选择"
          :disabled="disabled"
          style="width: 80%; margin-left: 10%"
          mode="multiple"
          optionFilterProp="key"
          :dropdownMatchSelectWidth="false"
          :dropdownMenuStyle="{ 'max-width': '300px' }"
          optionLabelProp="children"
          @change="onParamValuesChange($event, bv)"
          v-model:value="bv.selectedValues"
        >
          <a-select-option
            v-for="t in bv.values"
            :key="t.code"
            :value="t.id"
            :title="t.code"
          >
            {{ t.code }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <div class="param-notEmpty">
        <a-checkbox
          v-model:checked="bv.notEmpty"
          :disabled="disabled"
        ></a-checkbox>
      </div>
      <div class="param-encryption">
        <a-checkbox
          v-model:checked="bv.isEncode"
          :disabled="disabled"
        ></a-checkbox>
      </div>
      <div class="param-valueDesc" style="line-height: 18px" v-if="isDetail">
        {{ bv.description }}
      </div>
      <a-textarea
        class="param-valueDesc"
        placeholder="请输入"
        v-model:value="bv.description"
        :autoSize="true"
        :disabled="isDetail || disabled"
        v-else
      ></a-textarea>
      <div v-if="!disabled" class="g-ml-16">
        <u-icon-button
          iconFont="remove"
          style="font-size: 18px"
          title="移除"
          @click="onRemove(bv.uuid)"
        ></u-icon-button>
      </div>
    </div>
    <a-button v-if="!disabled" type="primary" ghost="" @click="onAdd">
      添加
    </a-button>
    <slot></slot>
  </a-form-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ParamBindItemDto } from "@/types/template.type";
import {
  ParamListItemObj,
  ParamValueTypeEnum,
  ParamTypeEnum,
} from "@/types/parameter.type";
import { getAllParamList, getParamValues } from "@/services/parameter.service";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import useFindAndroidAndIPhone from "hooks/Object/useFindAndroidAndIPhone";

export default defineComponent({
  name: "ParamConfigForm",
  setup() {
    const _ParamTypeEnum = ParamTypeEnum;
    const _ParamValueTypeEnum = ParamValueTypeEnum;

    return {
      ParamTypeEnum: _ParamTypeEnum,
      ParamValueTypeEnum: _ParamValueTypeEnum,
    };
  },
  props: {
    rules: {
      type: Object,
      default: () => ({}),
    },
    form: {},
    terminalId: {},
    formState: {
      type: Object,
      default: () => ({}),
    },
    optionObj: {
      type: Object,
      default: () => ({ consistency: true }),
    },
    trackers: {
      type: Array,
      default: () => [],
    },
    bindValues: {
      type: Array,
      default: () => [],
    },
    label: {
      default: "参数配置",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    // 补充对象业务私参的候选中文名称集合
    const _paramList: ParamListItemObj[] = [];

    return {
      paramList: _paramList,
    };
  },

  async created() {
    this.paramList = await getAllParamList([
      ParamTypeEnum.OBJ_NORMAL_PARAM,
      ParamTypeEnum.OBJ_BUSINESS_PARAM,
    ]);

    this.initNames();
  },

  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) > 0;
    },
    generatorForm() {
      (this.bindValues || []).forEach((bv) => {
        const param = this.paramList.find((p) => p.code === bv.code) || {};
        bv.paramType = param.paramType;

        if (bv.paramType === ParamTypeEnum.OBJ_BUSINESS_PARAM) {
          bv.names = param.items;
        }

        this.formState[`param-code-${bv.uuid}`] =
          this.formState[`param-code-${bv.uuid}`] || bv.code;
        this.formState[`param-name-${bv.uuid}`] =
          this.formState[`param-name-${bv.uuid}`] || bv.name;
        this.formState[`param-values-${bv.uuid}`] =
          this.formState[`param-values-${bv.uuid}`] || bv.selectedValues;
        this.rules[`param-code-${bv.uuid}`] = [
          {
            required: true,
            message: "此字段为必填字段",
          },
        ];
        this.rules[`param-name-${bv.uuid}`] = [
          {
            required: true,
            message: "此字段为必填字段",
          },
        ];
        this.rules[`param-values-${bv.uuid}`] =
          bv.valueType === ParamValueTypeEnum.CONSTANT
            ? [
                {
                  required: true,
                  message: "此字段为必填字段",
                },
              ]
            : [];
      });
    },
    getValueDetail(bv) {
      const { selectedValues, values } = bv;
      return selectedValues
        .map((v) => {
          const cV = values.find((c) => c.id === v);

          return cV ? cV.code : "";
        })
        .join(",");
    },

    syncTrackers(bv) {
      const trackers = useFindAndroidAndIPhone(this.trackers);

      trackers.forEach((tracker) => {
        tracker.paramBinds = this.bindValues;
      });
    },

    async onParamCodeChange(code: string, bv: ParamBindItemDto) {
      bv.code = code;
      this.formState[`param-code-${bv.uuid}`] = code;
      const param = this.paramList.find((p) => p.code === code);
      bv.paramType = param.paramType;

      if (bv.paramType === ParamTypeEnum.OBJ_BUSINESS_PARAM) {
        bv.names = param.items;
        bv.name = undefined;
        bv.valueType = undefined;
        bv.selectedValues = [];
        bv.values = [];
        bv.description = "";
      } else {
        const { id, valueType, name } = param.items[0];
        bv.id = id;
        bv.valueType = valueType;
        bv.name = name;
        bv.description = "";
        bv.selectedValues = [];
        bv.values = await getParamValues(id);
      }

      this.formState[`param-name-${bv.uuid}`] = "";
      this.formState[`param-values-${bv.uuid}`] = [];
    },

    async onParamNameChange(name: string, bv: ParamBindItemDto) {
      bv.name = name;
      this.formState[`param-name-${bv.uuid}`] = name;
      const param = bv.names.find((n) => n.name === name);
      const { id, valueType } = param || {};
      if (id || valueType) {
        bv.id = id;
        bv.valueType = valueType;
        bv.selectedValues = [];
        bv.values = await getParamValues(id);
        this.formState[`param-values-${bv.uuid}`] = [];
      }
    },

    onParamValuesChange(values: number[], bv: ParamBindItemDto) {
      bv.selectedValues = values;
      this.formState[`param-values-${bv.uuid}`] = values;
      bv.description = values
        .map((id) => bv.values.find((v) => v.id === id)?.description || "-")
        .join("|");
    },

    onRemove(uuid: string) {
      const idx = this.bindValues.findIndex((bv) => bv.uuid === uuid);

      this.bindValues.splice(idx, 1);
    },

    onAdd() {
      const uuid = uuidv4();

      this.bindValues.push({
        uuid,
        id: undefined,
        name: undefined,
        code: undefined,
        valueType: undefined,
        paramType: undefined,
        description: undefined,
        names: [],
        selectedValues: [],
        values: [],
        notEmpty: true,
        must: true,
      });

      this.generatorForm();
    },

    initNames() {
      if (!this.paramList.length) return;
      (this.bindValues || []).forEach((bv) => {
        if (bv.paramType === ParamTypeEnum.OBJ_BUSINESS_PARAM) {
          const param = this.paramList.find((p) => p.code === bv.code);
          bv.names = param.items;
        }
      });

      this.generatorForm();
    },
  },
  watch: {
    bindValues: {
      handler: "initNames",
      immediate: true,
    },
  },
});
</script>

<style lang="less" scoped="true">
.header {
  height: 38px;
  color: #102048;
  background: #f1f2f4;
  font-weight: bold;
}

.header,
.value-item {
  margin-bottom: 10px;
  padding: 0 10px;
  text-align: center;
  :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    text-align: left;
  }
  .param-order {
    width: 10%;
  }
  .param-must {
    width: 5%;
  }
  .param-code {
    width: 15%;
  }
  .param-name {
    width: 20%;
    margin-left: 1%;
  }
  .param-valueType {
    width: 10%;
  }
  .param-values {
    width: 15%;
  }
  .param-notEmpty {
    width: 5%;
  }
  .param-encryption {
    width: 10%;
  }
  .param-valueDesc {
    width: 20%;
  }
}

.new {
  background: #ecfdf0;
}
.del {
  background: #fbe9eb;
}

.mod {
  background-color: #fafad7;
}
</style>

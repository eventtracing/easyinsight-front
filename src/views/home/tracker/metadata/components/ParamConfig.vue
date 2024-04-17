<template>
  <div class="fill flex-column">
    <div class="flex-1 scroll-y">
      <a-form :model="formState" :form="form" ref="formRef" :rules="rules">
        <div
          v-if="canEdit && isEdit"
          style="padding: 16px 24px 0"
          class="flex-ac"
        >
          <a-form-item
            class="flex-1"
            style="margin-bottom: 0"
            label="版本名称"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 15 }"
            name="version-name"
          >
            <a-input
              placeholder="支持中英文、数字、'_'和'-'，不超过64个字符"
              v-model:value="formState['version-name']"
            ></a-input>
          </a-form-item>
          <u-text-button :on-click="onAdd">绑定</u-text-button>
        </div>

        <!-- 预置版本和使用版本不可编辑 -->
        <div v-else style="padding: 16px 24px 0 14px">
          <div>
            <span style="color: #102048">版本名称：</span>
            <span>{{ versionName }}</span>
          </div>
        </div>

        <div
          class="param-content"
          :class="['g-mt-16', isEdit && 'isEditing']"
          style="padding: 0 24px 0 14px"
        >
          <div class="header flex-ac">
            <div class="param-code">参数名</div>
            <div class="param-must">必传</div>
            <div class="param-name">中文名称</div>
            <div class="param-valueType">取值类型</div>
            <div class="param-values">取值</div>
            <div class="param-valueDesc">取值描述</div>
            <div class="param-notEmpty">取值非空</div>
            <div class="param-test" v-if="isGlobalParam">需要测试</div>
            <div class="param-encryption">是否编码</div>
            <div class="param-operation" v-if="canEdit && isEdit">操作</div>
          </div>
          <div
            v-for="bv in bindValues"
            :key="bv.uuid"
            class="flex-ac value-item"
          >
            <div v-ellipsis-title="" class="param-code">
              {{ bv.code }}
            </div>
            <div class="param-must">
              <a-checkbox
                :disabled="!canEdit || !isEdit"
                v-model:checked="bv.must"
              ></a-checkbox>
            </div>
            <div v-ellipsis-title="" class="param-name">
              {{ bv.name }}
            </div>
            <div class="param-valueType">
              {{
                bv.valueType === ParamValueTypeEnum.CONSTANT ? "常量" : "变量"
              }}
            </div>

            <template v-if="canEdit && isEdit">
              <a-form-item
                style="margin-bottom: 0"
                :name="`param-values-${bv.uuid}`"
              >
                <a-select
                  class="param-values"
                  placeholder="请选择"
                  allowClear=""
                  mode="multiple"
                  :maxTagCount="2"
                  :dropdownMatchSelectWidth="false"
                  :dropdownMenuStyle="{ 'max-width': '300px' }"
                  v-model:value="formState[`param-values-${bv.uuid}`]"
                  @change="onParamValuesChange($event, bv)"
                >
                  <a-select-option
                    v-for="t in bv.values"
                    :key="t.id"
                    :value="t.id"
                    :title="t.code"
                  >
                    {{ t.code }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-input
                class="param-valueDesc"
                placeholder="请输入"
                v-model:value="bv.description"
              ></a-input>
            </template>
            <template v-else>
              <div v-ellipsis-title="" class="param-values">
                {{ getBindValueStr(bv) }}
              </div>
              <div v-ellipsis-title="" class="param-valueDesc">
                {{ bv.description }}
              </div>
            </template>

            <div class="param-notEmpty">
              <a-checkbox
                :disabled="!canEdit || !isEdit"
                v-model:checked="bv.notEmpty"
              ></a-checkbox>
            </div>
            <div class="param-test" v-if="isGlobalParam">
              <a-checkbox
                :disabled="!canEdit || !isEdit"
                v-model:checked="bv.needTest"
              ></a-checkbox>
            </div>
            <div class="param-encryption">
              <a-checkbox
                :disabled="!canEdit || !isEdit"
                v-model:checked="bv.isEncode"
              ></a-checkbox>
            </div>
            <div class="param-operation" v-if="canEdit && isEdit">
              <u-text-button :on-click="() => onRemove(bv.uuid)"
                >解绑</u-text-button
              >
            </div>
          </div>
        </div>
      </a-form>
    </div>

    <div>
      <div style="padding: 4px 0 10px 24px">
        {{ `共 ${bindValues.length} 条记录` }}
      </div>
      <div v-if="canEdit" class="btn-container">
        <a-button v-if="!isEdit" type="primary" @click="onEdit">编辑</a-button>
        <template v-else>
          <a-button @click="onCancelEdit">取消</a-button>
          <a-button class="g-ml-8" type="primary" @click="onSave"
            >保存</a-button
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ParamBindModal from "./ParamBindModal.vue";
import { EntityTypeEnum } from "@/types/version.type";
import { ParamBindItemDto } from "@/types/template.type";
import { ParamValueTypeEnum } from "@/types/parameter.type";
import {
  getVersionParamDetail,
  updateVersionParam,
} from "@/services/version.service";
import { nameValidator } from "@/utils/validator";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
export default defineComponent({
  name: "ParamConfig",
  setup() {
    const _nameValidator = nameValidator;
    const _ParamValueTypeEnum = ParamValueTypeEnum;

    return {
      nameValidator: _nameValidator,
      ParamValueTypeEnum: _ParamValueTypeEnum,
    };
  },
  props: {
    versionId: {},
    versionName: {},
    entityId: {},
    entityType: {},
    canEdit: { type: Boolean, default: true },
  },
  computed: {
    isGlobalParam() {
      return this.entityType === EntityTypeEnum.TERMINAL;
    },
    formRef() {
      return this.$refs.formRef;
    },
  },

  data() {
    const _form = null;
    const _isEdit = false;
    // 是否在编辑状态
    const _bindValues: Omit<ParamBindItemDto, "names">[] = [];
    const _cacheBindValues: Omit<ParamBindItemDto, "names">[] = [];

    return {
      form: _form,
      isEdit: _isEdit,
      bindValues: _bindValues,
      cacheBindValues: _cacheBindValues,
      rules: {
        "version-name": [
          { required: true, message: "此字段为必填字段" },
          { max: 64, message: "不超过64个字符" },
          { validator: nameValidator },
        ],
      },
      formState: {
        "version-name": this.versionName,
      },
    };
  },

  async created() {
    this.form = this.formRef;
  },

  methods: {
    getBindValueStr(bv: Omit<ParamBindItemDto, "names">) {
      const { selectedValues, values } = bv;

      return (
        selectedValues
          .map((id) => values.find((v) => v.id === id)?.code || "-")
          .join(" | ") || "-"
      );
    },
    onEdit() {
      this.isEdit = true;
      this.cacheBindValues = cloneDeep(this.bindValues);
    },
    onCancelEdit() {
      this.isEdit = false;
      this.bindValues = this.cacheBindValues;
    },
    onParamValuesChange(values: number[], bv: Omit<ParamBindItemDto, "names">) {
      bv.selectedValues = values;
      bv.description = values
        .map((id) => bv.values.find((v) => v.id === id)?.description || "-")
        .join("|");
    },
    onRemove(uuid: string) {
      const idx = this.bindValues.findIndex((bv) => bv.uuid === uuid);
      this.bindValues.splice(idx, 1);
    },
    onAdd() {
      this.$createInstance(ParamBindModal, {
        entityType: this.entityType,
        onHandlerOk: (bvs) => {
          this.bindValues.push(...bvs);
        },
      });
    },
    onSave() {
      this.$refs.formRef.validateFields().then((values: any) => {
        const data = {
          versionId: this.versionId,
          entityId: this.entityId,
          entityType: this.entityType,
          version: values["version-name"],
          paramBinds: this.bindValues.map((bv) => ({
            paramId: bv.id,
            description: bv.description,
            values: bv.selectedValues,
            notEmpty: bv.notEmpty,
            must: bv.must,
            needTest: bv.needTest,
            isEncode: bv.isEncode,
          })),
        };
        updateVersionParam(data)
          .then(async () => {
            this.$message.success("更新成功");
            await this.initData();
            this.$emit("updateVersionName", data.version);
            this.isEdit = false;
          })
          .catch((e) => {
            this.$handleError(e, "更新");
          });
      });
    },

    async initData() {
      if (!this.versionId) return;

      const res = await getVersionParamDetail({
        versionId: this.versionId,
        entityId: this.entityId,
        entityType: this.entityType,
      });

      this.bindValues = res?.map((b) => ({ ...b, uuid: uuidv4() }));
      this.isEdit = false;
    },

    initVersionName() {
      this.form &&
        this.form.setFieldsValue({
          "version-name": this.versionName,
        });
    },

    handleCanEditChange(v) {
      if (!v && this.isEdit) {
        this.bindValues = this.cacheBindValues;
      }
    },
  },
  watch: {
    versionId: { handler: "initData", immediate: true },
    versionName: { handler: "initVersionName", immediate: true },
    canEdit: { handler: "handleCanEditChange" },
    bindValues(bindValues) {
      this.formState = bindValues.reduce((prev, item) => {
        prev[`param-values-${item.uuid}`] =
          this.formState[`param-values-${item.uuid}`] ||
          item.selectedValues ||
          [];

        return prev;
      }, {});

      this.rules = bindValues.reduce((prev, item) => {
        prev[`param-values-${item.uuid}`] = [
          {
            required: true,
            message: "此字段为必填字段",
          },
        ];

        return prev;
      }, {});

      this.formState["version-name"] =
        this.formState["version-name"] || this.versionName;
      this.rules["version-name"] = [
        { required: true, message: "此字段为必填字段" },
        { max: 64, message: "不超过64个字符" },
        { validator: nameValidator },
      ];
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
  padding: 0 10px;
}

.value-item {
  padding: 8px 10px;
  border-bottom: 1px solid @border-color-split;
}

.header,
.value-item {
  .param-code {
    width: 100px;
    margin-right: 8px;
    flex: none;
  }
  .param-must {
    width: 60px;
    text-align: center;
    margin-right: 8px;
    flex: none;
  }
  .param-name {
    width: 100px;
    margin-right: 8px;
    flex: none;
  }
  .param-valueType {
    width: 60px;
    text-align: center;
    flex: none;
  }
  .param-values {
    width: 150px;
    margin-right: 8px;
    flex: none;
  }
  .param-valueDesc {
    width: 150px;
    margin-right: 8px;
    flex: none;
  }
  .param-notEmpty {
    width: 60px;
    text-align: center;
    margin-right: 8px;
    flex: none;
  }
  .param-test {
    width: 80px;
    flex: none;
  }
  .param-encryption {
    width: 80px;
    flex: none;
  }
  .param-operation {
    width: 50px;
    text-align: center;
    flex: none;
  }
}

.param-content {
  overflow-x: auto;
  width: fit-content;
}

.isEditing {
  .header,
  .value-item {
    .param-values {
      width: 198px;
    }
    .param-valueDesc {
      width: 140px;
    }
  }
}

.btn-container {
  padding: 16px 24px;
  border-top: 1px solid @border-color-split;
}
</style>

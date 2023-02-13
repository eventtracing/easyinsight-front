<template>
  <div>
    <div class="text-title g-mb-8">基本信息</div>
    <div class="container" v-for="item in obj.basics" :key="item.uuid">
      <div class="flex-ac">
        <div class="flex-1-w">
          <a-form :model="formState" :form="form" ref="formRef" :rules="rules">
            <div class="g-pr-12 g-mb-16">
              <u-info-item label="对象类型" :labelWidth="70">
                <a-radio-group
                  v-model:value="item.type"
                  @change="onObjTypeChange"
                >
                  <a-radio
                    v-for="type in ObjTypeEnumLists"
                    :key="type.key"
                    :value="ObjTypeEnum[type.key]"
                  >
                    {{ type.value }}
                  </a-radio>
                </a-radio-group>
              </u-info-item>

              <u-info-item label="优先级" style="width: 25%">
                <a-select
                  placeholder="请选择优先级"
                  v-model:value="item.priority"
                >
                  <a-select-option
                    v-for="p in priorityList"
                    :key="p"
                    :value="p"
                  >
                    {{ p }}
                  </a-select-option>
                </a-select>
              </u-info-item>
            </div>
            <a-form-item
              label="对象ID(oid)"
              required=""
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              :name="`obj-oid-${item.uuid}`"
            >
              <a-input
                placeholder="请输入"
                @change="(e) => (item.oid = e.target.value)"
                v-model:value="formState[`obj-oid-${item.uuid}`]"
              />
            </a-form-item>
            <a-form-item
              label="对象名称"
              required=""
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              :name="`obj-name-${item.uuid}`"
            >
              <a-input
                placeholder="请输入"
                @change="(e) => (item.name = e.target.value)"
                v-model:value="formState[`obj-name-${item.uuid}`]"
              />
            </a-form-item>
            <a-form-item
              label="子空间"
              v-if="item.specialType === 'bridge'"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              name="bridgeSubAppId"
            >
              <a-select placeholder="" v-model:value="item.bridgeSubAppId">
                <a-select-option
                  v-for="app in appList"
                  :key="app.id"
                  :value="app.id"
                >
                  {{ app.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="对象描述"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-textarea
                placeholder="请输入"
                :rows="2"
                v-model:value="item.description"
              />
            </a-form-item>
            <a-form-item
              label="标签"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <ObjTagSelect :tags="item.tags" />
            </a-form-item>
          </a-form>
        </div>
        <div>
          <a-button
            v-if="obj.basics.length > 1"
            class="button__remove"
            type="primary"
            size="small"
            @click="onDeleteObject(item.uuid)"
          >
            移除
          </a-button>
          <s-upload-image class="image-upload" v-model:imgUrls="item.imgUrls" />
        </div>
      </div>
    </div>
    <a-button type="dashed" class="button__add" @click="onAddObject">
      添加对象
      <template #icon>
        <PlusOutlined />
      </template>
    </a-button>
    <div class="flex g-mt-8">
      <span class="text-title g-mt-8 g-mr-8">埋点信息</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from "vue";
import ObjTagSelect from "./ObjTagSelect.vue";
import { ObjTypeEnum } from "@/types/object.type";
import { BizConfigDto } from "@/types/app.type";
import { v4 as uuidv4 } from "uuid";
import Bus from "@/bus";
import { message } from "ant-design-vue";
import store from "@/store";
import { PlusOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "BatchAddBaseInfoForm",
  components: {
    ObjTagSelect,
    PlusOutlined,
  },
  setup() {
    const _ObjTypeEnumLists = toRaw<{ key: string; value: string }[]>(
      store.state.objectType.slice(0, 4)
    );

    return {
      ObjTypeEnumLists: _ObjTypeEnumLists,
      ObjTypeEnum,
    };
  },
  props: {
    obj: {
      type: Object,
      default: () => ({
        basics: [],
      }),
    },
  },
  computed: {
    bizConfig() {
      const bizConfig: BizConfigDto = this.$store.state.bizConfig;

      return bizConfig;
    },
    priorityList() {
      const priorityList: string[] = this.$store.state.priorityList;

      return priorityList;
    },

    formRef() {
      return this.$refs.formRef;
    },
    appList() {
      const appList = this.$store.state.appList;
      const app = this.$store.state.app;

      return appList
        .filter((item) => item.id !== app.id)
        .filter((item) => Boolean(item.id));
    },
  },

  data() {
    let _form: any; // 表单实例
    const key = this.obj?.basics[0]?.uuid;

    return {
      form: _form,
      rules: {
        [`obj-oid-${key}`]: [{ required: true, message: "此字段为必填字段" }],
        [`obj-name-${key}`]: [{ required: true, message: "此字段为必填字段" }],
      },
      formState: {
        [`obj-oid-${key}`]: "",
        [`obj-name-${key}`]: "",
        [`obj-path-${key}`]: "",
      },
    };
  },

  beforeCreate() {
    this.form = this.formRef;
  },

  methods: {
    // 删除某个标签
    removePath(item, index) {
      item.pathMap.splice(index, 1);
      item.routePathIds.splice(index, 1);
    },
    // 清除所有路径数据
    clearPath(item, key) {
      item.pathMap.length = 0;
      item.routePathIds = [];
      this.formState[key] = "";
      (this as any).$forceUpdate();
    },
    onConsistencyChange() {
      this.$emit("consistencyChange");
    },
    onObjTypeChange(e) {
      const value = e.target.value;

      this.obj.basics.forEach((b) => {
        b.type = value;
      });

      Bus.$emit("objTypeChange", value);
    },

    onAddObject() {
      const key = uuidv4();

      this.obj.basics.push({
        uuid: key,
        type: ObjTypeEnum.PAGE,
        oid: "",
        name: "",
        description: "",
        imgUrls: [],
        tags: [],
        priority: "P1",
        routePathIds: [],
        pathMap: [],
        bridgeSubAppId: "",
      });

      Object.assign(this.formState, {
        [`obj-oid-${key}`]: "",
        [`obj-name-${key}`]: "",
        [`obj-path-${key}`]: "",
      });

      Object.assign(this.rules, {
        [`obj-oid-${key}`]: [
          {
            required: true,
            message: "此字段为必填字段",
          },
        ],
        [`obj-name-${key}`]: [
          {
            required: true,
            message: "此字段为必填字段",
          },
        ],
      });
    },
    onDeleteObject(uuid: string) {
      const idx = this.obj.basics.findIndex((v) => v.uuid === uuid);

      this.obj.basics.splice(idx, 1);
    },
  },
});
</script>

<style lang="less" scoped="true">
.container {
  position: relative;
  border: 1px solid #e8e8f0;
  padding: 12px 12px 0 24px;

  & + .container {
    margin-top: 16px;
  }
}
.image-upload {
  width: 290px;
  height: 220px;
  padding: 8px 0 0 8px;
  margin-left: 24px;
  margin-top: 16px;
  background: #f6f7fa;
  overflow-y: auto;
}
.button__remove {
  position: absolute;
  top: 10px;
  right: 16px;
}
.button__add {
  color: @primary-color;
  border-color: @primary-color;
  width: 100%;
  margin-top: 16px;
}
.c-form__notice {
  margin-left: 2px;
}
.c-pathform__label {
  display: inline-flex;
  align-items: center;
}
</style>

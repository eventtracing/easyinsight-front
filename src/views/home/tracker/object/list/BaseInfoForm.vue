<template>
  <div class="g-base-form">
    <div class="text-title g-mb-16 flex-ac">基本信息</div>
    <div class="flex g-pl-12">
      <div class="flex-1-w">
        <div class="g-pr-12 g-mb-16">
          <u-info-item label="对象类型:" :labelWidth="70">
            <a-radio-group
              v-model:value="obj.type"
              :disabled="isDetail ? isDetail && !partEditAuth : false"
              @change="onObjTypeChange"
            >
              <span v-if="isDetail && !partEditAuth">
                {{ getObjectTypeText(obj.type) }}
              </span>
              <template v-else>
                <a-radio
                  v-for="type in ObjTypeEnumLists"
                  :key="type.key"
                  :value="ObjTypeEnum[type.key]"
                >
                  {{ type.value }}
                </a-radio>
              </template>
            </a-radio-group>
          </u-info-item>

          <u-info-item label="优先级:" style="width: 25%">
            <span v-if="isDetail && !partEditAuth">
              {{ obj.priority }}
            </span>
            <a-select
              placeholder="请选择优先级"
              v-model:value="obj.priority"
              :disabled="isDetail && !partEditAuth"
              v-else
            >
              <a-select-option v-for="p in priorityList" :key="p" :value="p">
                {{ p }}
              </a-select-option>
            </a-select>
          </u-info-item>
        </div>
        <a-form
          :model="formState"
          style="padding-left: 0"
          ref="formRef"
          :rules="rules"
        >
          <!-- @TODO: 对象id和对象名称同名实时检测 -->
          <div class="flex g-mb-16" v-if="isDetail">
            <div style="color: #102048; width: fit-content; flex: none">
              对象ID(oid):
            </div>
            <span class="g-ml-8 flex-1">{{ obj.oid }}</span>
          </div>
          <a-form-item
            label="对象ID(oid)"
            required=""
            v-else
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            name="obj-oid"
          >
            <a-input
              placeholder="请输入"
              :disabled="disabled || !canTypeAndOidEdit || operatorChangeType"
              @change="(e) => (obj.oid = e.target.value)"
              v-model:value="formState['obj-oid']"
            />
          </a-form-item>
          <div class="flex g-mb-16" v-if="isDetail">
            <div style="color: #102048; width: 72px; flex: none">对象名称:</div>
            <span class="g-ml-4">{{ obj.name }}</span>
          </div>
          <a-form-item
            label="对象名称"
            required=""
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            v-else
            name="obj-name"
          >
            <a-input
              placeholder="请输入"
              :disabled="disabled || !canTypeAndOidEdit || operatorChangeType"
              @change="(e) => (obj.name = e.target.value)"
              v-model:value="formState['obj-name']"
            />
          </a-form-item>
          <div
            class="flex g-mb-16"
            v-if="isDetail && obj.specialType === 'bridge'"
          >
            <div style="color: #102048; width: 72px; flex: none">子空间:</div>
            <span class="g-ml-4">{{ bridgeName }}</span>
          </div>
          <a-form-item
            label="子空间"
            v-if="!isDetail && obj.specialType === 'bridge'"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            name="bridgeSubAppId"
          >
            <a-select
              placeholder=""
              v-model:value="obj.bridgeSubAppId"
              :disabled="isDetail"
            >
              <a-select-option
                v-for="app in appList"
                :key="app.id"
                :value="app.id"
              >
                {{ app.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <div class="flex g-mb-16" v-if="isDetail && !partEditAuth">
            <div style="color: #102048; width: 72px; flex: none">对象描述:</div>
            <span class="g-ml-4" style="word-break: break-all">
              {{ obj.description }}
            </span>
          </div>
          <a-form-item
            label="对象描述"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            v-else
          >
            <a-textarea
              placeholder="请输入"
              :rows="2"
              :disabled="isDetail && !partEditAuth"
              v-model:value="obj.description"
            />
          </a-form-item>
        </a-form>
      </div>
      <div>
        <div class="image-total">
          共 {{ obj.imgUrls ? obj.imgUrls.length : 0 }} 张图片
        </div>
        <s-upload-image
          class="image-upload"
          :class="{ 'image-upload--detail': isDetail }"
          v-model:imgUrls="obj.imgUrls"
          :disabled="isDetail && !partEditAuth"
          :isDetail="isDetail && !partEditAuth"
        />
      </div>
    </div>
    <div class="flex g-mb-8">
      <span class="text-title g-mt-8" style="flex: none">埋点信息</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw, PropType } from "vue";
import { BizConfigDto } from "@/types/app.type";
import { getCopyData, getCopyTypes } from "@/services/object.service";
import Bus from "@/bus";
import { ObjTypeEnum } from "@/types/object.type";
import { message } from "ant-design-vue";
import store from "@/store";
import useCopy from "hooks/useCopy";

export default defineComponent({
  name: "BaseInfoForm",
  components: {},
  setup() {
    const _ObjTypeEnumLists = toRaw<{ key: string; value: string }[]>(
      store.state.objectType.slice(0, 3)
    );

    function getObjectTypeText(type) {
      return _ObjTypeEnumLists.find((obj) => ObjTypeEnum[obj.key] === type)
        ?.value;
    }

    return {
      ObjTypeEnumLists: _ObjTypeEnumLists,
      ObjTypeEnum,
      getObjectTypeText,
    };
  },

  props: {
    events: {
      type: Array,
      default: () => [],
    },
    obj: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    canTypeAndOidEdit: {
      type: Boolean,
      default: true,
    },
    operatorChangeType: {
      // 需求池里是否是操作类型是变更
      type: Boolean,
      default: true,
    },
    hasNoStartStatus: {
      type: Boolean,
      default: false,
    },
    hiddenTrackerInfo: {
      type: Boolean,
      default: false,
    },
    isChange: {
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    partEditAuth: {
      type: Boolean,
      default: false,
    },
    id: {},
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    historyId: {
      type: [Number, String] as PropType<number | string>,
    },
  },
  computed: {
    hasOnlyAndroid() {
      return (
        !this.obj.consistency &&
        this.obj.trackers?.some((v) =>
          v.terminalName.toLowerCase().includes("android")
        )
      );
    },
    hasOnlyIphone() {
      return (
        !this.obj.consistency &&
        this.obj.trackers?.some((v) =>
          v.terminalName.toLowerCase().includes("iphone")
        )
      );
    },
    hasAndroidOrIpnhone() {
      return (
        this.obj.consistency &&
        this.obj.trackers?.some(
          (v) =>
            v.terminalName.toLowerCase().includes("iphone") ||
            v.terminalName.toLowerCase().includes("android")
        )
      );
    },
    hasWeb() {
      return this.obj.trackers?.some((v) =>
        v.terminalName.toLowerCase().includes("web")
      );
    },
    consistencyCheckboxDisabled() {
      return this.hasNoStartStatus && !this.obj.consistency;
    },

    pathMap() {
      return (this.obj.routePathIds || []).map((v) => v.path);
    },

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
    bridgeName() {
      const app = this.appList?.find(
        (item) => item.id === this.obj?.bridgeSubAppId
      );

      return app?.name || "";
    },
  },

  data() {
    let // 路径集合
      _form: any; // 表单实例

    // 表单实例
    const _rules = {
      "obj-oid": [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
      "obj-name": [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
    };

    return {
      form: _form,
      rules: _rules,
      formState: {
        "obj-oid": this.obj.oid,
        "obj-name": this.obj.name,
        "obj-path": "",
      },
      copyTypes: [],
    };
  },

  beforeCreate() {
    this.form = this.formRef;
    getCopyTypes().then((res) => {
      const typeObj = JSON.parse(res || "");

      this.copyTypes = Object.keys(typeObj).map((type) => ({
        value: Number(type),
        label: typeObj[type],
      }));
    });
  },

  methods: {
    getEvents(events) {
      return JSON.stringify(
        this.events.flatMap((v) => (events.includes(v.id) ? [v.code] : []))
      );
    },

    copyParam(type: number) {
      const params = {
        type,
        objId: this.id,
        reqPoolId: this.reqPoolId,
        historyId: this.historyId,
      };

      getCopyData(params).then(useCopy);
    },
    onObjTypeChange(e) {
      this.obj.type = e.target.value;
      Bus.$emit("objTypeChange", e.target.value);
    },
    onConsistencyChange() {
      this.$emit("consistencyChange");
    },
    // 删除某个标签
    removePath(index) {
      this.obj.routePathIds.splice(index, 1);
    },
    // 清除所有路径数据
    clearPath(key) {
      this.obj.routePathIds = [];
      this.formState[key] = "";
      this.$forceUpdate();
    },
  },
});
</script>

<style lang="less">
.g-base-form {
  .u-info-item .label {
    margin-right: 10px;
  }
}
.image-upload {
  width: 290px;
  height: 220px;
  padding: 8px 0 0 8px;
  margin-left: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f6f7fa;
  &--detail {
    flex: none;
    width: 390px;
    height: 280px;
    padding: 0;
    overflow: hidden;
    background: rgba(128, 128, 128, 0.5);
  }
}
.image-total {
  margin: 0 0 10px 24px;
  color: #103ffa;
}
</style>
<style scoped="true" lang="less">
.g-base-form :deep(.ant-form-item-label) {
  width: 90px;
}
</style>

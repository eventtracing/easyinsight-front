<template>
  <div>
    <div class="text-title">基本信息</div>
    <div class="flex-ac g-mt-12 g-pl-8">
      <u-info class="flex-1-w" :labelWidth="80" size="large">
        <u-info-item label="对象类型">{{
          obj.type === ObjTypeEnum.PAGE ? "页面" : "元素"
        }}</u-info-item>
        <u-info-item label="对象优先级">{{ obj.priority }}</u-info-item>
        <u-info-item label="对象ID(oid)">{{ obj.oid }}</u-info-item>
        <u-info-item label="路由">{{
          (obj.diffRoutePaths || []).map((v) => v.path).join(",")
        }}</u-info-item>
        <u-info-item label="对象名称">{{ obj.name }}</u-info-item>
        <u-info-item label="对象描述">{{
          obj.description || "无"
        }}</u-info-item>
        <u-info-item label="标签">
          <ObjTagSelect
            v-if="obj.tags && obj.tags.length"
            :tags="obj.tags"
            :disabled="true"
          ></ObjTagSelect>
          <span v-else>无</span>
        </u-info-item>
      </u-info>
      <s-upload-image
        v-if="obj.imgUrls && obj.imgUrls.length"
        class="image-upload"
        v-model="obj.imgUrls"
        :disabled="true"
      ></s-upload-image>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ObjTagSelect from "@/views/home/tracker/object/list/ObjTagSelect.vue";
import { ObjTypeEnum } from "@/types/object.type";
export default defineComponent({
  name: "BaseInfoForm",
  components: {
    ObjTagSelect,
  },
  setup() {
    const _ObjTypeEnum = ObjTypeEnum;

    return { ObjTypeEnum: _ObjTypeEnum };
  },
  props: {
    obj: {},
  },
});
</script>

<style lang="less" scoped="true">
.image-upload {
  width: 280px;
  height: 190px;
  padding: 8px 0 0 8px;
  margin-left: 24px;
  background: #f6f7fa;
  overflow-y: auto;
}
</style>

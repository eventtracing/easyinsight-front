<template>
  <u-drawer
    class="param-config-drawer"
    :width="1000"
    :visible="true"
    @handlerClose="handleClose"
  >
    <template #title="">
      <div>{{ title }}</div>
      <div style="font-size: 13px; margin-top: 4px">
        <span>{{ codeStr }}</span>
        <span style="margin-left: 60px">{{ nameStr }}</span>
      </div>
    </template>
    <div class="fill flex">
      <VersionConfig
        :entityId="entityId"
        :entityType="entityType"
        @active="onSetActive"
      ></VersionConfig>
      <div class="flex-1">
        <ParamConfig
          v-if="activeVersion"
          :versionId="activeVersion && activeVersion.id"
          :versionName="activeVersion && activeVersion.name"
          :entityId="entityId"
          :entityType="entityType"
          :canEdit="canEdit"
          @updateVersionName="updateVersionName"
        ></ParamConfig>
      </div>
    </div>
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VersionConfig from "./VersionConfig.vue";
import ParamConfig from "./ParamConfig.vue";
import { VersionDto, EntityTypeEnum } from "@/types/version.type";
export default defineComponent({
  name: "ParamConfigDrawer",
  components: { VersionConfig, ParamConfig },
  props: {
    entityId: {},
    entityType: {},
    code: {},
    name: {},
  },
  computed: {
    title() {
      return this.entityType === EntityTypeEnum.TERMINAL
        ? `参数管理 - 全局公参`
        : `参数管理 - 事件公参`;
    },

    codeStr() {
      return this.entityType === EntityTypeEnum.TERMINAL
        ? `终端ID：${this.entityId}`
        : `事件编码：${this.code}`;
    },

    nameStr() {
      return this.entityType === EntityTypeEnum.TERMINAL
        ? `终端名称：${this.name}`
        : `事件名称：${this.name}`;
    },

    canEdit() {
      return !this.activeVersion?.preset && !this.activeVersion?.currentUsing;
    },
  },

  data() {
    const _activeVersion: VersionDto = null;

    return {
      activeVersion: _activeVersion,
    };
  },

  methods: {
    onSetActive(version: VersionDto) {
      this.activeVersion = version;
    },

    updateVersionName(name: string) {
      this.activeVersion && (this.activeVersion.name = name);
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

<style lang="less">
.param-config-drawer.ant-drawer {
  .ant-drawer-header {
    padding-bottom: 12px !important;
  }
  .ant-drawer-main {
    padding: 0 !important;
  }
}
</style>

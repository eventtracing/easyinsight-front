<template>
  <div class="g-position">
    <a-tabs
      :animated="false"
      style="margin-top: -16px"
      @change="changeActiveKey"
    >
      <a-tab-pane :key="1" tab="对象信息">
        <ObjectViewForm
          :id="id"
          :historyId="historyId"
          :requireId="requireId"
          :conditions="filterConditions"
          :reqPoolId="reqPoolId"
          @getObjImage="getObjImage"
        ></ObjectViewForm>
      </a-tab-pane>
      <a-tab-pane :key="2" tab="血缘关系">
        <div style="height: calc(100vh - 150px)">
          <LineageTab
            :id="id"
            :conditions="conditions"
            :objImage="objImage"
            :fromObjectManage="true"
            :reqPoolId="reqPoolId"
            v-if="$attrs.fromObjectManage"
          ></LineageTab>
          <ObjectViewLineage
            :objImage="objImage"
            :trackerId="trackerId"
            :reqPoolId="reqPoolId"
            :terminalId="terminalId"
            :id="id"
            v-else
          ></ObjectViewLineage>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="3" tab="样例数据" v-if="$attrs.fromObjectManage">
        <div style="height: calc(100vh - 150px)">
          <sample-data
            :id="id"
            :historyId="historyId"
            :conditions="filterConditions"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ObjectViewForm from "../../object/list/ObjectViewForm.vue";
import ObjectViewLineage from "../../object/list/ObjectViewLineage.vue";
import SampleData from "../../object/list/SampleData.vue";
import LineageTab from "../../object/detail/LineageTab.vue";

interface FilterDto {
  terminalId: number;
  versionId: number;
}

export default defineComponent({
  name: "ObjectViewDrawer",
  components: {
    ObjectViewForm,
    ObjectViewLineage,
    SampleData,
    LineageTab,
  },
  props: {
    id: {},
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    fromObjectManage: {},
    trackerId: {},
    propsTerminalId: {},
    historyId: {},
    requireId: {},
    conditions: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    filterConditions() {
      return {
        terminalId: this.terminalId,
        terminalVersionId: this.versionId,
        versionId: this.versionId,
      };
    },
  },

  data() {
    return {
      objImage: [],
      versionId: this.conditions.versionId,
      terminalId: this.conditions.terminalId || this.propsTerminalId,
    };
  },

  methods: {
    changeActiveKey(key) {
      this.$emit("changeActiveKey", key);
    },
    getObjImage(image) {
      this.objImage = image;
    },
    async onFilterChange(conditions: FilterDto, init) {
      const { terminalId, versionId } = conditions;

      this.terminalId = terminalId;
      this.versionId = versionId;

      !init && this.$emit("change");
    },
  },
});
</script>

<style scoped lang="less">
.c-object__container .ant-tabs {
  overflow: unset;
}
.c-top__filter {
  position: absolute;
  right: 0px;
  top: 7px;
  z-index: 10;
}
.c-object__container .c-top__filter {
  right: 30px;
  top: 15px;
}
.g-position {
  position: relative;
}
</style>

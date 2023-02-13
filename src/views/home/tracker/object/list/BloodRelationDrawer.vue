<template>
  <u-drawer
    title="血缘关系"
    class="blood-relation-drawer"
    :width="1000"
    :maskClosable="true"
    :visible="true"
    @handlerClose="handleClose"
  >
    <BloodRelation
      :conditions="{
        versionId: conditions.versionIds,
        terminalId: conditions.terminalIds,
      }"
      :id="id"
      :objImage="objImage"
    ></BloodRelation>
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import BloodRelation from "./blood-relation/index.vue";
export default defineComponent({
  name: "BloodRelationDrawer",
  components: {
    BloodRelation,
  },
  props: {
    id: {},
    objImage: {
      type: Array,
      default: () => [],
    },
    conditions: {
      type: Object as PropType<{
        versionIds?: number[];
        terminalIds?: number[];
      }>,
      default: () => ({
        versionIds: undefined,
        terminalIds: undefined,
      }),
    },
  },
  methods: {
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

<style lang="less">
.blood-relation-drawer {
  .ant-drawer-main {
    padding-top: 16px !important;
  }
}
</style>

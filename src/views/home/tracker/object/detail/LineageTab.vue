<template>
  <div class="fill flex">
    <div class="flex-1 fill">
      <BloodRelation
        :conditions="conditions"
        :fromObjectManage="fromObjectManage"
        :objImage="objImage"
        :id="id"
        :releasedId="releasedId"
        :reqPoolId="reqPoolId"
      ></BloodRelation>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BloodRelation from "../list/blood-relation/index.vue";
import ImagePreviewModal from "./ImagePreviewModal.vue";
export default defineComponent({
  name: "LineageTab",
  components: {
    BloodRelation,
  },
  props: {
    id: {},
    releasedId: {},
    reqPoolId: {},
    fromObjectManage: {
      type: Boolean,
      default: false,
    },
    objImage: {},
    conditions: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  methods: {
    onPreview(url) {
      this.$createInstance(ImagePreviewModal, { imgSrc: url });
    },
  },
});
</script>

<style lang="less" scoped="true">
.right {
  width: 310px;
  border: 1px solid #e8e8f0;
  margin-left: 24px;
  margin-top: 40px;

  .title {
    padding: 8px 0 8px 12px;
    line-height: 24px;
    border-bottom: 1px solid #e8e8f0;
  }

  .img-list {
    padding: 4px 16px 16px 4px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    .img-item {
      flex: 1;
      height: 125px;
      min-width: 100px;
      margin-top: 12px;
      margin-left: 12px;
      cursor: pointer;
      position: relative;

      .preview-wrapper {
        visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }

      &:hover .preview-wrapper {
        visibility: visible;
      }
    }
  }
}
</style>

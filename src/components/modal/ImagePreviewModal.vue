<template>
  <a-modal
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
    wrapClassName="img-preview-modal"
  >
    <template v-slot:title="">
      <span>图片预览</span>
      <span style="margin-left: 48px">
        <u-icon-button icon="zoom-in" title="放大" @click="zoomIn"></u-icon-button>
        <u-icon-button icon="zoom-out" class="g-ml-8" title="缩小" @click="zoomOut"></u-icon-button>
      </span>
    </template>
    <img alt="" class="img-preview" :src="imgSrc" :style="previewImageStyle" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
const zoomFactor = 1.25
export default defineComponent({
  name: 'ImagePreviewModal',
  props: {
    imgSrc: {}
  },
  computed: {
    previewImageStyle() {
      return {
        transform: `scale(${this.scale})`,
        'transform-origin': 'top left'
      }
    }
  },

  data() {
    const _visible = true
    const _zoomValue = 0
    const _scale = 1
    return {
      visible: _visible,
      zoomValue: _zoomValue,
      scale: _scale
    }
  },

  methods: {
    zoomIn() {
      this.zoomValue++
      this.scale = Math.pow(zoomFactor, this.zoomValue)
    },

    zoomOut() {
      this.zoomValue--
      this.scale = Math.pow(zoomFactor, this.zoomValue)
    },

    handleCancel() {
      this.visible = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.scale = 1
        }, 200)
      })
      this.$emit('close')
    }
  }
})
</script>

<style lang="less" scoped="true">
.img-preview {
  object-fit: contain;
  user-select: none;
}
</style>
<style lang="less">
.img-preview-modal .ant-modal {
  width: max-content !important;

  .ant-modal-body {
    min-width: 600px;
    max-width: 80vw;
    min-height: 400px;
    max-height: 70vh;
    overflow: auto;
  }
}
</style>

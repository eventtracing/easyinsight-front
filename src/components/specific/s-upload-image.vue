<template>
  <div class="u-img-upload" :class="`u-img-upload--${size}`">
    <a-carousel arrows="" v-if="isDetail">
      <template #prevArrow
        ><div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <LeftCircleOutlined /></div
      ></template>
      <template #nextArrow
        ><div class="custom-slick-arrow" style="right: 10px; z-index: 1">
          <RightCircleOutlined /></div
      ></template>
      <div class="m-image__box" v-for="img in fileList" :key="img.uid">
        <img class="m-image-preview" :src="img.url" />
        <EyeOutlined class="m-icon__preview" @click="handlePreview(img)" />
        <div class="m-image__mask"></div>
      </div>
    </a-carousel>
    <a-upload
      style="margin-left: 0px"
      action="/api/eis/v1/image/upload"
      accept=".png,.jpg,.jpeg,.svg,.bmp"
      listType="picture-card"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      :disabled="isDetail"
      @preview="handlePreview"
      @change="handleChange"
      v-else
    >
      <template v-if="!isDetail">
        <PlusOutlined style="font-size: 20px" />
        <div style="color: #888">上传图片</div>
      </template>
    </a-upload>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import uploadRequest, {
  getFile,
  getBase64,
  getFileItem,
  fileToObject,
} from "./upload-request.js";
import {
  EyeOutlined,
  PlusOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  name: "s-upload-image",
  components: {
    LeftCircleOutlined,
    RightCircleOutlined,
    EyeOutlined,
    PlusOutlined,
  },
  model: {
    prop: "imgUrls",
    event: "change",
  },
  props: {
    canPaste: { type: Boolean, default: true },
    isDetail: { type: Boolean, default: false },
    size: { type: String, default: "middle" },
    disabled: { type: Boolean, default: false },
    imgUrls: { type: Array, default: () => [] },
  },

  data() {
    const _fileList: Record<string, any>[] = [];

    return { fileList: _fileList };
  },

  created() {
    this.genFileList();
  },

  mounted() {
    document.addEventListener("paste", this.handlePaste);
  },

  beforeUnmount() {
    document.removeEventListener("paste", this.handlePaste);
  },

  methods: {
    handlePaste(e) {
      if (!this.canPaste) return;

      const file = getFile(e);

      if (file && this.beforeUpload(file)) {
        const targetItem = fileToObject(file);
        targetItem.status = "uploading";
        this.fileList.push(targetItem);

        uploadRequest({
          action: "/api/eis/v1/image/upload",
          file: file,
          onProgress: (e) => {
            const targetItem = getFileItem(file, this.fileList); // removed

            // removed
            if (!targetItem) return;

            targetItem.percent = e.percent;
            this.handleChange({ fileList: this.fileList });
          },
          onSuccess: (ret, xhr) => {
            const targetItem = getFileItem(file, this.fileList); // removed

            // removed
            if (!targetItem) return;

            targetItem.status = "done";
            targetItem.response = ret;
            targetItem.xhr = xhr;

            this.handleChange({ fileList: this.fileList });
          },
          onError: (err, ret) => {
            const targetItem = getFileItem(file, this.fileList); // removed

            // removed
            if (!targetItem) return;

            targetItem.error = err;
            targetItem.response = ret;
            targetItem.status = "error";

            this.handleChange({ fileList: this.fileList });
          },
        });
      }

      return file;
    },

    genFileList() {
      if (this.imgUrls?.length) {
        this.fileList = this.imgUrls.map((url, i) => ({
          uid: `-${i + 1}`,
          name: `image-${i}.png`,
          status: "done",
          url,
        }));
      }
    },

    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isLt5M) {
        this.$message.error("图片大小不超过 5MB!");
      }

      return isLt5M;
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      const index = this.fileList.findIndex(
        (v) =>
          v.url === file.url || v.url === file.thumbUrl || v.url === v.preview
      );

      this.$preview({
        imageLists: this.fileList,
        initialIndex: index,
      });
    },

    handleChange({ fileList }) {
      this.fileList = fileList.filter((f) => {
        f.url = f.url || f.thumbUrl;
        return !f.size || f.size / 1024 / 1024 < 5;
      });

      this.fileList.forEach((f) => {
        f.url = f.response?.result || f.url;
      });

      if (this.fileList.every((f) => f.status === "done")) {
        const urls = this.fileList.map((f) => f?.response?.result || f.url);

        this.$emit("update:imgUrls", urls);
      }
    },

    watchImgUrls() {
      if (this.imgUrls?.length !== this.fileList.length) {
        this.genFileList();
      }
    },
  },
  watch: {
    imgUrls: {
      handler: "watchImgUrls",
    },
  },
});
</script>

<style lang="less" scoped="true">
.u-img-upload {
  --width: 300px;
  --height: 270px;
  &&--mini {
    --width: 210px;
    --height: 180px;
  }
}
.u-img-upload :deep(.ant-upload-picture-card-wrapper) {
  .ant-upload-list-picture-card-container,
  .ant-upload-list-picture-card .ant-upload-list-item,
  .ant-upload.ant-upload-select-picture-card {
    width: 80px;
    height: 80px;
  }
}
.m-image-preview {
  width: 100%;
  height: var(--height);
  object-fit: contain;
}

.m-image__box {
  height: var(--height);
  overflow: hidden;
  width: var(--width) !important;
  position: relative;
  .m-image__mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 0;
    top: 5px;
    display: none;
  }
  .m-icon__preview {
    opacity: 0;
    cursor: pointer;
    font-size: 26px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
  &:hover {
    .m-icon__preview {
      opacity: 1;
    }
    .m-image__mask {
      display: block;
    }
  }
}
.ant-carousel :deep(.slick-slide) {
  height: calc(var(--width) + 10px);
  text-align: center;
  overflow: hidden;
}

.ant-carousel :deep(.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  transform: translateY(-50%);
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
</style>

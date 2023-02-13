<template>
  <div :class="fullscreen && 'fullscreen'">
    <div ref="toolbar">
      <span class="ql-formats" style="margin-right: 4px">
        <u-icon-button
          :iconFont="fullscreen ? 'recover' : 'fullscreen'"
          style="color: #000; font-size: 14px"
          @click="changeFullSize"
        ></u-icon-button>
      </span>
      <span class="ql-formats">
        <button class="ql-bold">Bold</button>
        <button class="ql-italic">Italic</button>
        <button class="ql-underline">underline</button>
      </span>
      <span class="ql-formats">
        <button class="ql-header" value="1">H1</button>
        <button class="ql-header" value="2">H2</button>
        <button class="ql-header" value="3">H3</button>
        <button class="ql-header" value="4">H4</button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button
      ></span>
      <span class="ql-formats">
        <select class="ql-size">
          <option value="small"></option>
          <option selected=""></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
      </span>
      <span class="ql-formats">
        <select class="ql-color">
          <option selected="selected"></option>
          <option value="#e60000"></option>
          <option value="#ff9900"></option>
          <option value="#ffff00"></option>
          <option value="#008a00"></option>
          <option value="#0066cc"></option>
          <option value="#9933ff"></option>
          <option value="#ffffff"></option>
          <option value="#facccc"></option>
          <option value="#ffebcc"></option>
          <option value="#ffffcc"></option>
          <option value="#cce8cc"></option>
          <option value="#cce0f5"></option>
          <option value="#ebd6ff"></option>
          <option value="#bbbbbb"></option>
          <option value="#f06666"></option>
          <option value="#ffc266"></option>
          <option value="#ffff66"></option>
          <option value="#66b966"></option>
          <option value="#66a3e0"></option>
          <option value="#c285ff"></option>
          <option value="#888888"></option>
          <option value="#a10000"></option>
          <option value="#b26b00"></option>
          <option value="#b2b200"></option>
          <option value="#006100"></option>
          <option value="#0047b2"></option>
          <option value="#6b24b2"></option>
          <option value="#444444"></option>
          <option value="#5c0000"></option>
          <option value="#663d00"></option>
          <option value="#666600"></option>
          <option value="#003700"></option>
          <option value="#002966"></option>
          <option value="#3d1466"></option>
        </select>
        <select class="ql-background">
          <option value="#000000"></option>
          <option value="#e60000"></option>
          <option value="#ff9900"></option>
          <option value="#ffff00"></option>
          <option value="#008a00"></option>
          <option value="#0066cc"></option>
          <option value="#9933ff"></option>
          <option selected="selected"></option>
          <option value="#facccc"></option>
          <option value="#ffebcc"></option>
          <option value="#ffffcc"></option>
          <option value="#cce8cc"></option>
          <option value="#cce0f5"></option>
          <option value="#ebd6ff"></option>
          <option value="#bbbbbb"></option>
          <option value="#f06666"></option>
          <option value="#ffc266"></option>
          <option value="#ffff66"></option>
          <option value="#66b966"></option>
          <option value="#66a3e0"></option>
          <option value="#c285ff"></option>
          <option value="#888888"></option>
          <option value="#a10000"></option>
          <option value="#b26b00"></option>
          <option value="#b2b200"></option>
          <option value="#006100"></option>
          <option value="#0047b2"></option>
          <option value="#6b24b2"></option>
          <option value="#444444"></option>
          <option value="#5c0000"></option>
          <option value="#663d00"></option>
          <option value="#666600"></option>
          <option value="#003700"></option>
          <option value="#002966"></option>
          <option value="#3d1466"></option>
        </select>
      </span>
      <span class="ql-formats">
        <select class="ql-align">
          <option selected="selected"></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
        <button class="ql-image" value="image"></button>
      </span>
    </div>
    <div :class="['editor']" ref="quillEditor"></div>
    <form
      action=""
      method="post"
      enctype="multipart/form-data"
      id="uploadFormMulti"
    >
      <input
        style="display: none"
        :id="uniqueId"
        type="file"
        name="file"
        multiple=""
        accept="image/jpg, image/jpeg, image/png, image/gif"
        @change="uploadImg('uploadFormMulti')"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

// https://github.surmon.me/vue-quill-editor/
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import ImageResize from "quill-image-resize-module";
import { ImageDrop } from "quill-image-drop-module";

// https://www.kancloud.cn/liuwave/quill/1434142
import uploadRequest from "./upload-request.js";

const Quill = window.Quill;

Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);

export default defineComponent({
  name: "s-editor",
  props: {
    value: {},
  },
  computed: {
    editor() {
      return this.myQuillEditor && this.myQuillEditor.quill;
    },
  },

  data() {
    const _uniqueId = "uniqueId";
    const _content = "";

    const _editorOption = reactive({
      placeholder: "请输入",
      theme: "snow", // 主题
      modules: {
        imageDrop: true,
        imageResize: {
          displayStyles: {
            backgroundColor: "black",
            border: "none",
            color: "white",
          },
          modules: ["Resize", "DisplaySize", "Toolbar"],
        },
        toolbar: "#toolbar",
      },
    });

    // 富文本编辑器配置
    return {
      editorOption: _editorOption,
      uniqueId: _uniqueId,
      fullscreen: false,
      myQuillEditor: null,
      content: _content,
    };
  },

  mounted() {
    const imgHandler = (image) => {
      if (image) {
        const $fileInput: any = document.getElementById(this.uniqueId);

        $fileInput.click();
      }
    };

    this.$nextTick().then(() => {
      this.editorOption.modules.toolbar = this.$refs.toolbar;
      this.myQuillEditor = new Quill(this.$refs.quillEditor, this.editorOption);
      this.myQuillEditor.quill &&
        this.myQuillEditor.quill
          .getModule("toolbar")
          .addHandler("image", imgHandler);
      this.myQuillEditor.root.innerHTML = this.content;
      this.myQuillEditor.on("editor-change", (type, ...arg) => {
        if (type === "text-change") {
          this.onEditorChange(arg);
        }
      });
    });
  },

  methods: {
    changeFullSize() {
      this.fullscreen = !this.fullscreen;
    },
    // 上传图片
    uploadImg() {
      const formData = new FormData();
      const $fileInput: any = document.getElementById(this.uniqueId);
      formData.append("file", $fileInput.files[0]);

      try {
        // 上传
        uploadRequest({
          action: "/api/eis/v1/image/upload",
          file: $fileInput.files[0],
          onSuccess: (res: any) => {
            if (res && res.code === 0) {
              const url = res.result || "";
              // 将图片地址插入到光标位置
              const range = this.editor.getSelection();

              this.editor.insertEmbed(
                range != null ? range.index : 0,
                "image",
                url
              );
            }
          },
        });
      } catch (e) {
        $fileInput.value = "";
      }
    },

    onEditorChange() {
      this.content = this.myQuillEditor.root.innerHTML;
      this.$emit("change", this.content);
    },

    defalutVal() {
      if (!this.value) return;

      this.content = this.value;
      this.myQuillEditor && (this.myQuillEditor.root.innerHTML = this.content);
    },
  },
  watch: {
    value: { handler: "defalutVal", immediate: true },
  },
});
</script>

<style lang="less">
.fullscreen {
  height: 100vh;
  width: 100vw;
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
}
.editor {
  line-height: normal !important;
  background: #fff;
}
.ql-container {
  min-height: 350px;
  .ql-editor {
    min-height: 350px;
  }
}
.ql-snow {
  background: #fff;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>

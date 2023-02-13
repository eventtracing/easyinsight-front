<template>
  <div style="position: relative">
    <template v-if="type === 1">
      <a-tag
        v-for="{ key, value } in tags"
        :key="key"
        :closable="!disabled"
        @close="onRemoveTag(key)"
      >
        {{ value }}
      </a-tag>
    </template>
    <a-dropdown
      v-if="showTag || !disabled"
      :disabled="disabled"
      :trigger="['click']"
      v-model:visible="visible"
      :getPopupContainer="(triggerNode) => triggerNode.parentNode"
      @visibleChange="onVisibleChange"
    >
      <slot>
        <a-button size="small" style="font-size: 12px; height: 22px">
          <PlusOutlined /> 添加标签
        </a-button>
      </slot>
      <template #overlay
        ><div class="overlay-wrapper">
          <div class="top flex-ac">
            <span class="text-title flex-1">添加标签</span>
            <u-text-button :on-click="onOk">确定</u-text-button>
          </div>
          <div class="body">
            <u-info-item label="选择标签" size="large">
              <a-select
                :options="
                  list.map((item) => ({ value: item.id, label: item.name }))
                "
                style="width: 280px"
                mode="multiple"
                placeholder="请选择"
                v-model:value="selectedTags"
                :filterOption="filterOption"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                :open="open"
                @focus="() => (open = true)"
                v-click-outside="() => (open = false)"
              >
                <template #dropdownRender="{ menuNode: menu }">
                  <div @click.stop>
                    <v-nodes :vnodes="menu"></v-nodes>
                    <a-divider style="margin: 4px 0"></a-divider>
                    <div
                      v-if="!inputing"
                      class="text-link"
                      style="padding: 4px 8px; cursor: pointer"
                      @mousedown="(e) => e.preventDefault()"
                      @click="() => (inputing = true)"
                    >
                      <PlusOutlined /> 新建标签
                    </div>
                    <div v-else class="flex-ac g-p-8" @click.stop>
                      <a-input
                        class="flex-1"
                        placeholder="请输入标签名"
                        v-model:value="newTag"
                      />
                      <u-text-button class="g-ml-12" :on-click="onCreateTag">
                        确定
                      </u-text-button>
                      <u-text-button
                        class="u-dropdown-btn"
                        :on-click="onCancelInputing"
                      >
                        取消
                      </u-text-button>
                    </div>
                  </div>
                </template>
              </a-select>
            </u-info-item>
          </div>
        </div></template
      >
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ItemDto } from "@/types/common.type";
import { getTagList, createTag } from "@/services/tag.service";
import { PlusOutlined } from "@ant-design/icons-vue";
import Bus from "@/bus";

export default defineComponent({
  name: "ObjTagSelect",
  components: {
    PlusOutlined,
    VNodes: {
      functional: true,
      props: {
        vnodes: {},
      },
      render: (ctx) => ctx.vnodes,
    },
  },
  props: {
    tags: {
      type: Array as PropType<{ key: number; value: string }[]>,
      default: () => [],
    },
    type: {
      default: 1,
      type: Number,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showTag: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const { type, tags } = this;
    const _list: ItemDto[] = [];
    const _visible = false;
    const _selectedTags = type === 2 ? tags.map((v) => Number(v.key)) : [];
    const _open = false;
    const _inputing = false;
    const _newTag = "";

    return {
      list: _list,
      visible: _visible,
      selectedTags: _selectedTags,
      open: _open,
      inputing: _inputing,
      newTag: _newTag,
    };
  },

  async created() {
    const result = await getTagList({
      currentPage: 1,
      pageSize: 100,
      search: "",
      type: this.type,
    });

    this.list = result?.list;
  },

  watch: {
    visible(n) {
      this.type === 2 &&
        n &&
        (this.selectedTags = this.tags.map((v) => Number(v.key)));
    },
  },

  methods: {
    filterOption(input: any, option: any) {
      if ("children" in option) {
        return (
          option.children[0].children
            ?.toUpperCase()
            .indexOf(input.trim().toUpperCase()) >= 0
        );
      }

      return option.label.indexOf(input) > -1;
    },

    onRemoveTag(id) {
      const idx = this.tags.findIndex((v) => v.key === id);

      this.tags.splice(idx, 1);

      Bus.$emit("tagSelectChange", this.tags);
    },

    async onCreateTag() {
      const id = await createTag(this.newTag, this.type);

      if (!this.list.find((v) => v.id === id)) {
        this.list.push({ id: id, name: this.newTag });
      }

      if (!this.selectedTags.includes(id)) {
        this.selectedTags.push(id);
      }

      this.newTag = "";
      this.inputing = false;
    },

    onCancelInputing() {
      this.newTag = "";
      this.inputing = false;
    },

    onOk() {
      this.type === 2 && (this.tags.length = 0);

      this.selectedTags.forEach((id) => {
        if (!this.tags.find((v) => v.key === id)) {
          const name = this.list.find((v) => v.id === id)?.name;

          this.tags.push({ key: id, value: name });
        }
      });

      this.visible = false;

      this.$nextTick(() => {
        this.selectedTags = [];
        this.inputing = false;
        this.newTag = "";
        this.open = false;
      });

      Bus.$emit("tagSelectChange", this.tags);
    },

    onVisibleChange(v) {
      if (v) return;

      this.$nextTick(() => {
        this.selectedTags = [];
        this.inputing = false;
        this.newTag = "";
        this.open = false;
      });
    },
  },
});
</script>

<style lang="less" scoped="true">
.overlay-wrapper {
  width: 400px;
  background: #fff;
  box-shadow: 0px 0px 4px rgba(164, 164, 164, 0.25);
  border-radius: 2px;

  .top {
    border-bottom: 1px solid @border-color-split;
    padding: 16px 16px 10px;
  }

  .body {
    padding: 16px;
    min-height: 200px;
  }
}
</style>

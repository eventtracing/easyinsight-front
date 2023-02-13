<template>
  <div class="fill side flex-column">
    <div class="top flex-ac">
      <span class="flex-1">版本列表</span>
      <u-icon-button
        iconFont="add"
        title="添加"
        class="add-icon g-ml-4"
        @click="onAdd"
      ></u-icon-button>
    </div>
    <div style="padding: 16px 12px 0 16px">
      <a-input placeholder="输入名称搜索" allowClear="" v-model:value="search">
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>
    <div class="g-mt-16 list flex-1">
      <div
        style="text-align: center; margin-top: 40px"
        v-if="!displayVersionList.length"
      >
        暂无数据
      </div>
      <div
        :class="['flex-ac', 'item', item.id === active && 'active']"
        v-for="item in displayVersionList"
        :key="item.id"
      >
        <div
          :class="['flex-1', item.currentUsing && 'using']"
          v-ellipsis-title=""
          @click="setActive(item)"
        >
          <span>{{ item.name }}</span>
          <a-tag v-if="item.currentUsing" class="using-tag" color="green"
            >默认</a-tag
          >
        </div>
        <a-dropdown>
          <u-icon-font type="dots" class="icon-dots"></u-icon-font>
          <template #overlay
            ><a-menu
              @click="onMenuClick($event, item)"
              style="min-width: 100px"
            >
              <a-menu-item key="current" v-if="!item.currentUsing">
                置为默认版本
              </a-menu-item>
              <a-menu-item key="copy"> 复制 </a-menu-item>
              <a-menu-item
                key="delete"
                v-if="!item.preset && !item.currentUsing && !item.used"
              >
                删除
              </a-menu-item>
            </a-menu></template
          >
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VersionAddModal from "./VersionAddModal.vue";
import { VersionDto } from "@/types/version.type";
import {
  getVersionList,
  deleteVersion,
  setCurrentVersion,
  copyVersion,
} from "@/services/version.service";
export default defineComponent({
  name: "VersionConfig",
  props: {
    entityId: {},
    entityType: {},
  },
  computed: {
    displayVersionList() {
      return this.versions.filter((v) => v.name.includes(this.search));
    },
  },

  data() {
    const _versions: VersionDto[] = [];
    const _search = "";
    const _active = null;

    return {
      versions: _versions,
      search: _search,
      active: _active,
    };
  },

  async created() {
    await this.sync();
  },

  methods: {
    async sync() {
      this.versions = await getVersionList({
        search: this.search,
        entityId: this.entityId,
        entityType: this.entityType,
      });

      if (!this.active) {
        this.versions.length && this.setActive(this.versions[0]);
        return;
      }

      // 更新 active 版本的信息
      const v = this.versions.find((item) => item.id === this.active);

      this.setActive(v);
    },

    setActive(version: VersionDto) {
      this.active = version ? version.id : null;
      this.$emit("active", version || null);
    },

    onAdd() {
      this.$createInstance(VersionAddModal, {
        entityId: this.entityId,
        entityType: this.entityType,
        onHandlerOk: async (id) => {
          await this.sync();
          const v = this.versions.find((v) => v.id === id);

          this.setActive(v);
        },
      });
    },

    async onMenuClick(v, item) {
      const key = v.key;
      const data = {
        entityId: this.entityId,
        entityType: this.entityType,
        versionId: item.id,
      };

      try {
        if (key === "current") {
          await setCurrentVersion(data);
          this.$message.success("设置成功");
          this.sync();
        } else if (key === "delete") {
          await deleteVersion(data);
          this.$message.success("删除成功");

          if (item.id === this.active) {
            this.setActive(null);
          }

          this.sync();
        } else if (key === "copy") {
          const instance = this.$createInstance(VersionAddModal, {
            copy: true,
            name: item.name + "_copy",
            onHandlerOk: (name) => {
              return copyVersion({ name, ...data })
                .then(() => {
                  instance.destroy();
                  this.$message.success("复制成功");
                  this.sync();
                })
                .catch((e) => {
                  this.$handleError(e, "复制");
                });
            },
          });
        }
      } catch (e) {
        this.$handleError(e);
      }
    },
  },
});
</script>

<style lang="less" scoped="true">
.side {
  width: 176px;
  border-right: 1px solid #efeff5;

  .top {
    padding: 16px 12px 12px 16px;
    border-bottom: 1px solid #dee2e9;
    color: #1c1e25;
    .add-icon {
      font-size: 20px;
      color: @primary-color;
    }
  }

  .list {
    overflow-y: auto;

    .item {
      position: relative;
      font-size: 12px;
      height: 32px;
      line-height: 32px;
      padding: 0 4px 0 16px;
      cursor: pointer;

      .icon-dots {
        visibility: hidden;
      }

      &.active,
      &:hover {
        background: #f5f8ff;
        color: @primary-color;
        .icon-dots {
          visibility: visible;
        }
      }

      .using {
        padding-right: 50px;
        position: relative;
      }

      .using-tag {
        position: absolute;
        right: 0;
        top: 5px;
        transform: scale(0.8);
        margin-right: 0;
      }
    }
  }
}
</style>

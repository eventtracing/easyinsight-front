<template>
  <div>
    <div class="top flex-ac" style="justify-content: space-between">
      参数名
      <s-sync-button @click="refresh(false)"></s-sync-button>
    </div>
    <div class="main">
      <div class="g-m-lr-16">
        <a-input placeholder="请输入" v-model:value="search">
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
      </div>
      <div class="g-mt-12 list">
        <div v-for="item in searchList" :key="item.id">
          <div
            :class="['item', item.code === active && 'active']"
            v-ellipsis-title=""
            :key="item.id"
            @click="onSelect(item)"
          >
            <span>{{ item.code }}</span>
            <div class="icon-container" @click.stop="">
              <u-icon-button
                iconFont="edit"
                title="编辑"
                @click="onEdit(item)"
              ></u-icon-button>
              <u-icon-button
                iconFont="delete"
                title="删除"
                class="g-ml-4"
                @click="onDelete(item)"
              ></u-icon-button>
              <u-icon-button
                iconFont="add"
                title="添加"
                class="g-ml-4"
                @click="onAdd(item)"
                v-auth="1018"
              ></u-icon-button>
            </div>
          </div>
          <ul v-if="item.params && item.params.length">
            <li
              v-for="param in item.params"
              :key="param.id"
              class="param-item"
              @click="onSelect(item)"
            >
              {{ param.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <a-modal v-model:visible="visible" title="编辑" @ok="editObjectParams">
      <div class="flex-ac">
        <span class="g-mr-8" style="flex: none">私参名称: </span>
        <a-input
          placerholder="请输入对象业务私参名称"
          v-model:value="activeObject.code"
        ></a-input>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BusinessParamAddOrEditModal from "./BusinessParamAddOrEditModal.vue";
import { ParamPoolItemDto } from "@/types/parameter.type";
import {
  getAllBusinessParamPool,
  editBusinessParamPoolItem,
  deleteBusinessParamPoolItem,
} from "@/services/parameter.service";

export default defineComponent({
  name: "BussinessParamPool",

  data() {
    const _list: any[] = [];
    const _search = "";
    const _active = "";
    const _visible = false;
    const _activeObject: Partial<ParamPoolItemDto> = {};

    return {
      list: _list,
      search: _search,
      active: _active,
      visible: _visible,
      activeObject: _activeObject,
    };
  },

  computed: {
    searchList() {
      return this.handleList(this.list, this.search);
    },
  },

  async created() {
    const search = this.getQueryParams("search");
    const activeId = this.getQueryParams("activeId");

    search && (this.search = search);

    await this.getPoolList();

    this.list.length &&
      this.setActive(activeId ? activeId.toString() : this.list[0].code);
  },

  methods: {
    async getPoolList() {
      this.setQueryParams("search", this.search);

      const list = await getAllBusinessParamPool(this.search);
      this.list = list;
    },

    setActive(code: string) {
      this.active = code;
      this.$emit("active", code);
    },

    onSelect(item: ParamPoolItemDto) {
      this.active !== item.code && this.setActive(item.code);
    },

    onAdd(item: ParamPoolItemDto) {
      this.$createInstance(BusinessParamAddOrEditModal, {
        code: item.code,
        onHandlerOk: () => {
          this.$emit("add");
        },
      });
    },

    onDelete(item: ParamPoolItemDto) {
      this.$confirm({
        title: "确定要删除吗？",
        content: `参数code：${item.code}`,
        onOk: () => {
          deleteBusinessParamPoolItem(item.id)
            .then(() => {
              this.$message.success("删除成功");
              this.refresh(false);
            })
            .catch((e) => {
              this.$warning({
                title: e.message,
              });
            });
        },
      });
    },

    onEdit(item) {
      this.activeObject = { ...item };
      this.visible = true;
    },

    // 编辑对象业务私参名称
    editObjectParams() {
      const { id, code } = this.activeObject;

      editBusinessParamPoolItem(id, code).then(() => {
        this.visible = false;
        this.$message.success("编辑成功~");
        this.getPoolList();
      });
    },

    async refresh(reset = true) {
      reset && (this.search = "");

      await this.getPoolList();

      if (
        !this.active ||
        this.list.findIndex((v) => v.code === this.active) === -1
      ) {
        this.setActive(this.list[0]?.code);
      }
    },

    handleList(list, search = "") {
      if (search === "") return list;

      return list?.filter((item) => {
        const { code, params = [], name = "" } = item;

        if (code.includes(search) || name.includes(search)) return item;

        if (params && params.length) {
          const childParams = this.handleList(params, search);

          if (childParams && childParams.length) {
            item.params = childParams;
            return true;
          }
        }

        return false;
      });
    },
  },
});
</script>

<style lang="less" scoped="true">
.top {
  padding: 0 16px 10px;
  border-bottom: 1px solid #dee2e9;
}
.main {
  padding: 16px 0;
  .list {
    height: calc(100vh - 215px);
    overflow-y: auto;
    /* 设置滚动条的样式 */
    &::-webkit-scrollbar {
      width: 4px;
      height: 8px;
    }
  }

  .param-item {
    padding: 5px 0 5px 30px;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background: #f5f8ff;
      color: @primary-color;
    }
  }
  .item {
    position: relative;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    padding: 0 48px 5px 16px;
    cursor: pointer;
    border-top: 1px solid #f1f1fb;

    .icon-container {
      display: none;
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 15px;
    }

    &:hover,
    &.active {
      background: #f5f8ff;
      color: @primary-color;

      .icon-container {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>

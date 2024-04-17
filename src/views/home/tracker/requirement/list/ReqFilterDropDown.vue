<template>
  <a-dropdown
    :trigger="['click']"
    :visible="visible"
    @visibleChange="onVisibleChange"
  >
    <slot>
      <u-icon-button
        class="g-ml-8"
        iconFont="filter"
        title="筛选"
        :class="['icon-filter', hasFilter && 'active']"
        @click="visible = true"
      ></u-icon-button>
    </slot>
    <template #overlay>
      <div class="filter-block">
        <div class="top flex-ac" @click.stop>
          <span class="text-title flex-1">需求筛选</span>
          <u-text-button class="g-mr-8" :on-click="onOk">确定</u-text-button>
          <u-text-button :disabled="resetBtnDisabled" :on-click="onReset"
            >重置</u-text-button
          >
        </div>
        <div class="body" @click.stop>
          <a-form
            class="normal-form"
            :colon="false"
            labelAlign="left"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            ref="formRef"
          >
            <a-form-item label="需求状态">
              <a-select placeholder="全部" v-model:value="status" allowClear="">
                <a-select-option
                  v-for="t in reqStatusOptions"
                  :key="t.key"
                  :value="t.key"
                  :title="t.value"
                >
                  {{ t.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="创建人">
              <a-select
                placeholder="全部"
                v-model:value="creator"
                allowClear=""
              >
                <a-select-option
                  v-for="t in creators"
                  :key="t.key"
                  :value="t.key"
                  :title="t.value"
                >
                  {{ t.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="数据负责人">
              <a-select placeholder="全部" v-model:value="owner" allowClear="">
                <a-select-option
                  v-for="t in dataOwners"
                  :key="t.key"
                  :value="t.key"
                  :title="t.value"
                >
                  {{ t.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="需求版本">
              <a-select
                placeholder="全部"
                v-model:value="version"
                allowClear=""
              >
                <a-select-option
                  v-for="t in versions"
                  :key="t.key"
                  :value="t.key"
                  :title="t.value"
                >
                  {{ t.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TagAggreDto } from "@/types/common.type";
import { reqStatusOptions, ReqStatusEnum } from "@/types/requirement.type";

export default defineComponent({
  name: "ReqFilterDropDown",
  setup() {
    const _search = "";
    const _reqStatusOptions = reqStatusOptions;
    return {
      search: _search,
      reqStatusOptions: _reqStatusOptions,
    };
  },
  props: {
    condition: {},
    hasFilter: { default: false },
    queryParams: {},
  },
  computed: {
    resetBtnDisabled() {
      return !this.status && !this.creator && !this.owner && !this.version;
    },
    formRef() {
      return this.$refs.formRef;
    },
  },
  data() {
    const _visible = false;
    const _form = null;
    const _status: ReqStatusEnum = null;
    const _creator = "";
    const _owner = "";
    const _version = "";
    const _creators: TagAggreDto[] = [];
    const _dataOwners: TagAggreDto[] = [];
    const _versions: TagAggreDto[] = [];

    return {
      visible: _visible,
      form: _form,
      status: _status,
      creator: _creator,
      owner: _owner,
      version: _version,
      creators: _creators,
      dataOwners: _dataOwners,
      versions: _versions,
    };
  },
  async created() {
    this.form = this.formRef;
    this.status = this.queryParams.status;
    this.creator = this.queryParams.creator;
    this.owner = this.queryParams.owner;
    this.version = this.queryParams.version;
  },
  methods: {
    onReset() {
      this.status = undefined;
      this.creator = undefined;
      this.owner = undefined;
      this.version = undefined;
    },
    onOk() {
      this.$emit("ok", {
        status: this.status,
        creator: this.creator,
        owner: this.owner,
        version: this.version,
      });
      this.visible = false;
    },
    onVisibleChange(v) {
      if (!v) {
        this.$nextTick(() => {
          this.handleConditionChange();
        });
      }
    },
    handleConditionChange() {
      const { status, creator, owner, version } = this.condition;
      this.status = status || undefined;
      this.creator = creator || undefined;
      this.owner = owner || undefined;
      this.version = version || undefined;
    },
  },
  watch: {
    condition: {
      handler: "handleConditionChange",
      immediate: true,
      deep: true,
    },
  },
});
</script>

<style lang="less" scoped="true">
.filter-block {
  width: 400px;
  background: #fff;
  box-shadow: 0px 0px 4px rgba(164, 164, 164, 0.25);
  border-radius: 2px;

  .top {
    border-bottom: 1px solid @border-color-split;
    padding: 16px 16px 10px;
  }

  .body {
    padding: 16px 16px 4px;
  }
}
</style>

<template>
  <div>
    <u-info :labelWidth="80" v-if="req" class="g-mt-8">
      <u-info-item label="需求名称">{{ req.name }}</u-info-item>
      <u-info-item label="解决版本">{{ req.versions || "无" }}</u-info-item>
      <u-info-item class="g-mt-16" label="数据负责人">{{
        dataOwnerText
      }}</u-info-item>
      <u-info-item label="需求状态">
        <status-tag :status="req.status" />
      </u-info-item>
      <u-info-item class="g-mt-16" label="创建人">
        {{ $get(req, "creator.userName", "无") }}
      </u-info-item>
      <u-info-item label="创建时间">
        {{ getTimeStringFromTimestamp(req.createTime) }}
      </u-info-item>
      <u-info-item class="g-mt-16" label="更新人">
        {{ $get(req, "updateUser.userName", "无") }}
      </u-info-item>
      <u-info-item label="更新时间">
        {{ getTimeStringFromTimestamp(req.updateTime) }}
      </u-info-item>
    </u-info>
    <u-info size="large" :labelWidth="80" v-if="req" class="g-mt-16">
      <u-info-item label="描述">
        <div>
          <a-button v-if="!editing" type="primary" size="small" @click="onEdit">
            编辑
          </a-button>
          <template v-else>
            <a-button size="small" @click="() => (editing = false)">
              取消
            </a-button>
            <a-button
              type="primary"
              size="small"
              class="g-ml-16"
              @click="onSave"
            >
              保存
            </a-button>
          </template>
        </div>
        <div class="g-mt-12">
          <div v-if="!editing" v-html="req.description || '无'"></div>
          <div v-else style="width: 100%; max-width: 1000px">
            <s-editor :value="req.description" @change="onDescChange" />
          </div>
        </div>
      </u-info-item>
    </u-info>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StatusTag from "../components/StatusTag.vue";
import { getTimeStringFromTimestamp } from "@/ndsc-vue3/utils/lib";

export default defineComponent({
  name: "BaseInfoTab",
  components: {
    "status-tag": StatusTag,
  },

  setup() {
    const _getTimeStringFromTimestamp = getTimeStringFromTimestamp;

    return {
      getTimeStringFromTimestamp: _getTimeStringFromTimestamp,
    };
  },

  props: {
    req: {},
  },
  computed: {
    dataOwnerText() {
      return this.req
        ? this.req.dataOwners.map((v) => v.userName).join("，") || "无"
        : "无";
    },
  },

  data() {
    const _editing = false;
    const _desc = "";

    return { editing: _editing, desc: _desc };
  },

  methods: {
    onEdit() {
      this.editing = true;
      this.desc = this.req.description;
    },

    onDescChange(v) {
      this.desc = v;
    },

    onSave() {
      this.req.description = this.desc;
      this.editing = false;
    },
  },
});
</script>

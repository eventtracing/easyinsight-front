<template>
  <u-modal
    :visible="true"
    title="导入模板"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <a-form
      :model="formState"
      :colon="false"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="选择模板" required="" name="templates">
        <a-select
          placeholder="请选择"
          mode="multiple"
          :filter-option="false"
          v-model:value="formState.templates"
          :autoClearSearchValue="false"
          @search="onSearch"
        >
          <a-select-option
            v-for="t in list"
            :key="t.id"
            :value="t.id"
            :title="t.name"
          >
            {{ t.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TemplateSimpleDto, TemplateDetailDto } from "@/types/template.type";
import {
  getTempalteList,
  getTemplateDetail,
} from "@/services/template.service";
export default defineComponent({
  name: "TemplateImportModal",
  computed: {
    formRef() {
      return this.$refs.formRef;
    },
  },

  data() {
    const _form = null;
    const _list: TemplateSimpleDto[] = [];
    const _rules = {
      templates: [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
    };
    return {
      form: _form,
      list: _list,
      rules: _rules,
      formState: {},
    };
  },

  async created() {
    this.form = this.formRef;
    this.onSearch("");
  },

  methods: {
    async onSearch(v) {
      const result = await getTempalteList({
        currentPage: 1,
        pageSize: 50,
        search: v,
      });

      this.list = result?.list;
    },
    handleOk() {
      this.$refs.formRef.validateFields().then((values: any) => {
        const p = values.templates.map((id) => getTemplateDetail(id));

        Promise.all(p).then((res) => {
          const binds = res.map((r: TemplateDetailDto) => r.binds).flat(1);

          this.$emit("handlerOk", binds);
        });
      });
    },
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

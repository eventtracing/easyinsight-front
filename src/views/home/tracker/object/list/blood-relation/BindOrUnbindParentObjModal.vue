<template>
  <u-modal :visible="true" :title="title" @cancel="handleClose" @ok="handleOk">
    <a-form
      :form="form"
      :colon="false"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      ref="formRef"
      :rules="rules"
    >
      <template v-if="bind">
        <a-form-item label="选择父对象" required="" name="`parent-objs`">
          <a-select
            placeholder="请选择"
            mode="multiple"
            :filterOption="filterOption"
          >
            <a-select-option
              v-for="t in list"
              :key="t.id"
              :value="t.id"
              :title="t.name"
            >
              {{ `${t.name}（${t.oid}）` }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <template v-else>
        <a-form-item label="选择父对象" required="" name="`parent-objs`">
          <a-select
            placeholder="请选择"
            mode="multiple"
            :filterOption="filterOption"
            v-model="parentObjs"
          >
            <a-select-option
              v-for="t in sonObjList"
              :key="t.id"
              :value="t.id"
              :title="t.name"
            >
              {{ `${t.name}（${t.oid}）` }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ObjSimpleDto, ObjLineageNodeDto } from "@/types/object.type";
import {
  getAllObject,
  bindParentObjects,
  unBindParentObjects,
} from "@/services/object.service";
export default defineComponent({
  name: "BindOrUnbindParentObjModal",
  props: {
    bind: {
      type: Boolean,
      default: true,
    },
    id: {},
    terminalId: {},
    versionId: {},
  },
  computed: {
    title() {
      return this.bind ? "关联父对象" : "解绑父对象";
    },

    formRef() {
      return this.$refs.formRef;
    },
  },
  data() {
    const _form = null;
    const _list: ObjSimpleDto[] = [];
    const _parentObjs: number[] = [];
    const _sonObjList: ObjLineageNodeDto[] = [];
    const _rules = {
      "`parent-objs`": [
        {
          rules: [{ required: true, message: "此字段为必填字段" }],
        },
      ],
    };

    return {
      form: _form,
      list: _list,
      parentObjs: _parentObjs,
      sonObjList: _sonObjList,
      rules: _rules,
    };
  },

  async created() {
    this.form = this.formRef;
    this.parentObjs = this.sonObjList.map((v) => v.id);

    const result = await getAllObject({
      terminalIds: this.terminalId ? [this.terminalId] : [],
      requireIds: [],
      id: this.id,
    });

    this.list = result.filter((v) => !this.parentObjs.includes(v.id));
  },

  methods: {
    filterOption(input: any, option: any) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.trim().toUpperCase()) >= 0
      );
    },

    handleOk() {
      this.form.validateFields({ force: true }, (err: any, values: any) => {
        if (!err) {
          const data = {
            objId: this.id,
            terminalId: this.terminalId,
            terminalVersionId: this.versionId,
            parentObjs: values["parent-objs"],
          };
          const o = this.bind ? bindParentObjects : unBindParentObjects;

          o(data)
            .then(() => {
              this.$message.success(`${this.title}成功`);
              this.$emit("ok");
            })
            .catch((e) => {
              this.$handleError(e, this.title);
            });
        }
      });
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

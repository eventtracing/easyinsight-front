<template>
  <u-modal
    :visible="true"
    title="编辑事件类型"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <a-form
      :model="formState"
      v-if="detail"
      :colon="false"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="事件编码" required="" name="event-code">
        <a-input
          v-model:value="formState['event-code']"
          placeholder="支持英文、数字、'_'和'-'，不超过64个字符"
        ></a-input>
      </a-form-item>
      <a-form-item label="事件名称" required="" name="event-name">
        <a-input
          v-model:value="formState['event-name']"
          placeholder="支持中英文、数字、'_'和'-'，不超过64个字符"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="适用类型" required="">
        <a-checkbox
          v-for="type in ObjTypeEnumLists"
          :key="type.key"
          :value="type.key"
          v-model:checked="type.checked"
        >
          {{ type.value }}
        </a-checkbox>
      </a-form-item>
      <a-form-item label="默认选中">
        <a-switch v-model:checked="detail.selectedByDefault"></a-switch>
      </a-form-item>
      <a-form-item label="描述" name="event-desc">
        <a-textarea
          placeholder="请输入"
          :rows="4"
          :maxLength="255"
          v-model:value="formState['event-desc']"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { EventSimpleDto } from "@/types/event.type";
import { ObjTypeEnum } from "@/types/object.type";
import { getEventDetail, updateEvent } from "@/services/event.service";
import { codeValidator, nameValidator } from "@/utils/validator";
import store from "@/store";

export default defineComponent({
  name: "EventEditModal",
  setup() {
    const _codeValidator = codeValidator;
    const _nameValidator = nameValidator;
    const ObjTypeEnumLists = reactive<
      { key: string; value: string; checked: boolean }[]
    >(store.state.objectType.map((obj) => ({ ...obj, checked: false })));

    const rules = reactive({
      "event-code": [
        { required: true, message: "此字段为必填字段" },
        { max: 64, message: "不超过64个字符" },
        { validator: codeValidator },
      ],
      "event-name": [
        { required: true, message: "此字段为必填字段" },
        { max: 64, message: "不超过64个字符" },
        { validator: nameValidator },
      ],
    });

    return {
      codeValidator: _codeValidator,
      nameValidator: _nameValidator,
      ObjTypeEnumLists,
      rules,
    };
  },

  props: {
    id: {},
  },
  data() {
    const _detail: EventSimpleDto = null;
    const _pageChecked = false;
    const _elementChecked = false;

    return {
      detail: _detail,
      pageChecked: _pageChecked,
      elementChecked: _elementChecked,
      formState: {
        "event-name": "",
        "event-code": "",
        "event-desc": "",
      },
    };
  },

  async created() {
    this.detail = await getEventDetail(this.id);
    const { applicableObjTypes } = this.detail;

    this.formState = {
      "event-name": this.detail.name,
      "event-code": this.detail.code,
      "event-desc": this.detail.description,
    };
    this.ObjTypeEnumLists.forEach((obj) => {
      obj.checked = applicableObjTypes.includes(ObjTypeEnum[obj.key]);
    });
  },

  methods: {
    handleOk() {
      if (this.ObjTypeEnumLists.every((v) => !v.checked)) {
        this.$message.error("必须选中一个适用类型~");
        return;
      }

      this.$refs.formRef.validateFields().then((values: any) => {
        const data = {
          code: values["event-code"],
          name: values["event-name"],
          description: values["event-desc"],
          selectedByDefault: this.detail.selectedByDefault,
          applicableObjTypes: this.ObjTypeEnumLists.filter(
            (v) => v.checked
          ).map((v) => ObjTypeEnum[v.key]),
        };

        updateEvent({ id: this.id, ...data })
          .then(() => {
            this.$message.success("编辑成功");
            this.$emit("handlerOk");
          })
          .catch((e) => {
            this.$handleError(e, "编辑");
          });
      });
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

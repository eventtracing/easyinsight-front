<template>
  <u-modal
    :visible="true"
    title="添加事件类型"
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
        ></a-input>
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
        <a-switch v-model:checked="selectedByDefault"></a-switch>
      </a-form-item>
      <a-form-item label="描述" name="event-desc">
        <a-textarea
          v-model:value="formState['event-desc']"
          placeholder="请输入"
          :maxLength="255"
          :rows="4"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </u-modal>
</template>

<script lang="tsx">
import { ObjTypeEnum } from "@/types/object.type";
import { reactive, ref } from "vue";
import { addNewEvent } from "@/services/event.service";
import { codeValidator, nameValidator } from "@/utils/validator";
import store from "@/store";

export default {
  setup() {
    const formRef = ref(null);
    const ObjTypeEnumLists = reactive<
      { key: string; value: string; checked: boolean }[]
    >(
      store.state.objectType
        .slice(0, 4)
        .map((obj) => ({ ...obj, checked: false }))
    );
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
    const formState = reactive({
      "event-name": "",
      "event-code": "",
      "event-desc": "",
    });

    // 默认选中
    const selectedByDefault = ref<boolean>(false);

    return {
      ObjTypeEnumLists,
      formState,
      selectedByDefault,
      rules,
      formRef,
    };
  },
  methods: {
    handleOk() {
      if (this.ObjTypeEnumLists.every((v) => !v.checked)) {
        this.$message.error("必须选中一个适用类型~");
        return;
      }

      this.formRef.validateFields().then((values: any) => {
        const data = {
          code: values["event-code"],
          name: values["event-name"],
          description: values["event-desc"],
          selectedByDefault: this.selectedByDefault,
          applicableObjTypes: this.ObjTypeEnumLists.filter(
            (v) => v.checked
          ).map((v) => ObjTypeEnum[v.key]),
        };

        addNewEvent(data)
          .then(() => {
            this.$message.success("添加成功");
            this.$emit("handlerOk");
          })
          .catch((e) => {
            this.$handleError(e, "添加");
          });
      });
    },

    handleClose() {
      // @ts-ignore
      this.$emit("handlerClose");
    },
  },
};
</script>

<template>
  <a-modal
    :title="modalTitle"
    :visible="showModal"
    @cancel="showModal = false"
    @ok="submit"
  >
    <a-form
      :model="formState"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="产品名称" name="name">
        <a-input
          placeholder="请输入产品名称"
          v-model:value="formState.name"
        ></a-input>
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea
          :rows="4"
          placeholder="请输入描述"
          :max-length="256"
          v-model:value="formState.description"
        ></a-textarea>
      </a-form-item>
      <a-form-item label="管理员" name="admins">
        <a-select
          mode="multiple"
          placeholder="请选择成员，可多选"
          v-model:value="formState.admins"
          :options="
            admins.map((admin) => ({
              value: admin.userId,
              label: `${admin.userName}(${admin.email})`,
            }))
          "
          :filterOption="filterOption"
        >
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import { addApp, editApp, getAppUserLists } from "@/services/authority.service";
import { codeValidator } from "@/utils/validator";
interface ProductDTO {
  name: string;
  code?: string | number;
  email: string;
  uuid?: string;
  admins?: any[];
  id?: string | number;
}
export default defineComponent({
  name: "OptionProduct",

  setup(props) {
    const product = props.product;
    const _codeValidator = codeValidator;

    const _memberTemplate: ProductDTO = reactive({
      name: "",
      email: "",
      uuid: uuidv4(),
    });

    const rules = reactive({
      name: [{ required: true, message: "请输入产品名称" }],
      description: [{ message: "请输入描述" }],
      admins: [{ required: true, message: "请选择管理员" }],
    });

    watch(
      () => props.product,
      function (product) {
        formState.name = product.name;
        formState.description = product.description;
        formState.admins = (product.admins || []).map((admin) => admin.id);
      }
    );

    const formState = reactive({
      name: product.name,
      description: product.description,
      admins: product.admins,
    });

    return {
      codeValidator: _codeValidator,
      memberTemplate: _memberTemplate,
      rules,
      formState,
    };
  },

  props: {
    status: {
      type: String,
      default: "add",
      required: false,
    },
    product: {
      type: Object,
      default: () => {},
      required: false,
    },
    visible: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    modalTitle() {
      return (this.status === "add" ? "新增" : "编辑") + "产品";
    },

    isEdit() {
      return this.status === "edit";
    },

    showModal: {
      get() {
        return this.visible;
      },

      set(value) {
        this.$emit("update:visible", value);
      },
    },

    formRef() {
      return this.$refs.formRef;
    },
  },

  data() {
    const _admins = [];
    const _form = null;
    return {
      admins: _admins,
      form: _form,
    };
  },

  created() {
    this.form = this.formRef;
    getAppUserLists().then((res) => {
      this.admins = res;
    });
  },

  methods: {
    // 提交信息
    submit() {
      this.$refs.formRef.validateFields().then((value) => {
        const params = {
          code: window.localStorage.appId,
          name: value.name,
          description: value.description,
          admins: value.admins.map((adminId) => {
            const admin =
              this.admins.find((admin) => admin.userId === adminId) || {};
            admin.id = admin.userId;
            return admin;
          }),
          ...(this.isEdit && {
            id: this.product.id,
          }),
        };
        let promise = Promise.resolve();

        if (this.isEdit) {
          promise = editApp(params);
        } else {
          promise = addApp(params);
        }

        promise.then(() => {
          this.$message.success(this.isEdit ? "编辑成功" : "新增成功");
          this.showModal = false;
          this.$emit("searchLists");
        });
      });
    },

    resetFields(visible) {
      if (!visible) {
        this.$refs.formRef.resetFields();
        this.$emit("close");
      }
    },
    filterOption(input, option) {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
  watch: {
    showModal: {
      handler: "resetFields",
    },
  },
});
</script>

<style lang="less">
.m-icon__font {
  font-size: 16px;
  margin-bottom: 18px;
  cursor: pointer;
  user-select: none;
}
</style>

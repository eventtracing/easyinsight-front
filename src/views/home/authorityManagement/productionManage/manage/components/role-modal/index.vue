<template>
  <a-modal
    :visible="visible"
    :title="type === 'add' ? '新建角色' : '编辑角色'"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form
      :model="formState"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="角色名称" name="roleName">
        <a-input v-model:value="formState.roleName"></a-input>
      </a-form-item>
      <a-form-item label="角色描述" name="description">
        <a-input type="textarea" v-model:value="formState.description"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'RoleModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    detail: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    formRef() {
      return this.$refs.formRef
    }
  },

  data() {
    const _form = null
    const _rules = {
      roleName: [
        {
          required: true,
          message: '请填写角色名称'
        }
      ]
    }
    const formState = {
      roleName: '',
      description: ''
    }
    return {
      form: _form,
      rules: _rules,
      formState
    }
  },

  created() {
    this.form = this.formRef
  },

  methods: {
    handleCancel() {
      this.$emit('handlerCancel')
      this.$refs.formRef.resetFields()
    },

    handleOk() {
      this.$refs.formRef.validateFields().then((values) => {
        this.$emit('handleRoleModalOk', values)
      })
    },

    setFields(visible) {
      if (visible && this.type === 'edit') {
        setTimeout(() => {
          const { roleName, description } = this.detail
          this.formState = {
            roleName,
            description
          }
        }, 0)
      } else {
        this.formState = {
          roleName: '',
          description: ''
        }
      }
    }
  },
  watch: {
    visible: {
      handler: 'setFields'
    }
  }
})
</script>

<style scoped="true" lang="less"></style>

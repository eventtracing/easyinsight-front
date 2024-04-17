<template>
  <a-modal
    :visible="visible"
    :title="type === 'add' ? '新建域' : '编辑域'"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form
      :model="formState"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="域ID" name="code">
        <a-input :disabled="type !== 'add'" v-model:value="formState.code"></a-input>
      </a-form-item>
      <a-form-item label="域名称" name="name">
        <a-input :disabled="type === 'view'" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="域负责人" name="email">
        <a-input
          :disabled="type === 'view'"
          v-model:value="formState.email"
          placeholder="请输入邮箱账号"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DomainMoadl',
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
      code: [
        {
          required: true,
          message: '请填写角色名称'
        }
      ],
      name: [
        {
          required: true,
          message: '请填写域名称'
        }
      ],
      email: [
        {
          required: true,
          message: '请输入邮箱账号'
        }
      ]
    }
    return {
      form: _form,
      rules: _rules,
      formState: {
        code: '',
        name: '',
        email: ''
      }
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
        this.$emit('handleOk', values)
      })
    },

    setFields(visible) {
      if (visible) {
        if (this.type !== 'add') {
          setTimeout(() => {
            const { code, name, owner } = this.detail
            this.formState = {
              code,
              name,
              email: owner.email
            }
          }, 0)
        } else {
          this.formState = {
            code: '',
            name: '',
            email: ''
          }
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

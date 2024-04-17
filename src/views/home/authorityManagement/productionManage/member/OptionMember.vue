<template>
  <a-modal :title="modalTitle" :visible="showModal" @cancel="showModal = false" @ok="handleOk">
    <a-form
      :model="formState"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="成员" v-if="status === 'add'" name="users">
        <a-textarea
          placeholder="请输入邮箱账号，支持多个，并用回车进行分隔"
          :rows="4"
          v-model:value="formState.users"
        ></a-textarea>
      </a-form-item>
      <a-form-item label="成员" v-if="status === 'edit'">
        <span>{{ member.userName || '' }}</span>
      </a-form-item>
      <a-form-item label="邮箱账号" v-if="status === 'edit'">
        <span>{{ member.email || '' }}</span>
      </a-form-item>
      <a-form-item label="云音乐 ID" v-if="status === 'edit' && appId === '4'" name="musicUserId">
        <a-input placeholder="请输入云音乐 ID" v-model:value="formState.musicUserId"> </a-input>
      </a-form-item>
      <a-form-item label="角色" name="roleIds" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-select mode="multiple" option-label-prop="children" v-model:value="formState.roleIds">
          <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">
            {{ role.roleName }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'OptionMember',

  setup() {
    const _showBatchAdd = false

    return {
      showBatchAdd: _showBatchAdd
    }
  },

  props: {
    status: {
      type: String,
      default: 'add',
      required: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    member: {
      type: Object,
      default: null,
      required: false
    },
    roleList: {
      type: Array,
      default: () => [],
      required: true
    },
    appId: {
      type: String,
      default: null,
      required: false
    }
  },
  computed: {
    modalTitle() {
      return (this.status === 'add' ? '新增' : '编辑') + '成员'
    },

    isEdit() {
      return this.status === 'edit'
    },

    showModal: {
      get() {
        return this.visible
      },

      set(value) {
        this.$emit('update:visible', value)
      }
    },

    formRef() {
      return this.$refs.formRef
    }
  },

  data() {
    const formState = {
      users: '',
      roleIds: [],
      musicUserId: null
    }
    const _form = null
    const _rules = {
      users: [
        {
          required: true,
          message: '请填写成员'
        }
      ],
      roleIds: [
        {
          required: true,
          message: '请选择角色'
        }
      ]
    }
    return {
      form: _form,
      formState,
      rules: _rules
    }
  },

  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values) => {
        this.$emit('onOk', { ...values, ...(this.isEdit ? { users: this.member.email } : null) })
      })
    },

    setFormInitialValues(showModal) {
      if (this.status === 'edit' && showModal) {
        setTimeout(() => {
          this.formState.roleIds = this.member?.roles?.map((role) => role.id)
        }, 0)
      }
    },

    resetFields(status) {
      if (!status) {
        this.$refs.formRef.resetFields()
      }
    }
  },
  watch: {
    showModal: ['setFormInitialValues', 'resetFields'],
    member(member = {}) {
      this.formState.users = member.users
      this.formState.roleIds = member.roleIds
      this.formState.musicUserId = member.musicUserId
    }
  }
})
</script>

<style lang="less">
.m-icon__font {
  font-size: 16px;
  margin-bottom: 18px;
  cursor: pointer;
  user-select: none;
}
</style>

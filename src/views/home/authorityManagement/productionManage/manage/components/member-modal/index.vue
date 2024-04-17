<template>
  <a-modal :visible="visible" title="添加成员" @cancel="handleCancel" @ok="handleOk" :width="650">
    <a-form layout="vertical" ref="formRef">
      <a-form-item label="成员" required="">
        <a-transfer
          :rowKey="(record) => record.id.toString()"
          :data-source="data"
          show-search
          :target-keys="targetKeys"
          :list-style="{
            width: '250px',
            height: '300px'
          }"
          :render="(item) => `${item.title}(${item.email})`"
          @change="handleChange"
        >
          <template #notFoundContent><span> 没数据 </span></template>
        </a-transfer>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getUserList } from '@/services/auth.service'
export default defineComponent({
  name: 'MemberModal',

  setup() {
    const _location = localStorage.getItem('appId')

    return {
      location: _location
    }
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formRef() {
      return this.$refs.formRef
    }
  },

  data() {
    const _targetKeys = []
    const _data = []
    return {
      targetKeys: _targetKeys,
      data: _data
    }
  },

  created() {
    getUserList().then((res) => {
      this.data = res.map((item) => {
        return {
          email: item.email,
          title: item.userName,
          id: `${item.id}`,
          key: `${item.id}`
        }
      })
    })
  },

  methods: {
    handleChange(targetKeys) {
      this.targetKeys = targetKeys
    },

    handleCancel() {
      this.$emit('handlerCancel')
      this.targetKeys = []
    },

    handleOk() {
      if (!this.targetKeys.length) {
        this.$message.warning('请选择成员')
        return
      }

      const users = []
      this.targetKeys.forEach((id) => {
        const item = this.data.find((item) => item.id === id) || {} // eslint-disable-next-line @typescript-eslint/no-unused-vars

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { key, ...others } = item
        users.push(others)
      })
      this.$emit('handleOk', users)
    }
  }
})
</script>

<style scoped="true" lang="less"></style>

<template v-if="formState.id">
  <a-checkbox v-model:checked="checked" @change="handleCheck"></a-checkbox>
</template>

<script lang="tsx">
import { defineComponent, createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { ignoreCheck } from '@/services/test/realTime/index.service'

export default defineComponent({
  name: 'IgnoreCheckbox',
  props: ['index', 'record', 'conversationId'],
  data() {
    return {
      checked: false
    }
  },

  methods: {
    handleCheck(ev) {
      const value = ev.target.checked

      if (!value) {
        this.checked = value
        return
      }

      Modal.confirm({
        title: '温馨提示',
        content: createVNode('div', {}, [
          createVNode(
            'div',
            {},
            '请确认以下待测分支是否不需要回归，这些待测试分支将不会计入覆盖率，请谨慎操作避免导致线上问题'
          ),
          createVNode(
            'div',
            {
              style: { 'margin-top': '12px' }
            },
            `【${this.record.spm}，参数：${this.record.paramCode}，取值：${this.record.paramValue}】`
          )
        ]),
        onOk: () => {
          this.submit()
        },
        onCancel: () => {
          this.checked = false
        }
      })
    },
    async submit() {
      try {
        const { spm, eventCode, paramCode, paramValue } = this.record || {}

        await ignoreCheck({
          conversationId: this.conversationId,
          branches: [
            {
              spm,
              eventCode,
              paramCode,
              paramValue
            }
          ]
        })

        this.checked = true
        message.success('操作成功')

        // 更新显示，操作 extraRecords, shouldCoverData
        this.$emit('onDelete', this.index)
      } catch (err) {
        this.checked = false
        message.error(err.msg ?? err.message)
      }
    }
  }
})
</script>

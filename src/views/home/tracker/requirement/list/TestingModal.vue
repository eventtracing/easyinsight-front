<template>
  <u-modal
    :visible="true"
    title="测试完成"
    :confirmLoading="confirmLoading"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <p style="color: orange">
      由于任务最近测试记录失败，如确认当前不是最终状态，选择一个正确的测试记录，才可往下流转
    </p>
    <a-table
      :rowKey="(record) => record.code"
      :columns="columns"
      :rowSelection="rowSelection"
      :dataSource="list"
    >
      <template #testResult="{ record }">
        <span :style="{ color: resultOption[record.testResult]?.color }">
          {{ resultOption[record.testResult]?.text }}
        </span>
      </template>
      <template #saveTime="{ record }">
        <span>{{ showTime(record.saveTime) }}</span>
      </template>
    </a-table>
    <a-textarea class="g-mb-16" :rows="4" v-model:value="comment" placeholder="输入"></a-textarea>
  </u-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { User } from '@/types/common.type'
import moment from 'moment'
// import { DeliverTypeEnum, DeliverTargetEnum } from "@/types/requirement.type";
import { forwardTask } from '@/services/requirement.service'
import { message } from 'ant-design-vue'
export default defineComponent({
  name: 'TestingModal',
  props: {
    list: {
      default: () => []
    },
    record: {
      default: () => {}
    }
  },
  computed: {
    formRef() {
      return this.$refs.formRef
    },
    rowSelection() {
      return {
        columnWidth: 48,
        type: 'radio',
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRow) => {
          this.selectedRowKeys = selectedRowKeys
        }
      }
    }
  },

  data() {
    const _form: any = null
    const _selectedRowKeys: any = []
    const _comment = ''
    const _resultOption = {
      0: {
        color: 'red',
        text: '不通过'
      },
      1: {
        color: 'green',
        text: '通过'
      },
      2: {
        color: 'orange',
        text: '部分通过'
      }
    }
    const _columns: any = [
      {
        key: 'userName',
        width: 80,
        title: '测试人',
        dataIndex: 'userName'
      },
      {
        key: 'testResult',
        width: 80,
        title: '测试状态',
        slots: {
          customRender: 'testResult'
        }
      },
      {
        key: 'saveTime',
        width: 120,
        title: '测试时间',
        dataIndex: 'saveTime',
        slots: {
          customRender: 'saveTime'
        }
      }
    ]

    return {
      form: _form,
      formState: {},
      columns: _columns,
      comment: _comment,
      selectedRowKeys: _selectedRowKeys,
      resultOption: _resultOption
    }
  },

  async created() {
    this.form = this.formRef
  },

  methods: {
    handleOk() {
      const { id } = this.record
      if (this.list.length > 0) {
        const code = this.selectedRowKeys[0]
        const comment = this.comment
        if (code && comment) {
          forwardTask(id, code, comment).then(() => {
            message.success('操作成功！')
            this.$emit('handlerOk')
          })
        } else {
          message.error('请选择测试记录，并填写备注！')
        }
      } else {
        const comment = this.comment
        if (comment) {
          forwardTask(id, null, comment).then((res) => {
            message.success('操作成功！')
            this.$emit('handlerOk')
          })
        } else {
          message.error('请填写备注！')
        }
      }
    },
    showTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleClose() {
      this.$emit('handlerClose')
    }
  }
})
</script>

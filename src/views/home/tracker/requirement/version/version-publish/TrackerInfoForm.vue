<template>
  <div>
    <div class="text-title g-m-tb-16">埋点信息</div>
    <u-info class="g-pl-12" size="large" :labelWidth="80" itemsAlign="center">
      <u-info-item label="终端">{{ tracker.terminalName }}</u-info-item>
      <u-info-item label="事件类型">
        <a-form-item style="margin-bottom: 0" name="tracker-events">
          <a-select
            style="width: 598px"
            :disabled="disabled"
            placeholder="请选择事件类型"
            allowClear=""
            mode="multiple"
            :getPopupContainer="$getPopupContainer"
            option-label-prop="title"
            @change="onEventChange($event)"
            v-model="tracker.eventIds"
          >
            <a-select-option v-for="t in events" :key="t.id" :value="t.id" :title="t.code">
              {{ `${t.code}（${t.name}）` }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </u-info-item>
    </u-info>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { EventSimpleDto } from '@/types/event.type'
import { getEventList } from '@/services/event.service'
export default defineComponent({
  name: 'TrackerInfoForm',
  props: {
    tracker: {},
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const _events: EventSimpleDto[] = []
    const _rules = {
      'tracker-events': [
        {
          required: true,
          message: '此字段为必填字段'
        }
      ]
    }
    return {
      events: _events,
      rules: _rules
    }
  },

  async created() {
    this.events = (
      await getEventList({
        currentPage: 1,
        pageSize: 80,
        search: ''
      })
    ).list
  },

  methods: {
    onEventChange(v) {
      this.tracker.eventIds = v
    }
  }
})
</script>

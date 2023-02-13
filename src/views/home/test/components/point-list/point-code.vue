<template>
  <div class="code-wrapper">
    <div>
      <div v-if="Array.isArray(data)">
        <div class="item-title border-bottom item-sign">{{ data.abstract ? '[' : '{' }}</div>
        <div class="item-children" v-for="(item, index) of data" :key="index">
          <div v-if="item" class="item-children">
            <point-code :data="item" :showError="showError"></point-code>
          </div>
        </div>
        <div class="item-title border-bottom item-sign">{{ data.abstract ? '],' : '},' }}</div>
      </div>
      <div v-else-if="typeof data === 'object'">
        <div class="item-children" v-for="(value, name, index) in data" :key="index">
          <div class="item-title border-bottom item-sign" v-if="!data.abstract">{</div>
          <br v-if="name.includes('br')" />
          <div
            class="item-title border-bottom"
            :class="value && value.cause && showError ? 'error' : ''"
            style="margin-top: 3px"
            v-else-if="name !== 'abstract'"
          >
            <span class="flex-none">{{ name }} :</span>
            <div
              v-if="
                (typeof value === 'object' && !'value' in value) ||
                (Array.isArray(value) && value.every((item) => !item.value))
              "
              class="item-children"
            >
              <point-code :data="value" :showError="showError"></point-code>
            </div>
            <span v-else>
              <span class="item-value">
                <span class="flex-none c-tracker__value">{{
                  typeof value === 'object' ? value.value : value
                }}</span>
                <span>, </span>
                {{ value && value.comment ? `// ${value.comment}` : '' }}
                <span v-if="value && value.cause && showError" class="error-message">
                  错误信息：{{ value ? value.cause : '' }}
                </span>
              </span>
            </span>
          </div>
          <div class="item-title border-bottom item-sign" v-if="!data.abstract">},</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'point-code',
  props: {
    data: {},
    showError: {}
  }
})
</script>

<style scoped="true" lang="less">
.item-title {
  padding: 0 0.2rem;
  text-align: left;
  display: inline-block;
  color: rgb(38, 189, 113);
  display: flex;
}
.flex-none {
  flex: none;
}
.item-sign,
.item-value {
  color: #102048;
  display: flex;
}

.item-value {
  display: unset;
}

.item-children {
  padding: 0 0 0 1rem;
}
.error {
  color: #79809a;
  background-color: #f8d1d6;
}

.error-message {
  color: #d4001a;
  margin-left: 10px;
}
.code-wrapper {
  width: 100% !important;
}
.c-tracker__value {
  white-space: pre-line;
  word-break: break-all;
}
</style>

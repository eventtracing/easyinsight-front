<template>
  <div class="content" :ref="getContentRef" @scroll.passive="getContent">
    <div class="virtual-content" :ref="getVirtualRef">
      <div v-for="content in virtualContent" :key="content[loopKey]">
        <slot :item="content"></slot>
      </div>
    </div>
    <div class="real-content" :ref="getRealContentRef">
      <div v-for="content in realContent" :key="content.id">
        <slot :item="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { shallowRef, reactive, watch, defineComponent, nextTick } from 'vue'

export default defineComponent({
  name: 'UVirtualScroll',
  props: {
    data: {
      default: () => [],
      required: false,
      type: Array
    },
    loopKey: {
      default: 'id',
      type: String
    }
  },
  setup(props: { data: Array<any>; loopKey: string }) {
    // 外部传入的值
    const { data } = props

    // 局部变量声明
    const virtualRef = shallowRef<HTMLDivElement>(null)
    const contentRef = shallowRef<HTMLDivElement>(null)
    const realContentRef = shallowRef<HTMLDivElement>(null)
    const children = shallowRef<Element[]>(null)
    const childrenHeight = shallowRef<number[]>(null)
    const screenClientHeight = shallowRef<number>(0)
    const virtualContent = reactive<any[]>(data || [])
    const realContent = reactive([])
    const start = 0
    let end = 0
    let size = 0

    function getScreenSize() {
      var size = 0
      var height = 0
      var sizeStart = start
      while (true) {
        const currentItem = childrenHeight.value[sizeStart]
        if (currentItem) {
          height += currentItem
          if (height <= screenClientHeight.value) {
            size += 1
          } else if (height % screenClientHeight.value > 0) {
            size += 1
            break
          } else {
            break
          }
        } else {
          break
        }

        sizeStart++
      }
      return size
    }

    function getStart(scrollTop) {
      var height = 0
      var start = 0
      var i = 0
      while (true) {
        const currentItem = childrenHeight.value[i]
        if (currentItem) {
          height += currentItem
          if (height >= scrollTop) {
            start = i
            break
          }
        } else {
          break
        }
        i++
      }

      return start
    }

    function getContent() {
      const scrollTop = contentRef.value.scrollTop
      realContent.length = 0
      const start = getStart(scrollTop)
      size = getScreenSize()
      end = start + size + 1
      const list = children.value.slice(start, end)
      realContent.push(...list)
      const transformY = childrenHeight.value.slice(0, start).reduce((prev, next) => {
        return (prev += next)
      }, 0)
      realContentRef.value.style.transform = `translateY(${transformY}px)`
    }

    watch(
      () => props.data,
      function (n) {
        virtualContent.length = 0
        virtualContent.push(...n.slice(0))
        nextTick().then(() => {
          const virtualContentRef = virtualRef.value
          const height = virtualContentRef.clientHeight
          virtualContentRef.style.height = height + 'px'
          screenClientHeight.value = contentRef.value.clientHeight
          children.value = virtualContent.slice(0)
          childrenHeight.value = Array.from(virtualRef.value.children).map((v) => v.clientHeight)
          getContent()
          virtualContent.length = 0
        })
      }
    )

    function getVirtualRef(el) {
      virtualRef.value = el
    }

    function getContentRef(el) {
      contentRef.value = el
    }

    function getRealContentRef(el) {
      realContentRef.value = el
    }

    return {
      getVirtualRef,
      getContentRef,
      getRealContentRef,
      getContent,
      realContent,
      virtualContent
    }
  }
})
</script>

<style scoped lang="less">
.content {
  position: relative;
  flex: 1;
  overflow-y: auto;
}
.real-content {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 10;
}
</style>

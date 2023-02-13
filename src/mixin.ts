import { defineComponent } from 'vue'
import { _RouteLocationBase } from 'vue-router'
import { createInstance, InstanceConfig } from '@/ndsc-vue3/utils/lib'

// @ts-ignore
const requestAnimation =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame

export default defineComponent({
  data() {
    return {
      defferMoule: 0
    }
  },

  computed: {
    menuLists() {
      return this.$store.state.menuLists
    },
    navMap() {
      return this.$store.state.navMap
    }
  },

  methods: {
    $handleError(e: Error, type?: string): void {
      const msg = e?.message ? `${type ? `${type}失败：` : ''}${e.message}` : `${type}失败`
      this.$message.error(msg)
    },

    $createInstance(
      vueConstructor: any,
      props: Omit<InstanceConfig, 'parentContext'> & Record<string, any>
    ) {
      return createInstance(
        vueConstructor,
        {
          parentContext: this,
          ...props
        },
        this.$store
      )
    },

    $getPopupContainer(triggerNode) {
      return (triggerNode && triggerNode.parentNode) || document.body
    },

    $navToNewTab(to: _RouteLocationBase) {
      const { href } = this.$router.resolve(to)
      window.open(href, '_blank')
    },

    $filterOption(input: any, option: any) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.trim().toUpperCase()) >= 0
      )
    },

    moduleRender() {
      this.defferMoule++
      if (this.defferMoule >= 100) {
        // @ts-ignore
        return cancelAnimationFrame(this.moduleRender)
      }

      requestAnimation(this.moduleRender)
      return false
    },

    // @ts-ignore
    getQueryParams(key) {
      const value = this.$route.query[key]
      try {
        if (value) {
          return JSON.parse(value as string)
        }
      } catch (err) {
        return value
      }

      return null
    },

    // @ts-ignore
    setQueryParams(key, params) {
      const query = new URLSearchParams(window.location.search)
      query.set(key, params)
      window.history.replaceState(
        history.state,
        '',
        `${window.location.origin}${window.location.pathname}?${query.toString()}`
      )
    }
  }
})

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ThemeMixin',

  data() {
    const _curLink = null
    const _theme = 'light'
    return {
      curLink: _curLink,
      theme: _theme
    }
  },

  mounted() {
    this.loadStyle(`/${this.theme}.css`)
  },

  methods: {
    loadStyle(url) {
      if (!document) return
      const link = document.createElement('link')
      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.href = url
      const title = document.getElementsByTagName('title')[0]
      this.insertAfter(link, title)

      link.onload = () => {
        this.removeStyle()
        this.curLink = link
      }
    },

    removeStyle() {
      this.curLink && this.curLink.parentElement.removeChild(this.curLink)
    },

    insertAfter(newElement, targetElement) {
      const parent = targetElement.parentNode

      if (parent.lastChild === targetElement) {
        parent.appendChild(newElement)
      } else {
        parent.insertBefore(newElement, targetElement.nextSibling)
      }
    },

    switchTheme() {
      this.loadStyle(`/${this.theme}.css`)
    }
  },
  watch: {
    theme: {
      handler: 'switchTheme'
    }
  }
})
</script>

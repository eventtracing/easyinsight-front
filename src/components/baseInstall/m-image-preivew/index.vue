<template>
  <div class="m-image__preview" v-if="visible" @mousewheel="mousewheel($event)">
    <transition appear name="opacitys">
      <div class="m-mask" v-if="visible"></div>
    </transition>
    <div class="m-image__slider">
      <div class="m-slider" ref="slider" @click.stop="">
        <div class="m-image__slide" v-for="img in imageLists" :key="img.url">
          <img class="m-image__img" :src="img.url" />
        </div>
      </div>
    </div>
    <LeftOutlined class="arrow-left arrow" @click.stop="slideImage('left')" />
    <RightOutlined class="arrow-right arrow" @click.stop="slideImage('right')" />
    <icon-font type="icon-close" class="arrow-close" @click="visible = false"></icon-font>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  name: 'ImagePreview',
  components: {
    LeftOutlined,
    RightOutlined
  },
  props: {
    imageLists: {
      default: () => []
    },
    initialIndex: {
      default: 0
    }
  },
  computed: {
    slider() {
      const slider: typeof HTMLDivElement = this.$refs.slider
      return slider
    }
  },

  data() {
    // @ts-ignore
    const _active: number = this.initialIndex
    const _visible = false
    const _clientWidth: number = document.documentElement.clientWidth
    return {
      active: _active,
      visible: _visible,
      clientWidth: _clientWidth
    }
  },

  methods: {
    show(visible) {
      this.visible = visible
    },

    // 滑动图片
    slideImage(option) {
      this.$nextTick(() => {
        if (!this.slider) return
        this.active = option === 'right' ? this.active - 1 : this.active + 1
        const length = this.imageLists.length

        if (this.active < -length + 1) {
          this.active = 0
        } else if (this.active === 1 && option === 'left') {
          this.active = -length + 1
        }

        this.slider.style.setProperty('--left', `${this.clientWidth * this.active}px`)
      })
    },

    mousewheel(ev) {
      // @ts-ignore
      const target = Array.from(this.slider.children)[-this.active].children[0]
      const img = this.imageLists[-this.active]
      img.precent = img.precent || 1
      let down = true // 定义一个标志，当滚轮向下滚时，执行一些操作

      // 定义一个标志，当滚轮向下滚时，执行一些操作
      down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0

      if (down) {
        img.precent *= 0.8
      } else {
        img.precent *= 1.2
      } // @ts-ignore

      // @ts-ignore
      target.style.setProperty('--zoom', img.precent)
    },

    changeActive(n) {
      this.active = -n
      this.$nextTick(() => {
        if (!this.slider) return
        this.slider.style.setProperty('--left', `${this.clientWidth * this.active}px`)
      })
    }
  },
  watch: {
    initialIndex: {
      handler: 'changeActive'
    }
  }
})
</script>

<style scoped="true" lang="less">
.m-image__preview {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  .m-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.25);
  }
  .m-image__slider {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    min-width: 70%;
    min-height: 500px;
    margin: auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .m-slider {
    --left: 0;
    width: fit-content;
    display: flex;
    transition: transform 0.3s ease-in-out;
    transform: translate3d(var(--left), 0, 0);
  }
  .m-image__slide {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .arrow-close {
    position: absolute;
    font-size: 40px;
    right: 20px;
    top: 10px;
    color: #fff;
    cursor: pointer;
  }
  .m-image__img {
    --zoom: 1;
    width: 60%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    transform: scale(var(--zoom));
  }
  .arrow {
    position: absolute;
    top: 50%;
    font-size: 40px;
    transform: translateY(-50%);
    color: #fff;
    user-select: none;
    cursor: pointer;
    &-left {
      left: 5%;
    }
    &-right {
      right: 5%;
    }
  }
}
</style>

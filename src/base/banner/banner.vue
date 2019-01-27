<template>
  <div class="banner" ref="banner">
    <div class="banner-group" ref="bannerGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span :class="{'active': currentPageIndex===index}" class="dot" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script>
import {addClass} from '../../common/js/dom'
import Bscroll from 'better-scroll'

export default {
  name: 'banner',
  props: {
    loop: { // 是否可以轮播
      type: Boolean,
      default: true
    },
    autoPlay: { // 是否可以自动播放
      type: Boolean,
      default: true
    },
    interval: { // 自动轮播的间隔时间
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [], // 存放小圆点
      currentPageIndex: 0 // 当前页面的索引
    }
  },
  methods: {
    _refresh () {
      if (this.slide) {
        this._setBannerWidth(true)
        this.slide.refresh()
      }
    },
    _setBannerWidth (isResize) {
      this.children = this.$refs.bannerGroup.children // 获取所有的子元素
      let width = 0
      let viewWidth = this.$refs.banner.clientWidth // 获取视口的宽度
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i] // 获取到每一个子元素
        addClass(child, 'item')
        child.style.width = viewWidth + 'px' // 每一张轮播图的宽赋值
        width += viewWidth
      }
      if (this.loop && !isResize) {
        width += 2 * viewWidth
      }
      this.$refs.bannerGroup.style.width = width + 'px'
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _initBanner () {
      this.slide = new Bscroll(this.$refs.banner, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      this.slide.on('scrollEnd', this._scrollEnd)
      this.slide.on('touchEnd', () => {
        if (this.autoPlay) {
          this._play()
        }
      })
      this.slide.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _scrollEnd () {
      let pageIndex = this.slide.getCurrentPage().pageX // better-scroll 会自动派发一个记录第几页的事件
      console.log(pageIndex)
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    _play () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slide.next()
      }, this.interval)
    }
  },
  mounted () {
    setTimeout(() => {
      this._setBannerWidth()
      this._initDots()
      this._initBanner()

      if (this.autoPlay) { // 初始化完成的时候，判读是否是自动轮播
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => { // 监听窗口宽度变化
      if (!this.slide) {
        return
      }
      clearTimeout(this.reTimer)
      this.reTimer = setTimeout(() => {
        if (this.slide.isInTransition) {
          this._scrollEnd()
        } else {
          if (this.autoPlay) {
            this._play()
          }
        }
        this._refresh()
      }, 30)
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .banner
    min-height 1px
    .banner-group
      position relative
      overflow hidden
      white-space nowrap
      .item
        float left
        box-sizing border-box
        overflow hidden
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
          img
            display block
            width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom .16rem
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 .08rem
        width .16rem
        height .16rem
        border-radius 50%
        background rgba(255, 255, 255, .4)
        transition all .2s linear
        &.active
          background $color-theme
</style>

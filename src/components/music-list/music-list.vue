<template>
  <div class="music-list">
    <div class="back" @click="backToSinger">
      <span class="iconfont icon-back-icon icon-back"></span>
      <span class="back-title">返回</span>
    </div>
    <div class="background-img" ref="bgImg">
      <img class="singer-img" :src="bgImage">
      <p class="singer-name">{{title}}<span v-show="aliaName.length">({{aliaName}})</span></p>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <div class="top-bg-layer" ref="topLayer">{{title}}<span v-show="aliaName.length">({{aliaName}})</span></div>
    <scroll @scroll="onscrollEvent" class="list" :probe-type="probeType" :listen-scroll="listenScroll" ref="list">
      <div class="music-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../base/scroll/scroll'
import SongList from '../../base/song-list/song-list'
import {prefixStyle} from '../../common/js/dom'
import Loading from '../../base/loading/loading'

const topHeight = 44 // 定义顶部预留高度
const transform = prefixStyle('transform')

export default {
  name: 'music-list',
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    aliaName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  methods: {
    backToSinger () {
      this.$router.back()
    },
    onscrollEvent (pos) {
      this.scrollY = pos.y
    }
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let proportion = -newY / (this.imageHeight - 44) // 记录移动的比例
      let scale = 1
      const percent = Math.abs(newY / this.imageHeight)
      this.$refs.topLayer.style[transform] = `translate3D(0,${proportion * topHeight}px,0)`
      if (proportion >= 1) {
        this.$refs.topLayer.style[transform] = `translate3D(0,${topHeight}px,0)`
      }
      if (newY > 0) {
        scale = 1 + percent
      }
      this.$refs.layer.style[transform] = `translate3D(0,${translateY}px,0)`
      this.$refs.layer.style[transform] = `webkitTranslate3D(0,${translateY}px,0)`
      this.$refs.bgImg.style[transform] = `scale(${scale})`
      this.$refs.bgImg.style[transform] = `scale(${scale})`
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.imageHeight = this.$refs.bgImg.clientHeight // 记录蒙层滚动的最大距离
    this.minTranslateY = -this.imageHeight + topHeight
    this.$refs.list.$el.style.top = `${this.$refs.bgImg.clientHeight}px`
  },
  components: {Loading, SongList, Scroll}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .music-list
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    background #fafafa
    .back
      position absolute
      top .3rem
      left .24rem
      width 100%
      z-index 10
      color #fff
      .back-title
        float left
        font-size $font-size-m
      .icon-back
        float left
        font-size $font-size-m
    .background-img
      position relative
      width 100%
      height 0
      padding-top 81.3%
      overflow hidden
      transform-origin top
      .singer-img
        position absolute
        top 0
        left 0
        width 100%
        vertical-align middle
      .singer-name
        position absolute
        left .24rem
        bottom .3rem
        color #fff
        font-size $font-size-xl
    .bg-layer
      position relative
      height 100%
      background #fafafa
    .list
      position absolute
      top 0
      bottom 0
      width 100%
      background #fafafa
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
    .top-bg-layer
      position fixed
      width 100%
      height 44px
      top -44px
      left: 0
      background $color-linear-gradient
      z-index 1
      font-size $font-size-m
      line-height 44px
      text-align center
      color #fff
</style>
